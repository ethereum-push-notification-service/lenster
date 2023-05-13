import { useRef, useState } from 'react';
import { Button, Image, Modal } from 'ui';
import useOnClickOutside from '../useOnClickOutside';
import { useSigner } from 'wagmi';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import * as PushAPI from '@pushprotocol/restapi';
import { CHAIN_ID } from 'src/constants';
import { LENSHUB_PROXY } from 'data/constants';
import Search from '@components/Shared/Navbar/Search';
import { Profile } from 'lens';
import { MemberProfileList } from './usePushCreateGroupChat';
import router from 'next/router';
import useFetchLensProfiles from './useFetchLensProfiles';
import type { GroupDTO } from '@pushprotocol/restapi';

type GroupInfoModalProps = {
  groupInfo: GroupDTO
  show: boolean;
  setShow: (show: boolean) => void;
};


const useGroupInfoModal = (options: GroupInfoModalProps) => {
  const [showSearchmembers, setShowsearchMembers] = useState<boolean>(false);
  const [showSearchedmembertoAdd, setShowSearchedmembertoAdd] = useState<Array<Profile>>([]);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [updatedMembers, setUpdatedMembers] = useState<Profile[]>([]);
  const [adminAddresses, setAdminAddresses] = useState<Profile[]>([]);
  const [letssee, setLetssee] = useState<Profile[]>([]);
  const [showPendingmembers, setShowpendingMembers] = useState<boolean>(false);
  const { data: signer } = useSigner();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const { groupInfo, show, setShow } = options;
  const downRef = useRef(null);
  const { loadLensProfiles } = useFetchLensProfiles();
  const [chatProfile, setChatprofile] = useState<Profile[]>([]);
  const [chatProfilemembers, setChatprofilemembers] = useState<Profile[]>([]);
  const [chatpendingprofilemembers, setChatpendingprofilemembers] = useState<Profile[]>([]);
  const [showAdmins, setShowAdmins] = useState<Profile[]>([]);
  console.log(groupInfo, 'groupInfo');
  // console.log(showSearchedmembertoAdd, 'showSearchedmembertoAdd')

  // console.log(adminAddresses, 'adminAddressList');

  const handleCloseall = () => {
    setShow(false); setShowsearchMembers(false); setShowSearchedmembertoAdd([]); setUpdatedMembers([]); setAdminAddresses([]); setChatprofilemembers([]); setChatprofile([]); setShowpendingMembers(false);
  }

  useOnClickOutside(downRef, () => { handleCloseall() });

  const onProfileSelected = (profile: Profile) => {
    setShowSearchedmembertoAdd((prevMembers) => [...prevMembers, profile])
  }

  const onAddMembers = (profile: Profile) => {
    setShowSearchedmembertoAdd(showSearchedmembertoAdd.filter((member) => member !== profile))
    if (!groupInfo?.pendingMembers.some((member) => member.wallet.includes(profile.id)) && !groupInfo?.members.some((member) => member.wallet.includes(profile.id)) && !updatedMembers.some((member) => member.ownedBy === profile.ownedBy) &&
      updatedMembers.length < 9) {
      setUpdatedMembers((prevMembers) => [...prevMembers, profile])
    }
  }
  // console.log(updatedMembers, 'updatedMembers');

  const onRemoveMembers = (profile: Profile) => {
    setUpdatedMembers(updatedMembers.filter((member) => member !== profile))
  }

  const onMakeAdmin = (profile: Profile) => {
    const newMembers = updatedMembers.map((member) => {
      if (member.ownedBy === profile.ownedBy) {
        return {
          ...member,
          isAdmin: true
        }
      }
      return member;
    });
    setUpdatedMembers(newMembers);
    setAdminAddresses((prevMembers) => [...prevMembers, profile]);
  }

  const isOwner = (profile: Profile) => {
    const isCreator = groupInfo?.groupCreator.split(":")[4] === profile.id;
    console.log(isCreator, 'isCreator');
  }

  const removeAdmin = (profile: Profile) => {
    const newMembers = updatedMembers.map((member) => {
      if (member.ownedBy === profile.ownedBy) {
        return {
          ...member,
          isAdmin: false
        }
      }
      return member;
    });
    setAdminAddresses(adminAddresses.filter((member) => member.ownedBy !== profile.ownedBy));
    setUpdatedMembers(newMembers);
  }

  const removeUserAdmin = (profile: Profile) => {
    const updatedAdminAddress = adminAddresses.filter((admin) => admin.ownedBy !== profile.ownedBy)
    setAdminAddresses(updatedAdminAddress);
    const newMembers = updatedMembers.filter((member) => {
      if (member.ownedBy === profile.ownedBy) {
        return false;
      }
      return true;
    });
    setUpdatedMembers(newMembers);
  }

  const messageUser = (profile: Profile) => {
    router.push(`/messages/push/chat/${profile.id}`);
  }

  const onRemoveUpdateMembers = (profile: Profile) => {
    const indexToRemove = groupInfo.pendingMembers.findIndex(member => member.wallet.includes(profile.id));
    console.log(indexToRemove, 'indexToRemove');
    if (indexToRemove !== -1) {
      groupInfo.pendingMembers.splice(indexToRemove, 1);
      console.log(`Removed member with wallet ${profile.ownedBy}`);
      console.log(groupInfo.pendingMembers, "groupInfo.pendingMembers");
    }
  };

  const onMakeAdminUpdateMembers = (profile: Profile) => {
    console.log(groupInfo?.pendingMembers, 'groupInfo?.pendingMembers')
      const indexToMakeAdmin = groupInfo.pendingMembers.findIndex(member => member.wallet.includes(profile.id) && !member.isAdmin);
      console.log(indexToMakeAdmin, 'indexToMakeAdmin');
      console.log(profile)
      if (indexToMakeAdmin !== -1) {
        groupInfo.pendingMembers[indexToMakeAdmin].isAdmin = true;
        console.log(`Made admin with wallet ${profile.ownedBy}`);
        console.log(groupInfo.pendingMembers, "groupInfo.members");
      } else {
        alert("User is already an admin");
      }
  }

  const pendingMembersss = async () => {
    const pendingMembersList = groupInfo?.pendingMembers.map((member) => member.wallet.split(":")[4]);
    console.log(pendingMembersList, 'pendingMembersList');
    // const result = await loadLensProfiles(["0x7156"])
    // const myepfol = result?.get("0x7156")
    // console.log(myepfol, 'myepfol');
    for (const member of pendingMembersList) {
      const result = await loadLensProfiles([member])
      const lensProfile: any = result?.get(member);
      // console.log(lensProfile?.handle, "Yoo");
      chatProfile.push(lensProfile);
      console.log(chatProfile, 'chatProfile');
    }
  }
  const handleShowallPendingmembers = () => {
    if (showPendingmembers) {
      setShowpendingMembers(false);
      setChatprofile([]);
    } else {
      setShowpendingMembers(true);
      pendingMembersss();
    }
  }

  const handleUpdateGroup = async () => {
    if (!signer || !currentProfile || !decryptedPgpPvtKey) {
      return;
    }

    const mapOfaddress = updatedMembers ? updatedMembers
      .map((member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`) : [];
    // console.log(mapOfaddress, 'mapOfaddress')

    const alreadyMembers = groupInfo?.members ? groupInfo?.members
      .filter((member) => member.wallet !== currentProfile?.ownedBy)
      .map((member) => member.wallet) : [];

    const alreadyPendingmembers = groupInfo?.pendingMembers ? groupInfo?.pendingMembers
      .map((member) => member.wallet) : [];
    console.log(alreadyPendingmembers, 'alreadyPendingmembers');

    const totalMembers = [...mapOfaddress, ...alreadyMembers, ...alreadyPendingmembers];
    // console.log(updatedMembers, 'updatedMembers');
    // console.log(adminsFrommembers, 'adminsFrommembers');
    const trying2 = adminAddresses ? adminAddresses.map((member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`) : [];
    const tryingAdmininMembers = groupInfo?.members ? groupInfo?.members.filter((member) => member.isAdmin === true).map((member) => member.wallet) : [];
    const tryingAdmininpendingMembers = groupInfo?.pendingMembers ? groupInfo?.pendingMembers.filter((member) => member.isAdmin === true).map((member) => member.wallet) : [];
    console.log(tryingAdmininpendingMembers, 'tryingAdmininMembers');
    // if(trying2 && tryingAdmininMembers) {
    const totalAdminaddress = [...trying2, ...tryingAdmininMembers, ...tryingAdmininpendingMembers]
    // }

    await pendingMembersss();
    try {
      console.log(totalMembers, 'totalMembers')
      const response = await PushAPI.chat.updateGroup({
        groupName: groupInfo?.groupName,
        chatId: groupInfo?.chatId,
        groupDescription: groupInfo?.groupDescription as string,
        members: totalMembers,
        groupImage: groupInfo?.groupImage ? groupInfo?.groupImage : "",
        admins: totalAdminaddress, // pass the adminAddresses array here
        account: groupInfo?.groupCreator,
        pgpPrivateKey: decryptedPgpPvtKey, //decrypted private key
        env: PUSH_ENV
      });
      console.log(response, 'response');
      handleCloseall();

    } catch (error: Error | any) {
      console.log(error.message);
    }
  };

  const handleGoback = () => {
    setShowsearchMembers(false);
    setShowSearchedmembertoAdd([]);
    setUpdatedMembers([]);
    setShowpendingMembers(false);
    setChatprofile([]);
  }

  if (!groupInfo || !show) return null;

  return (
    <Modal show={show}>
      <div ref={downRef} className={` w-[100%] right-[-200px] z-50 absolute rounded-2xl bg-white ${showPendingmembers ? 'h-[100vh] bottom-[-450px]' : 'h-[70vh] bottom-[-300px]'}`}>
        <div className='pt-6 flex text-2xl items-center justify-center text-center'>
          {showSearchmembers && <Image onClick={handleGoback} className='absolute left-9 cursor-pointer' src='/push/ArrowLeft.svg' />}
          <Image onClick={handleCloseall} className='absolute right-9 cursor-pointer' src='/push/X.svg' />
          {!showSearchmembers ? `Group info` : `Edit Group`}
        </div>
        <div>
          <div>
            {!showSearchmembers && (
              <div>
                <div className='absolute top-20 left-9 flex'>
                  <Image
                    className='h-16 w-16 rounded-2xl'
                    src={groupInfo.groupImage!}
                    alt={"group name"}
                  />
                  <div className='relative left-4 w-[200px] top-1'>
                    <p className='text-[20px] font-medium'>{groupInfo.groupName}</p>
                    <p className='text-[16px] text-[#787E99]'>
                      {groupInfo.members.length + groupInfo.pendingMembers.length} members
                    </p>
                  </div>
                </div>
                <div className='absolute top-44 left-9'>
                  <div className='flex text-[18px] font-medium'>Group Description</div>
                  <div className='text-[#787E99] text-[18px] font-normal'>
                    {groupInfo.groupDescription}
                  </div>
                </div>
                <div className='absolute top-60 left-9 border border-[#D7D7D7] rounded-2xl flex w-[85%] h-[62px] items-center flex-row'>
                  <div className='absolute left-[20px]'>
                    <Image src='/push/lock.svg' alt='lock' />
                  </div>
                  <div className='absolute left-[50px]'>
                    <div>
                      <p className='text-[18px]'>
                        {groupInfo.isPublic === true ? `Public` : `Private`}
                      </p>
                    </div>
                    <div className='text-[12px] text-[#657795]'>
                      {groupInfo.isPublic === true
                        ? `Chats are not encrypted`
                        : `Chats are encrypted`}
                    </div>
                  </div>
                </div>
                <div className='absolute top-80 left-9 border cursor-pointer border-[#D7D7D7] rounded-2xl flex h-[62px] w-[85%]' onClick={() => { setShowsearchMembers(true); setShowpendingMembers(false) }}>
                  <div className='flex items-center justify-center w-full'>
                    <div className='flex items-center justify-center text-center'>
                      <Image src='/push/Add.svg' className='mr-2' alt='lock' />
                      Add more wallets
                    </div>
                  </div>
                </div>
                <div onClick={handleShowallPendingmembers} className='cursor-pointer mt-[340px] ml-9 text-lg font-normal border border-[#D7D7D7] h-[62px] w-[85%] rounded-2xl flex items-center'>
                  <div className='absolute left-[50px] flex'>
                    <div className='text-[18px]'>Pending requests</div>
                    <div className='ml-4 pt-0.25 pr-3 pb-0.25 text-white pl-3 bg-brand-500 rounded-lg'>{groupInfo?.pendingMembers.length}</div>
                  </div>
                  <div>
                    <Image className={`cursor-pointer ml-[390px] mt-2 ${showPendingmembers ? 'rotate-180' : ''}`} src='/push/CaretRight.svg' alt='arrow' />
                  </div>
                </div>
                <div className='overflow-auto relative left-[36px] h-[30vh] w-[85%] items-center justify-center'>
                  {showPendingmembers && <MemberProfileList isOwner={isOwner} memberList={chatProfile} adminAddress={adminAddresses} onMakeAdmin={onMakeAdminUpdateMembers} onRemoveMembers={onRemoveUpdateMembers} removeAdmin={removeAdmin} messageUser={messageUser} />}
                </div>
                <div className='flex items-center justify-center'>
                  <Button onClick={handleUpdateGroup} className='absolute bottom-16 h-12 w-64'>Update Members</Button>
                </div>
                {/* <div className='relative left-[85px] w-[350px]'>
              <MemberProfileList memberList={chatProfilemembers} />
            </div> */}
              </div>
            )}
            {showSearchmembers && (
              <div className="pt-4 w-full flex justify-center">
                <div className="w-[300px] flex items-center">
                  <Search
                    modalWidthClassName="max-w-xs"
                    placeholder={`Search for someone to message...`}
                    onProfileSelected={onProfileSelected}
                    zIndex="z-10"
                  />
                </div>
              </div>
            )}
            <div className=''>
              <div className='relative left-[85px] w-[350px]'>
                {showSearchedmembertoAdd && (
                  <MemberProfileList memberList={showSearchedmembertoAdd} onAddMembers={onAddMembers} adminAddress={adminAddresses} onMakeAdmin={onMakeAdmin} onRemoveMembers={onRemoveMembers} removeAdmin={removeAdmin} />
                )}
              </div>
              <div className='relative left-[85px] w-[350px]'>
                {updatedMembers && (
                  <MemberProfileList removeUserAdmin={removeUserAdmin} removeAdmin={removeAdmin} adminAddress={adminAddresses} messageUser={messageUser} memberList={updatedMembers} onMakeAdmin={onMakeAdmin} onRemoveMembers={onRemoveMembers} />
                )}
              </div>
              {showSearchmembers && (
                <div className='flex items-center justify-center'>
                  <Button onClick={handleUpdateGroup} className='absolute bottom-16 h-12 w-64'>Add members</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default useGroupInfoModal;
