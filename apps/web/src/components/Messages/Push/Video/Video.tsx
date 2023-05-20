import React, { useEffect, useRef } from 'react';

type VideoProps = {
  videoFramestyles: string;
};

const Video = ({videoFramestyles}: VideoProps) => {
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
    <div className="flex items-center justify-center">
      <video
        id="localVideo"
        className={videoFramestyles}
        ref={localVideoRef}
        autoPlay
        muted
      />
    </div>
  );
};

export default Video;
