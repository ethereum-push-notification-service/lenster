import type { SignerType } from '@pushprotocol/restapi';
import { video as PushVideo, VideoCallStatus } from '@pushprotocol/restapi';
import { initVideoCallData } from '@pushprotocol/restapi/src/lib/video';
import { produce } from 'immer';
import { useEffect } from 'react';
import { CHAIN_ID } from 'src/constants';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useEthersWalletClient from '../useEthersWalletClient';

interface RequestVideoCallOptionsType {
  retry?: boolean;
}

interface AcceptVideoCallRequestOptionsType {
  signalData?: any;
  retry?: boolean;
}

interface ConnectVideoCallOptionsType {
  signalData: any;
}

interface SetRequestVideoCallOptionsType {
  selectedChatId?: string;
}

export interface VideoCallMetaDataType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalData?: any;
  status: VideoCallStatus;
}

const usePushVideoCall = () => {
  const { data: walletClient } = useEthersWalletClient();

  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const localDID = connectedProfile?.did;

  const receiverDID = usePushChatStore((state) => state.selectedChatId);

  const videoCallObject = usePushChatStore((state) => state.videoCallObject);
  const setVideoCallObject = usePushChatStore(
    (state) => state.setVideoCallObject
  );
  const { decrypted: decryptedPgpPvtKey } = usePushChatStore(
    (state) => state.pgpPrivateKey
  );
  const videoCallData = usePushChatStore((state) => state.videoCallData);
  const setVideoCallData = usePushChatStore((state) => state.setVideoCallData);

  useEffect(() => {
    if (videoCallObject !== null || !decryptedPgpPvtKey || !walletClient) {
      return;
    }

    const videoObject = new PushVideo.Video({
      signer: walletClient as SignerType,
      chainId: CHAIN_ID,
      pgpPrivateKey: decryptedPgpPvtKey,
      env: PUSH_ENV,
      setData: setVideoCallData
    });

    setVideoCallObject(videoObject);
  }, [
    videoCallObject,
    walletClient,
    decryptedPgpPvtKey,
    setVideoCallData,
    setVideoCallObject
  ]);

  const createMediaStream = async (): Promise<void> => {
    console.log('createMediaStream');

    try {
      if (!videoCallData.local.stream) {
        await videoCallObject?.create({ video: true, audio: true });
      }
    } catch (error) {
      console.log('Error in getting local stream', error);
    }
  };

  const requestVideoCall = ({ retry = false }: RequestVideoCallOptionsType) => {
    console.log('requestVideoCall');

    try {
      videoCallObject?.request({
        senderAddress: videoCallData.local.address,
        recipientAddress: videoCallData.incoming[0].address,
        chatId: videoCallData.meta.chatId,
        retry
      });
    } catch (error) {
      console.log('Error in requesting video call', error);
    }
  };

  const acceptVideoCallRequest = ({
    signalData,
    retry = false
  }: AcceptVideoCallRequestOptionsType): void => {
    console.log('acceptVideoCallRequest');

    try {
      videoCallObject?.acceptRequest({
        signalData: signalData
          ? signalData
          : videoCallData.meta.initiator.signal,
        senderAddress: videoCallData.local.address,
        recipientAddress: videoCallData.incoming[0].address,
        chatId: videoCallData.meta.chatId,
        retry
      });
    } catch (error) {
      console.log('Error in accepting request for video call', error);
    }
  };

  const connectVideoCall = ({ signalData }: ConnectVideoCallOptionsType) => {
    console.log('connectVideoCall');

    try {
      videoCallObject?.connect({
        signalData
      });
    } catch (error) {
      console.log('Error in connecting video call', error);
    }
  };

  const disconnectVideoCall = () => {
    console.log('disconnectVideoCall');

    try {
      videoCallObject?.disconnect();
    } catch (error) {
      console.log('Error in disconnecting video call', error);
    }
  };

  const setIncomingVideoCall = ({
    recipientAddress,
    senderAddress,
    chatId,
    signalData
  }: VideoCallMetaDataType) => {
    videoCallObject?.setData((oldData) => {
      return produce(oldData, (draft) => {
        draft.local.address = recipientAddress;
        draft.incoming[0].address = senderAddress;
        draft.incoming[0].status = VideoCallStatus.RECEIVED;
        draft.meta.chatId = chatId;
        draft.meta.initiator.address = senderAddress;
        draft.meta.initiator.signal = signalData;
      });
    });
  };

  const setRequestVideoCall = async ({
    selectedChatId
  }: SetRequestVideoCallOptionsType) => {
    videoCallObject?.setData((oldData) => {
      return produce(oldData, (draft) => {
        if (!selectedChatId || !localDID || !receiverDID) {
          return;
        }

        draft.local.address = localDID;
        draft.incoming[0].address = receiverDID;
        draft.incoming[0].status = VideoCallStatus.INITIALIZED;
        draft.meta.chatId = selectedChatId;
      });
    });
  };

  const toggleVideo = () => {
    try {
      videoCallObject?.enableVideo({ state: !videoCallData.local.video });
    } catch (error) {
      console.log('Error in toggling video', error);
    }
  };

  const toggleAudio = () => {
    try {
      videoCallObject?.enableAudio({ state: !videoCallData.local.audio });
    } catch (error) {
      console.log('Error in toggling audio', error);
    }
  };

  const isVideoCallInitiator = (): boolean => {
    return videoCallObject?.isInitiator()!;
  };

  const resetVideoCallState = () => {
    // end the local stream
    if (videoCallData.local.stream) {
      for (const track of videoCallData.local.stream?.getTracks()) {
        track.stop();
      }
    }

    // reset the state
    setVideoCallObject(null);
    setVideoCallData(() => initVideoCallData);
  };

  return {
    createMediaStream,
    requestVideoCall,
    acceptVideoCallRequest,
    connectVideoCall,
    disconnectVideoCall,
    setIncomingVideoCall,
    setRequestVideoCall,
    toggleVideo,
    toggleAudio,
    isVideoCallInitiator,
    resetVideoCallState
  };
};

export default usePushVideoCall;
