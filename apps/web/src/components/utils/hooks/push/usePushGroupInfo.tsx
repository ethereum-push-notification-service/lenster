import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import type { Profile } from 'lens';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Image, Modal } from 'ui';

import useOnClickOutside from '../useOnClickOutside';
import useFetchLensProfiles from './useFetchLensProfiles';
import { MemberProfileList } from './usePushCreateGroupChat';

type GroupInfoModalProps = {
  groupInfo?: GroupDTO;
  setGroupInfo?: (groupInfo: GroupDTO) => void;
  show: boolean;
  setShow: (show: boolean) => void;
};

type MembersType = {
  totalMembers: Array<string>;
  totalAdminAddress: Array<string>;
};

export const useGroupInfoModal = (options: GroupInfoModalProps) => {
  const { groupInfo, show, setShow } = options;
  const downRef = useRef(null);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const { loadLensProfiles } = useFetchLensProfiles();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const [chatProfile, setChatprofile] = useState<Profile[]>([]);
  const [adminAddressesinPendingMembers, setAdminAddressesinPendingMembers] = useState<Profile[]>([]);
  // console.log(groupInfo, 'did it change');

  const closeModal = () => {
    setShow(false);
  };

  useOnClickOutside(downRef, () => {
    closeModal();
  });

  // ask Nilesh about this
  const isAccountOwnerAdmin = groupInfo?.members?.some(
    (member) => member?.wallet === connectedProfile?.did && member?.isAdmin
  );

  // const pendingMemberisAdmin = async () => {
  //   const pendingMembersAdminlist = groupInfo?.members
  //     ? groupInfo?.members
  //         .filter((member) => member.isAdmin === true)
  //         .map((member) => member.wallet.split(':')[4])
  //     : [];
  //   for (const member of pendingMembersAdminlist) {
  //     const result = await loadLensProfiles([member]);
  //     const lensProfile: any = result?.get(member);
  //     setAdminAddressesinPendingMembers((current) => [...current, lensProfile]);
  //   }
  //   console.log(adminAddressesinPendingMembers, 'adminAddressesinPendingmemberssss');
  // };

  const pendingMemberisAdmin = useCallback(async () => {
    const pendingMembersAdminlist = groupInfo?.members
      ? groupInfo?.members
          .filter((member) => member.isAdmin === true)
          .map((member) => member.wallet.split(':')[4])
      : [];
    for (const member of pendingMembersAdminlist) {
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      setAdminAddressesinPendingMembers((current) => [...current, lensProfile]);
    }
    // console.log(adminAddressesinPendingMembers, 'adminAddressesinPendingmemberssss');
  }, [groupInfo]);

  const acceptedMember = useCallback(async () => {
    let membersList = [];
    let allPendingMembersList = [];
    await pendingMemberisAdmin();
    const acceptedMembersList = groupInfo?.members
      ? groupInfo?.members.map((member) => member.wallet.split(':')[4])
      : [];

    for (const member of acceptedMembersList) {
      // let checkList = acceptedMembers?.some((item) => item.id === member);
      // if (checkList) {
      //   return;
      // }
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      membersList.push(lensProfile);
    }

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
      allPendingMembersList.push(lensProfile);
    }

    // eslint-disable-next-line no-use-before-define
    let getResponse = await handleUpdateGroup({
      totalMembers: allPendingMembersList,
      totalAdminAddress: membersList
    });
    console.log(getResponse, allPendingMembersList, membersList, 'newewewwew');
  }, [groupInfo]);

  useEffect(() => {
    // acceptedMember();
    // console.log('one call');
  }, []);
  // const acceptedMember = async () => {
  //   await pendingMemberisAdmin();
  //   const acceptedMembersList = groupInfo?.members
  //     ? groupInfo?.members.map((member) => member.wallet.split(':')[4])
  //     : [];

  //   for (const member of acceptedMembersList) {
  //     let checkList = acceptedMembers?.some((item) => item.id === member);
  //     if (checkList) {
  //       return;
  //     }
  //     const result = await loadLensProfiles([member]);
  //     const lensProfile: any = result?.get(member);
  //     setacceptedMembers((b) => [...b, lensProfile]);
  //   }
  // };

  const handleUpdateGroup = async ({ totalMembers, totalAdminAddress }: MembersType) => {
    if (!currentProfile || !decryptedPgpPvtKey) {
      return;
    }

    try {
      // console.log(groupInfo);
      console.log({
        groupName: groupInfo?.groupName || '',
        chatId: groupInfo?.chatId || '',
        groupDescription: groupInfo?.groupDescription as string,
        members: totalMembers,
        groupImage: groupInfo?.groupImage ? groupInfo?.groupImage : '',
        admins: totalAdminAddress, // pass the adminAddresses array here
        account: groupInfo?.groupCreator,
        pgpPrivateKey: decryptedPgpPvtKey, //decrypted private key
        env: PUSH_ENV
      });
      const response = await PushAPI.chat.updateGroup({
        groupName: groupInfo?.groupName || '',
        chatId: groupInfo?.chatId || '',
        groupDescription: groupInfo?.groupDescription as string,
        members: totalMembers,
        groupImage: groupInfo?.groupImage ? groupInfo?.groupImage : '',
        admins: totalAdminAddress, // pass the adminAddresses array here
        account: groupInfo?.groupCreator,
        pgpPrivateKey: decryptedPgpPvtKey, //decrypted private key
        env: PUSH_ENV
      });
      toast.success('Group updated successfully');
      // handleCloseall();
      return response;
    } catch (error: Error | any) {
      console.log(error.message);
      // setAdding(false);
      toast.error(error.message);
    }
  };

  return (
    <Modal show={show}>
      <div ref={downRef}>
        <div className="flex items-center justify-center pt-4 text-center text-lg font-[500]">
          <Image
            // onClick={handleGoback}
            className="absolute left-9 cursor-pointer"
            src="/push/ArrowLeft.svg"
            alt="new"
          />
          <Image
            onClick={closeModal}
            className="absolute right-9 cursor-pointer"
            src="/push/X.svg"
            alt="new"
          />
          Group Info
        </div>
        {/* {!showSearchmembers && ( */}
        <div>
          <div className="ml-9 mt-4 flex">
            <Image className="h-12 w-12 rounded-full" src={groupInfo?.groupImage!} alt={'group name'} />
            <div className="relative left-4 top-1 w-[200px]">
              <p className="text-[15px] font-[500]">{groupInfo?.groupName}</p>
              <p className="text-[13px] font-[400] text-[#27272A]">
                {groupInfo?.members.length +
                  (groupInfo?.pendingMembers ? groupInfo?.pendingMembers.length : 0)}{' '}
                members
              </p>
            </div>
          </div>
          <div className="ml-9 mt-6">
            <div className="flex text-[15px] font-[500]">Group Description</div>
            <div className="text-[13px] font-[400] text-[#27272A]">{groupInfo?.groupDescription}</div>
          </div>
          <div className="ml-9 mt-6 flex h-[62px] w-[85%] flex-row items-center rounded-2xl border border-[#D7D7D7]">
            <div className="ml-[20px]">
              <Image src="/push/lock.svg" alt="lock" />
            </div>
            <div className="ml-4">
              <div>
                <p className="text-[15px] font-[500]">
                  {groupInfo?.isPublic === true ? `Public` : `Private`}
                </p>
              </div>
              <div className="text-[13px] font-[300] text-[#82828A]">
                {groupInfo?.isPublic === true ? `Chats are not encrypted` : `Chats are encrypted`}
              </div>
            </div>
          </div>
          <div
            className="ml-9 mt-3 flex h-[62px] w-[85%] cursor-pointer rounded-2xl border border-[#D7D7D7]"
            onClick={() => {
              // setShowsearchMembers(true);
              // setShowpendingMembers(false);
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
            <div>
              <div className="ml-4 mt-4 flex w-[200px] pb-4">
                <div className="text-[15px] font-[500]">Pending requests</div>
                <div className="bg-brand-500 absolute left-44 ml-2 mt-0 h-fit rounded-lg pl-3 pr-3 text-[14px] font-[500] text-white">
                  {groupInfo?.pendingMembers.length}
                </div>
              </div>
              <div>
                <Image
                  className={`mt-[-40px] cursor-pointer ${'ml-[380px]'}`}
                  src="/push/CaretRight.svg"
                  alt="arrow"
                />
              </div>
            </div>
            <div className=" z-50 max-h-[12rem] w-[100%] items-center justify-center overflow-auto bg-transparent">
              {groupInfo?.pendingMembers && (
                <MemberProfileList
                  isOwner={[]}
                  memberList={chatProfile}
                  // adminAddress={groupInfo.pendingMembers}
                  adminAddress={adminAddressesinPendingMembers}
                />
              )}
            </div>
          </div>

          <div className="ml-[36px] mt-[10px] w-[85%] items-center justify-center">
            {/* <MemberProfileList
                isOwner={toCheckadmin}
                memberList={acceptedMembers}
                adminAddress={adminAddressesinPendingmembers}
                onMakeAdmin={onMakeAdminUpdateMembers}
                onRemoveMembers={onRemoveUpdateMembers}
                removeAdmin={onRemoveAdminUpdateMembers}
                removeUserAdmin={onRemoveUseradmin}
                messageUser={messageUser}
              /> */}
          </div>
          <div className="mb-4 mt-4 flex items-center justify-center">
            {/* <Button onClick={handleUpdateGroup} className="h-12 w-64">
                {adding ? `Updating Members...` : `Update Members`}
              </Button> */}
          </div>
        </div>
        {/* // )} */}
        {/* {showSearchmembers && (
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
        )} */}
        <div className="">
          <div className="ml-[85px] w-[350px]">
            {/* {showSearchmembers && (
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
            )} */}
          </div>
          <div className=" ml-[85px] w-[350px]">
            {/* {updatedMembers && (
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
            )} */}
          </div>
          {/* {showSearchmembers && (
            <div className="mb-4 mt-2 flex items-center justify-center">
              <Button onClick={handleUpdateGroup} className="bottom-16 h-12 w-64">
                {adding ? `Adding...` : `Add Members`}
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </Modal>
  );
};

// export { useGroupInfoModal };
export default useGroupInfoModal;
