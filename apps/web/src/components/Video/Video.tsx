import React, { useEffect, useRef } from 'react';

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam stream:', error);
      }
    };

    startVideo();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className='items-center flex justify-center'>
      <video
        id="localVideo"
        className="rounded-2xl object-cover sm:h-[60vh] h-[87vh] w-[95%] sm:block"
        ref={videoRef}
        autoPlay
        muted
      ></video>
    </div>
  );
};

export default Video;
