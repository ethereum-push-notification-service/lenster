import React, { useEffect, useRef } from 'react';

type VideoProps = {
  videoFramestyles: string;
  showOngoingCall: boolean;
};

const Video = ({ videoFramestyles, showOngoingCall }: VideoProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const incomingVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current) {
      let video = localVideoRef.current;
      // add the videoCallData here
      video.srcObject = null;
      video.play();
    }
  }, []);


  return (
    <div>
      <div className='relative'>
        <div className="flex items-center justify-center">
          <video
            id="localVideo"
            className={videoFramestyles}
            ref={localVideoRef}
            autoPlay
            muted
          />
        </div>
      </div>
    </div>
  );
};

export default Video;
