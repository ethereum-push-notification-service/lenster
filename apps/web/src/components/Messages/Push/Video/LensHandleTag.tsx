import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import React, { useCallback, useEffect, useState } from 'react';

type LensHandleTagPropType = {
  profileId: string;
};

const LensHandleTag = ({ profileId }: LensHandleTagPropType) => {
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
      {showProfile.map((profile) => (
        <div key={profile.id}>
          <div>{profile?.name ?? formatHandle(profile?.handle)}</div>
        </div>
      ))}
    </div>
  );
};

export default LensHandleTag;
