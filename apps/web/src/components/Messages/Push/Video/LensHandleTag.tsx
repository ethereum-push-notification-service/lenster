import Slug from '@components/Shared/Slug';
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import React, { useCallback, useEffect, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import { getProfileFromDID } from '../helper';

const LensHandle = () => {
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
            {showProfile.map((profile) => (
                <div key={profile.id}>
                    <div>
                        {profile?.name ?? formatHandle(profile?.handle)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LensHandle;
