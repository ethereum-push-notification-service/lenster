import Slug from '@components/Shared/Slug';
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import React, { useCallback, useEffect, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import { getProfileFromDID } from '../helper';

type ProfileInfoType = {
  status?: string;
  removeSlug?: boolean;
};

const ProfileInfo = ({ status, removeSlug }: ProfileInfoType) => {
  const [showProfile, setShowProfile] = useState<Profile[]>([]);
  const selectedChatid = usePushChatStore((state) => state.selectedChatId);
  const { getLensProfile } = useFetchLensProfiles();

  const getUserlensProfile = useCallback(async () => {
    const Id = getProfileFromDID(selectedChatid);
    const lensProfile = await getLensProfile(Id);
    setShowProfile(lensProfile ? [lensProfile] : []);
  }, []);

  useEffect(() => {
    getUserlensProfile();
  }, []);

  return (
    <div>
      <div>
        {showProfile.map((profile) => (
          <div key={profile.id}>
            <div className="absolute left-0 right-0 top-12 m-auto mb-0 flex flex-row items-center justify-center sm:static md:static">
              <Image
                src={getAvatar(profile)}
                className={
                  status && removeSlug === undefined
                    ? 'mr-3 h-16 w-16 rounded-full'
                    : 'mr-3 h-12 rounded-full'
                }
                alt={formatHandle(profile?.handle)}
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-[500px] text-[#333333]">
                  {profile?.name ?? formatHandle(profile?.handle)}
                </span>
                <Slug
                  className={removeSlug !== undefined ? 'hidden' : 'text-[14px]'}
                  slug={formatHandle(profile?.handle)}
                  prefix="@"
                />
                <span className="whitespace-nowrap text-[14px] font-[300px] text-[#82828A]">{status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
