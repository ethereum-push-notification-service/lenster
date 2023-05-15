import Follow from '@components/Shared/Follow';
import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import useGroupInfoModal from '@components/utils/hooks/push/usePushGroupinfo';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import type { GroupDTO, ProgressHookType } from '@pushprotocol/restapi';
import type { Profile } from 'lens';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Image, Modal } from 'ui';

interface MessageHeaderProps {
  profile?: Profile;
  groupInfo: GroupDTO
}


export default function MessageHeader({ profile, groupInfo }: MessageHeaderProps) {
  // get the connected profile
  const [following, setFollowing] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const [showModal, setShowModal] = useState(false);
  const [showGroupinfoModal, setShowGroupinfoModal] = useState(false);
  console.log(groupInfo);
  const downRef = useRef(null)
  useOnClickOutside(downRef, () => {setShowGroupinfoModal(false); setShowModal(false)})

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
              className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
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
          <div className="w-fit cursor-pointer" onClick={() => showModal === false ? setShowModal(true) : setShowModal(false)}>
            <Image className="h-10 w-9" src="/push/more.svg" alt="group info settings" />
          </div>
        )}
        {groupInfo && showModal && (
          <div ref={downRef} className='absolute top-36 ml-[-80px] px-4 w-40 border border-[#BAC4D6] rounded-2xl p-2 cursor-pointer flex bg-white' onClick={() => { setShowGroupinfoModal(true); setShowModal(false) }}>
            <div>
              <Image className="h-8 w-8 mr-1" src="/push/info.svg" alt="group info settings" />
            </div>
            <div className='items-center text-[#657795] text-[18px]'>
              Group Info
            </div>
          </div>
        )}
        {useGroupInfoModal({ groupInfo: groupInfo, show: showGroupinfoModal, setShow: setShowGroupinfoModal })}
      </div>
    </section>
  );
}
