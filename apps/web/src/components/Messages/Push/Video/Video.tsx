import React, { useEffect, useRef } from 'react';

const Video = () => {
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
        className="h-[87vh] w-[95%] rounded-2xl object-cover sm:block sm:h-[57vh] md:h-[65]"
        ref={localVideoRef}
        autoPlay
        muted
      />
    </div>
  );
};

export default Video;
