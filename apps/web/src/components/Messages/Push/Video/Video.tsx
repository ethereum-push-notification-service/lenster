import React, { useEffect, useRef } from 'react';
import { usePushChatStore } from 'src/store/push-chat';

type VideoProps = {
  incomingVideoRef?: React.RefObject<HTMLVideoElement>;
};

const Video = () => {
  const showVideoCall = usePushChatStore((state) => state.showVideoCall);
  const setShowVideoCall = usePushChatStore((state) => state.setShowVideoCall);
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
    <div className="">
      <div className="relative">
        <div className="flex items-center justify-center">
          <video
            id="localVideo"
            className="h-[87vh] w-[95%] rounded-2xl bg-black object-cover sm:block sm:h-[60vh] md:h-[60vh]"
            ref={localVideoRef}
            autoPlay
            muted
          />
          <div className="absolute bottom-[6px] right-4 sm:right-9 md:right-9">
            {showVideoCall && (
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
