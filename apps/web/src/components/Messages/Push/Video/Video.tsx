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

  const Incomingvideo = () => {
    return (
      <div>
        <video
          id="localVideo"
          className="h-[120px] w-[198px] rounded-2xl bg-white object-cover sm:h-[143px] sm:w-[254px] md:h-[143px] md:w-[254px]"
          ref={incomingVideoRef}
          autoPlay
          muted
        />
      </div>
    );
  };

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
          <div className="absolute bottom-[6px] right-4 sm:right-8 md:right-8">
            {showOngoingCall && (
              <div className="right-[20px] sm:right-[40px] md:right-[40px] ">
                <Incomingvideo />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
