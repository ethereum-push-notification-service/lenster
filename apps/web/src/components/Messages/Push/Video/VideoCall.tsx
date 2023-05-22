import usePushVideoCall from '@components/utils/hooks/push/usePushVideoCall';
import { VideoCallStatus } from '@pushprotocol/restapi';
import { useEffect } from 'react';
import { usePushChatStore } from 'src/store/push-chat';

import IncomingCallModal from './IncomingCallModal';
import OngoingCall from './OngoingCall';
import OutgoingCallModal from './OutgoingCallModal';

const VideoCall = () => {
  const videoCallData = usePushChatStore((state) => state.videoCallData);
  const currentStatus = videoCallData.incoming[0].status;
  const localStream = videoCallData.local.stream;

  const { createMediaStream, requestVideoCall } = usePushVideoCall();

  useEffect(() => {
    (async () => {
      if (localStream === null) {
        await createMediaStream();
      } else if (currentStatus === VideoCallStatus.INITIALIZED) {
        await requestVideoCall({});
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream]);

  if (currentStatus === VideoCallStatus.INITIALIZED) {
    return <OutgoingCallModal />;
  }

  if (currentStatus === VideoCallStatus.RECEIVED) {
    return <IncomingCallModal />;
  }

  return <OngoingCall />;
};

export default VideoCall;
