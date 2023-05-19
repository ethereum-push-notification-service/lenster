import Slug from '@components/Shared/Slug';
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import React, { useCallback, useEffect, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import { getProfileFromDID } from '../helper';

const ProfileInfo = () => {
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
            <div className="absolute left-0 right-0 top-12 m-auto mb-2 flex flex-row items-center justify-center sm:static md:static">
              <Image
                src={getAvatar(profile)}
                className="mr-3 h-12 rounded-full"
                alt={formatHandle(profile?.handle)}
              />
              <div className="flex flex-col">
                {profile?.name ?? formatHandle(profile?.handle)}
                <Slug
                  className="text-sm"
                  slug={formatHandle(profile?.handle)}
                  prefix="@"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
