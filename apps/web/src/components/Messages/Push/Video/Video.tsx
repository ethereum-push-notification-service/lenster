import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'ui';

type VideoPropsType = {
  isVideoOn: boolean;
  profileId?: string;
  stream?: any;
};

const Video = ({ isVideoOn, profileId, stream }: VideoPropsType) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const incomingVideoRef = useRef<HTMLVideoElement>(null);
  const [lensProfile, setLensProfile] = useState<Profile>();
  const { getLensProfile } = useFetchLensProfiles();

  useEffect(() => {
    if (!profileId) {
      return;
    }
    (async function () {
      const profileResponse = await getLensProfile(profileId);
      if (profileResponse) {
        setLensProfile(profileResponse);
      }
    })();
  }, [getLensProfile, profileId]);

  useEffect(() => {
    if (localVideoRef.current) {
      let video = localVideoRef.current;
      // add the videoCallData here
      video.srcObject = null;
      video.play();
    }
  }, []);

  return (
    <div className="flex items-center justify-center">
      {isVideoOn ? (
        <video
          id="localVideo"
          className="h-[87vh] w-[95%] rounded-2xl object-cover sm:block sm:h-[57vh] md:h-[65]"
          ref={localVideoRef}
          autoPlay
          muted
        />
      ) : (
        <div className="flex h-[87vh] w-[95%] rounded-2xl bg-[#F4F4F5] sm:block sm:h-[57vh] md:h-[65]">
          <Image
            onError={({ currentTarget }) => {
              currentTarget.src = getAvatar(lensProfile, false);
            }}
            src={getAvatar(lensProfile)}
            loading="lazy"
            className="m-auto h-24 w-24 rounded-full border bg-gray-200 dark:border-gray-700"
            alt={formatHandle(lensProfile?.handle)}
          />
        </div>
      )}
    </div>
  );
};

export default Video;
