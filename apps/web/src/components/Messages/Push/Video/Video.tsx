import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'ui';

type VideoPropsType = {
  isVideoOn: boolean;
  videoFramestyles?: string;
  profileId?: string;
  stream?: any;
};

const Video = ({ isVideoOn, profileId, stream, videoFramestyles }: VideoPropsType) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
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
    <div className="relative">
      {isVideoOn ? (
      <div className="flex items-center justify-center">
        <video
          id="localVideo"
          className={videoFramestyles}
          ref={localVideoRef}
          autoPlay
          muted
        />
       </div>
      ) : (
        <div className="flex h-[87vh] w-[95%] rounded-2xl bg-[#F4F4F5] sm:h-[57vh] md:h-[65]">
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
    </div>
  );
};

export default Video;
