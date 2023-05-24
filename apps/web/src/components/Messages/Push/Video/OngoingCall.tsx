import CallButton from '@components/Messages/Push/Video/CallButton';
import LensHandleTag from '@components/Messages/Push/Video/LensHandleTag';
import MediaToggleButton from '@components/Messages/Push/Video/MediaToggleButton';
import Video from '@components/Messages/Push/Video/Video';
import usePushVideoCall from '@components/utils/hooks/push/usePushVideoCall';
import React from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Card, Image } from 'ui';

import { getProfileFromDID } from '../helper';

const OngoingCall = () => {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const localDID = connectedProfile?.did;

  const videoCallData = usePushChatStore((state) => state.videoCallData);
  const receiverDID = videoCallData.incoming[0].address;
  const incomingStream = videoCallData.incoming[0].stream;
  const isIncomingVideoOn = videoCallData.incoming[0].video;
  const localStream = videoCallData.local.stream;
  const isLocalVideoOn = videoCallData.local.video;
  const isLocalAudioOn = videoCallData.local.audio;

  const { disconnectVideoCall, toggleAudio, toggleVideo } = usePushVideoCall();

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-[100%] max-w-[100%] grow items-center justify-center  sm:w-[100%] md:w-[100%] 2xl:max-w-screen-xl">
        <Card className="mt-1 w-[100%] sm:mt-4 sm:w-[90%] md:mt-4 md:w-[95%]">
          <div className="pb-4 pt-4">
            <span className="absolute left-0 right-0 top-5 m-auto mb-2 flex hidden items-center justify-center sm:static sm:flex md:static md:flex">
              <div className="mb-2 flex items-center rounded-lg bg-[#F4F4F5] px-2 py-0.5 dark:bg-[#18181B] sm:p-2 md:p-2">
                <Image
                  className="mr-2 h-4 dark:hidden"
                  src="/push/lock.svg"
                  alt="lock"
                />
                <Image
                  className="mr-2 hidden h-4 dark:flex"
                  src="/push/lockdark.svg"
                  alt="lock"
                />
                <span className="text-[10px] text-[#9E9EA9] dark:text-[#D4D4D8] sm:text-[13px] md:text-[15px]">
                  End-to-end encrypted
                </span>
              </div>
            </span>
            <div className="relative">
              <Video
                isVideoOn={isIncomingVideoOn}
                stream={incomingStream}
                profileId={getProfileFromDID(receiverDID)}
                isMainFrame={true}
                videoFramestyles="bg-black h-[66vh] w-[95%] rounded-2xl object-cover sm:block sm:h-[62vh] md:h-[62vh]"
              />
              <div className="absolute bottom-2 right-5 sm:right-10 md:right-10">
                <Video
                  isVideoOn={isLocalVideoOn}
                  stream={localStream}
                  profileId={getProfileFromDID(localDID!)}
                  isMainFrame={false}
                  videoFramestyles="h-[120px] w-[198px] bg-white object-cover sm:h-[143px] sm:w-[254px] md:h-[143px] md:w-[254px] rounded-2xl"
                />
              </div>
            </div>
          </div>
          <div className="absolute ml-6 mt-[-60px] rounded-xl bg-[#2E313B] px-[8px] py-[3px] text-white sm:ml-10 md:ml-10">
            <LensHandleTag
              profileId={getProfileFromDID(videoCallData.incoming[0].address)}
            />
          </div>
          <div className="absolute mb-4 mt-2 flex cursor-pointer items-center justify-center gap-2.5 sm:static md:static">
            <MediaToggleButton
              iconSrc={`/push/${
                isLocalVideoOn ? 'cameraonbtn' : 'cameraoffbtn'
              }.svg`}
              styles={`bg-${isLocalVideoOn ? 'white' : '[red]'} border-${
                isLocalVideoOn ? '[#D4D4D8]' : 'none'
              }`}
              onClick={toggleVideo}
            />
            <MediaToggleButton
              iconSrc={`/push/${isLocalAudioOn ? 'miconbtn' : 'micoffbtn'}.svg`}
              styles={`bg-${isLocalAudioOn ? 'white' : '[red]'} border-${
                isLocalAudioOn ? '[#D4D4D8]' : 'none'
              }`}
              onClick={toggleAudio}
            />
            <CallButton
              iconSrc={'/push/callendbtn.svg'}
              styles="px-[28px] w-[80px] bg-[red]"
              onClick={disconnectVideoCall}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OngoingCall;
