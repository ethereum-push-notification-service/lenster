import Follow from '@components/Shared/Follow';
import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
// import useGroupInfoModal from '@components/utils/hooks/push/usePushGroupInfo';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import type { GroupDTO } from '@pushprotocol/restapi';
import type { Profile } from 'lens';
import React, { useEffect, useRef, useState } from 'react';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

interface MessageHeaderProps {
  profile?: Profile;
  groupInfo?: GroupDTO;
  setGroupInfo?: (groupInfo: GroupDTO) => void;
}

export default function MessageHeader({ profile, groupInfo, setGroupInfo }: MessageHeaderProps) {
  // get the connected profile
  const [following, setFollowing] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const [showModal, setShowModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);

  const downRef = useRef(null);
  useOnClickOutside(downRef, () => {
    setShowGroupInfoModal(false);
    setShowModal(false);
  });

  useEffect(() => {
    if (selectedChatType === CHAT_TYPES.GROUP) {
      return;
    }
    const profile = lensProfiles.get(selectedChatId);
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [lensProfiles, selectedChatId, selectedChatType]);

  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5">
      <div className="flex items-center">
        {profile && <UserProfile profile={profile as Profile} />}{' '}
        {groupInfo && (
          <div className="flex items-center space-x-3">
            <Image
              src={groupInfo.groupImage!}
              loading="lazy"
              className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={groupInfo.groupName}
            />
            <p className="bold text-base leading-6">{groupInfo.groupName}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4	">
        <img className="cursor-pointer" src="/push/video.svg" alt="video icon" />
        {profile &&
          (following ? (
            <Unfollow profile={profile!} setFollowing={setFollowing} showText />
          ) : (
            <Follow profile={profile!} setFollowing={setFollowing} showText />
          ))}
        {groupInfo && (
          <div
            className="w-fit cursor-pointer"
            onClick={() => (showModal === false ? setShowModal(true) : setShowModal(false))}
          >
            <Image className="h-10 w-9" src="/push/more.svg" alt="group info settings" />
          </div>
        )}
        {groupInfo && showModal && (
          <div
            ref={downRef}
            className="absolute top-36 ml-[-80px] flex w-40 cursor-pointer items-center rounded-2xl border border-[#BAC4D6] bg-white p-2 px-4"
            onClick={() => {
              setShowGroupInfoModal(true);
              setShowModal(false);
            }}
          >
            <div>
              <Image className="mr-2 h-6 w-6" src="/push/info.svg" alt="group info settings" />
            </div>
            <div className="items-center text-[17px] font-[400] text-[#657795]">Group Info</div>
          </div>
        )}
        {/* {useGroupInfoModal({
          groupInfo: groupInfo,
          setGroupInfo: setGroupInfo,
          show: showGroupInfoModal,
          setShow: setShowGroupInfoModal
        })} */}
      </div>
    </section>
  );
}
