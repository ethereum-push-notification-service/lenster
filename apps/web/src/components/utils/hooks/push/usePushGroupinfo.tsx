import Search from '@components/Shared/Navbar/Search';
import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data/constants';
import type { Profile } from 'lens';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Button, Image, Modal } from 'ui';
import { useSigner } from 'wagmi';

import useOnClickOutside from '../useOnClickOutside';
import useFetchLensProfiles from './useFetchLensProfiles';
import { MemberProfileList } from './usePushCreateGroupChat';

type GroupInfoModalProps = {
  groupInfo?: GroupDTO;
  show: boolean;
  setShow: (show: boolean) => void;
};

const useGroupInfoModal = (options: GroupInfoModalProps) => {
  const { groupInfo, show, setShow } = options;
  const [showSearchmembers, setShowsearchMembers] = useState<boolean>(false);
  const [showSearchedmembertoAdd, setShowSearchedmembertoAdd] = useState<Array<Profile>>([]);
  const showSearchedmember = usePushChatStore((state) => state.showPendingMembers);
  const setShowSearchedmember = usePushChatStore((state) => state.setShowPendingMembers);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [updatedMembers, setUpdatedMembers] = useState<Profile[]>([]);
  const [adminAddresses, setAdminAddresses] = useState<Profile[]>([]);
  const [adminAddressesinPendingmembers, setAdminAddressesinPendingmembers] = useState<Profile[]>([]);
  const [toCheckadmin, setTocheckAdmins] = useState<Profile[]>([]);

  const [showPendingmembers, setShowpendingMembers] = useState<boolean>(false);
  const { data: signer } = useSigner();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const downRef = useRef(null);
  const { loadLensProfiles } = useFetchLensProfiles();
  const [chatProfile, setChatprofile] = useState<Profile[]>([]);
  const [chatProfilemembers, setChatprofilemembers] = useState<Profile[]>([]);
  const [acceptedMembers, setacceptedMembers] = useState<Profile[]>([]);
  const [adding, setAdding] = useState<boolean>(false);
  const pendingMemberisAdmin = async () => {
    const pendingMembersAdminlist = groupInfo?.members
      ? groupInfo?.members
          .filter((member) => member.isAdmin === true)
          .map((member) => member.wallet.split(':')[4])
      : [];
    // console.log(pendingMembersAdminlist, 'pendingMembersAdminlist');
    for (const member of pendingMembersAdminlist) {
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      adminAddressesinPendingmembers.push(lensProfile);
    }
    // console.log(adminAddressesinPendingmembers, 'adminAddressesinPendingmemberssss');
  };

  const acceptedMember = async () => {
    await pendingMemberisAdmin();
    const acceptedMembersList = groupInfo?.members
      ? groupInfo?.members.map((member) => member.wallet.split(':')[4])
      : [];

    for (const member of acceptedMembersList) {
      let checkList = acceptedMembers?.some((item) => item.id === member);
      if (checkList) {
        return;
      }
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      setacceptedMembers((b) => [...b, lensProfile]);
    }
  };

  const isUserAdminaddress = async () => {
    const MembersAdminlist = groupInfo?.members
      ? groupInfo?.members
          .filter((member) => member.isAdmin === true)
          .map((member) => member.wallet.split(':')[4])
      : [];
    // console.log(MembersAdminlist, 'MembersAdminlist');
    for (const member of MembersAdminlist) {
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      toCheckadmin.push(lensProfile);
    }
  };

  const pendingMembersss = async () => {
    const pendingMembersList = groupInfo
      ? groupInfo?.pendingMembers.map((member) => member.wallet.split(':')[4])
      : [];
    for (const member of pendingMembersList) {
      let checkList = chatProfile?.some((item) => item.id === member);
      if (checkList) {
        return;
      }
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      setChatprofile((b) => [...b, lensProfile]);
    }
  };

  useEffect(() => {
    acceptedMember();
    isUserAdminaddress();
    pendingMembersss();
  }, [groupInfo]);

  const handleCloseall = () => {
    setShow(false);
    setShowsearchMembers(false);
    setShowSearchedmembertoAdd([]);
    setUpdatedMembers([]);
    setAdminAddresses([]);
    setChatprofilemembers([]);
    setShowpendingMembers(false);
    setAdding(false);
  };

  useOnClickOutside(downRef, () => {
    handleCloseall();
  });

  if (!groupInfo || !show) {
    return null;
  }

  const onProfileSelected = (profile: Profile) => {
    setShowSearchedmembertoAdd((prevMembers) => [...prevMembers, profile]);
    // console.log(showSearchedmembertoAdd, 'profile');
  };

  const onAddMembers = (profile: Profile) => {
    setShowSearchedmembertoAdd(showSearchedmembertoAdd.filter((member) => member !== profile));
    if (
      !groupInfo?.pendingMembers.some((member) => member.wallet.includes(profile.id)) &&
      !groupInfo?.members.some((member) => member.wallet.includes(profile.id)) &&
      !updatedMembers.some((member) => member.ownedBy === profile.ownedBy) &&
      updatedMembers.length < 9
    ) {
      setUpdatedMembers((prevMembers) => [...prevMembers, profile]);
      setChatprofile((prevMembers) => [...prevMembers, profile]);
    }
  };
  // console.log(updatedMembers, 'updatedMembers');

  const onRemoveMembers = (profile: Profile) => {
    setUpdatedMembers(updatedMembers.filter((member) => member !== profile));
  };

  const onMakeAdmin = (profile: Profile) => {
    const newMembers = updatedMembers.map((member) => {
      if (member.ownedBy === profile.ownedBy) {
        return {
          ...member,
          isAdmin: true
        };
      }
      return member;
    });
    setUpdatedMembers(newMembers);
    setAdminAddresses((prevMembers) => [...prevMembers, profile]);
    // console.log(adminAddresses, 'adminAddresses');
  };

  // const isOwner = (profile: Profile) => {
  //   const isCreator = groupInfo?.groupCreator.split(':')[4] === profile.id;
  //   console.log(isCreator, 'isCreator');
  // };

  const removeAdmin = (profile: Profile) => {
    const newMembers = updatedMembers.map((member) => {
      if (member.ownedBy === profile.ownedBy) {
        return {
          ...member,
          isAdmin: false
        };
      }
      return member;
    });
    setAdminAddresses(adminAddresses.filter((member) => member.ownedBy !== profile.ownedBy));
    setUpdatedMembers(newMembers);
  };

  const removeUserAdmin = (profile: Profile) => {
    const updatedAdminAddress = adminAddresses.filter((admin) => admin.ownedBy !== profile.ownedBy);
    setAdminAddresses(updatedAdminAddress);
    const newMembers = updatedMembers.filter((member) => {
      if (member.ownedBy === profile.ownedBy) {
        return false;
      }
      return true;
    });
    setUpdatedMembers(newMembers);
  };

  const messageUser = (profile: Profile) => {
    router.push(`/messages/push/chat/${profile.id}`);
  };

  const onRemoveUpdateMembers = (profile: Profile) => {
    const indexToRemove = groupInfo.members.findIndex((member) => member.wallet.includes(profile.id));
    // console.log(indexToRemove, 'indexToRemove');
    if (indexToRemove !== -1) {
      groupInfo.pendingMembers.splice(indexToRemove, 1);
      // console.log(`Removed member with wallet ${profile.ownedBy}`);
      // console.log(groupInfo.members, 'groupInfo.pendingMembers');
      setChatprofile(chatProfile.filter((member) => member.ownedBy !== profile.ownedBy));
      setacceptedMembers(acceptedMembers.filter((member) => member.ownedBy !== profile.ownedBy));
    }
  };

  const onMakeAdminUpdateMembers = (profile: Profile) => {
    // console.log(groupInfo?.members, 'groupInfo?.pendingMembers');
    const indexToMakeAdmin = groupInfo.members.findIndex(
      (member) => member.wallet.includes(profile.id) && !member.isAdmin
    );
    // console.log(indexToMakeAdmin, 'indexToMakeAdmin');
    // console.log(profile);
    if (indexToMakeAdmin !== -1) {
      groupInfo.members[indexToMakeAdmin].isAdmin = true;
      setAdminAddressesinPendingmembers((prevMembers) => [...prevMembers, profile]);
    } else {
      alert('User is already an admin');
    }
  };

  const onRemoveAdminUpdateMembers = (profile: Profile) => {
    const indexToRemoveAdmin = groupInfo.members.findIndex(
      (member) => member.wallet.includes(profile.id) && member.isAdmin
    );
    // console.log(indexToRemoveAdmin, 'indexToRemoveAdmin');
    if (indexToRemoveAdmin !== -1) {
      groupInfo.members[indexToRemoveAdmin].isAdmin = false;
      setAdminAddressesinPendingmembers(
        adminAddressesinPendingmembers.filter((member) => member.ownedBy !== profile.ownedBy)
      );
    } else {
      alert('User is not an admin');
    }
  };

  const onRemoveUseradmin = (profile: Profile) => {
    const indexToRemove = groupInfo.members.findIndex((member) => member.wallet.includes(profile.id));
    // console.log(indexToRemove, 'indexToRemove');
    if (indexToRemove !== -1) {
      groupInfo?.members.splice(indexToRemove, 1);
      // console.log(`Removed member with wallet ${profile.handle}`);
      // console.log(groupInfo?.members, 'groupInfo?.members');
      setacceptedMembers(acceptedMembers.filter((member) => member.ownedBy !== profile.ownedBy));
    }
  };

  const handleShowallPendingmembers = () => {
    if (showPendingmembers) {
      setShowpendingMembers(false);
      // setChatprofile([]);
      // setAdminAddressesinPendingmembers([]);
    } else {
      isUserAdminaddress();
      // console.log(adminAddressesinPendingmembers, 'sdsdf');
      setShowpendingMembers(true);
    }
  };

  const handleUpdateGroup = async () => {
    if (!signer || !currentProfile || !decryptedPgpPvtKey) {
      return;
    }
    setAdding(true);
    showPendingmembers ? setShowpendingMembers(false) : null;

    const mapOfaddress = updatedMembers
      ? updatedMembers.map((member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`)
      : [];
    // console.log(mapOfaddress, 'mapOfaddress')

    const alreadyMembers = groupInfo?.members
      ? groupInfo?.members
          .filter((member) => member.wallet !== currentProfile?.ownedBy)
          .map((member) => member.wallet)
      : [];

    const alreadyPendingmembers = groupInfo?.pendingMembers
      ? groupInfo?.pendingMembers.map((member) => member.wallet)
      : [];
    console.log(alreadyPendingmembers, 'alreadyPendingmembers');

    const totalMembers = [...mapOfaddress, ...alreadyMembers, ...alreadyPendingmembers];
    // console.log(updatedMembers, 'updatedMembers');
    // console.log(adminsFrommembers, 'adminsFrommembers');
    const trying2 = adminAddresses
      ? adminAddresses.map((member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`)
      : [];
    const tryingAdmininMembers = groupInfo?.members
      ? groupInfo?.members.filter((member) => member.isAdmin === true).map((member) => member.wallet)
      : [];
    const tryingAdmininpendingMembers = groupInfo?.pendingMembers
      ? groupInfo?.pendingMembers.filter((member) => member.isAdmin === true).map((member) => member.wallet)
      : [];
    // console.log(tryingAdmininpendingMembers, 'tryingAdmininMembers');
    // if(trying2 && tryingAdmininMembers) {
    const totalAdminaddress = [...trying2, ...tryingAdmininMembers, ...tryingAdmininpendingMembers];
    // }

    try {
      // console.log(totalMembers, 'totalMembers');
      const response = await PushAPI.chat.updateGroup({
        groupName: groupInfo?.groupName,
        chatId: groupInfo?.chatId,
        groupDescription: groupInfo?.groupDescription as string,
        members: totalMembers,
        groupImage: groupInfo?.groupImage ? groupInfo?.groupImage : '',
        admins: totalAdminaddress, // pass the adminAddresses array here
        account: groupInfo?.groupCreator,
        pgpPrivateKey: decryptedPgpPvtKey, //decrypted private key
        env: PUSH_ENV
      });
      toast.success('Group updated successfully');
      handleCloseall();
    } catch (error: Error | any) {
      console.log(error.message);
      setAdding(false);
      toast.error(error.message);
    }
  };

  const handleGoback = () => {
    setShowsearchMembers(false);
    setShowSearchedmembertoAdd([]);
    setUpdatedMembers([]);
    setShowpendingMembers(false);
  };

  // console.log(showPendingmembers, 'showPendingmembers');

  return (
    <Modal show={show}>
      <div ref={downRef}>
        <div className="flex items-center justify-center pt-4 text-center text-lg font-[500]">
          {showSearchmembers && (
            <Image
              onClick={handleGoback}
              className="absolute left-9 cursor-pointer"
              src="/push/ArrowLeft.svg"
              alt="new"
            />
          )}
          <Image
            onClick={handleCloseall}
            className="absolute right-9 cursor-pointer"
            src="/push/X.svg"
            alt="new"
          />
          {!showSearchmembers ? `Group Info` : `Edit Group`}
        </div>
        {!showSearchmembers && (
          <div>
            <div className="ml-9 mt-4 flex">
              <Image className="h-12 w-12 rounded-full" src={groupInfo.groupImage!} alt={'group name'} />
              <div className="relative left-4 top-1 w-[200px]">
                <p className="text-[15px] font-[500]">{groupInfo.groupName}</p>
                <p className="text-[13px] font-[400] text-[#27272A]">
                  {groupInfo.members.length +
                    (groupInfo.pendingMembers ? groupInfo.pendingMembers.length : 0)}{' '}
                  members
                </p>
              </div>
            </div>
            <div className="ml-9 mt-6">
              <div className="flex text-[15px] font-[500]">Group Description</div>
              <div className="text-[13px] font-[400] text-[#27272A]">{groupInfo.groupDescription}</div>
            </div>
            <div className="ml-9 mt-6 flex h-[62px] w-[85%] flex-row items-center rounded-2xl border border-[#D7D7D7]">
              <div className="ml-[20px]">
                <Image src="/push/lock.svg" alt="lock" />
              </div>
              <div className="ml-4">
                <div>
                  <p className="text-[15px] font-[500]">
                    {groupInfo.isPublic === true ? `Public` : `Private`}
                  </p>
                </div>
                <div className="text-[13px] font-[300] text-[#82828A]">
                  {groupInfo.isPublic === true ? `Chats are not encrypted` : `Chats are encrypted`}
                </div>
              </div>
            </div>
            <div
              className="ml-9 mt-3 flex h-[62px] w-[85%] cursor-pointer rounded-2xl border border-[#D7D7D7]"
              onClick={() => {
                setShowsearchMembers(true);
                setShowpendingMembers(false);
              }}
            >
              <div className="flex w-full items-center justify-center">
                <div className="flex items-center justify-center text-center text-[15px] font-[500]">
                  <Image src="/push/Add.svg" className="mr-2" alt="lock" />
                  Add more wallets
                </div>
              </div>
            </div>
            <div className="ml-9 mt-3 max-h-[50vh] min-h-[60px] w-[85%] cursor-pointer rounded-2xl border border-[#D7D7D7] text-lg font-normal ">
              <div onClick={handleShowallPendingmembers}>
                <div className="ml-4 mt-4 flex w-[200px] pb-4">
                  <div className="text-[15px] font-[500]">Pending requests</div>
                  <div className="bg-brand-500 absolute left-44 ml-2 mt-0 h-fit rounded-lg pl-3 pr-3 text-[14px] font-[500] text-white">
                    {groupInfo?.pendingMembers.length}
                  </div>
                </div>
                <div>
                  <Image
                    className={`mt-[-40px] cursor-pointer ${
                      showPendingmembers ? 'ml-[380px] rotate-180' : 'ml-[380px]'
                    }`}
                    src="/push/CaretRight.svg"
                    alt="arrow"
                  />
                </div>
              </div>
              <div className=" z-50 max-h-[12rem] w-[100%] items-center justify-center overflow-auto bg-transparent">
                {showPendingmembers && (
                  <MemberProfileList
                    isOwner={[]}
                    memberList={chatProfile}
                    adminAddress={adminAddressesinPendingmembers}
                  />
                )}
              </div>
            </div>
            {/* <div className='cursor-pointer mt-[30px] ml-9 text-lg font-normal border border-[#D7D7D7] h-[62px] w-[85%] rounded-2xl flex items-center' onClick={handleShowallPendingmembers}>
              <div>Pending Requests</div>
              <li className=''>
                {showPendingmembers && <MemberProfileList isOwner={toCheckadmin} memberList={chatProfile} adminAddress={adminAddressesinPendingmembers} onMakeAdmin={onMakeAdminUpdateMembers} onRemoveMembers={onRemoveUpdateMembers} removeAdmin={onRemoveAdminUpdateMembers} messageUser={messageUser} />}
              </li>
            </div> */}
            <div className="ml-[36px] mt-[10px] w-[85%] items-center justify-center">
              <MemberProfileList
                isOwner={toCheckadmin}
                memberList={acceptedMembers}
                adminAddress={adminAddressesinPendingmembers}
                onMakeAdmin={onMakeAdminUpdateMembers}
                onRemoveMembers={onRemoveUpdateMembers}
                removeAdmin={onRemoveAdminUpdateMembers}
                removeUserAdmin={onRemoveUseradmin}
                messageUser={messageUser}
              />
            </div>
            <div className="mb-4 mt-4 flex items-center justify-center">
              <Button onClick={handleUpdateGroup} className="h-12 w-64">
                {adding ? `Updating Members...` : `Update Members`}
              </Button>
            </div>
          </div>
        )}
        {showSearchmembers && (
          <div className="flex w-full justify-center pb-4 pt-4">
            <div className="flex w-[300px] items-center">
              <Search
                modalWidthClassName="max-w-xs"
                placeholder={`Search for someone to message...`}
                onProfileSelected={onProfileSelected}
                zIndex="z-10"
              />
            </div>
          </div>
        )}
        <div className="">
          <div className="ml-[85px] w-[350px]">
            {showSearchmembers && (
              <MemberProfileList
                isOwner={toCheckadmin}
                removeUserAdmin={onRemoveUseradmin}
                memberList={showSearchedmembertoAdd}
                onAddMembers={onAddMembers}
                adminAddress={adminAddresses}
                onMakeAdmin={onMakeAdmin}
                onRemoveMembers={onRemoveMembers}
                removeAdmin={removeAdmin}
              />
            )}
          </div>
          <div className=" ml-[85px] w-[350px]">
            {updatedMembers && (
              <MemberProfileList
                isOwner={toCheckadmin}
                removeUserAdmin={removeUserAdmin}
                removeAdmin={removeAdmin}
                adminAddress={adminAddresses}
                messageUser={messageUser}
                memberList={updatedMembers}
                onMakeAdmin={onMakeAdmin}
                onRemoveMembers={onRemoveMembers}
              />
            )}
          </div>
          {showSearchmembers && (
            <div className="mb-4 mt-2 flex items-center justify-center">
              <Button onClick={handleUpdateGroup} className="bottom-16 h-12 w-64">
                {adding ? `Adding...` : `Add Members`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default useGroupInfoModal;
