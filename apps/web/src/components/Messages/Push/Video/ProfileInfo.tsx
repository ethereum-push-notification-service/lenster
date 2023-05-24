import Slug from '@components/Shared/Slug';
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'ui';

type ProfileInfoType = {
  status?: string;
  removeSlug?: boolean;
  profileId: string;
};

const ProfileInfo = ({ status, removeSlug, profileId }: ProfileInfoType) => {
  const [showProfile, setShowProfile] = useState<Profile[]>([]);
  const { getLensProfile } = useFetchLensProfiles();

  const getUserlensProfile = useCallback(async () => {
    const lensProfile = await getLensProfile(profileId);
    setShowProfile(lensProfile ? [lensProfile] : []);
  }, [getLensProfile, profileId]);

  useEffect(() => {
    getUserlensProfile();
  }, []);

  return (
    <div>
      <div>
        {showProfile.map((profile) => (
          <div key={profile.id}>
            <div className="flex flex-row items-center">
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
                <span className="text-[12px] font-[500px] text-[#333333] dark:text-white md:text-[15px]">
                  {profile?.name ?? formatHandle(profile?.handle)}
                </span>
                <Slug
                  className={
                    removeSlug !== undefined ? 'hidden' : 'text-[14px]'
                  }
                  slug={formatHandle(profile?.handle)}
                  prefix="@"
                />
                <span className="whitespace-nowrap text-[12px] font-[300px] text-[#82828A] dark:text-[#D4D4D8] md:text-[14px]">
                  {status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
