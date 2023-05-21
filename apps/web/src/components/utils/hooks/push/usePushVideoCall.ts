import type { SignerType } from '@pushprotocol/restapi';
import { video as PushVideo, VideoCallStatus } from '@pushprotocol/restapi';
import { produce } from 'immer';
import { useEffect } from 'react';
import { CHAIN_ID } from 'src/constants';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useEthersWalletClient from '../useEthersWalletClient';

interface AcceptVideoCallRequestOptionsType {
  signalData: any;
}

interface ConnectVideoCallOptionsType {
  signalData: any;
}

interface VideoCallMetaDataType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalData?: any;
  status: VideoCallStatus;
}

const usePushVideoCall = () => {
  const { data: walletClient } = useEthersWalletClient();
  const videoCallObject = usePushChatStore((state) => state.videoCallObject);
  const setVideoCallObject = usePushChatStore(
    (state) => state.setVideoCallObject
  );
  const { decrypted: decryptedPgpPvtKey } = usePushChatStore(
    (state) => state.pgpPrivateKey
  );
  const videoCallData = usePushChatStore((state) => state.videoCallData);
  const setVideoCallData = usePushChatStore((state) => state.setVideoCallData);
  // const selectedChatId = usePushChatStore((state) => state.selectedChatId);

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

  const requestVideoCall = () => {
    console.log('requestVideoCall');

    try {
      videoCallObject?.request({
        senderAddress: videoCallData.local.address,
        recipientAddress: videoCallData.incoming[0].address,
        chatId: videoCallData.meta.chatId
      });
    } catch (error) {
      console.log('Error in requesting video call', error);
    }
  };

  const acceptVideoCallRequest = ({
    signalData
  }: AcceptVideoCallRequestOptionsType): void => {
    console.log('acceptVideoCallRequest');

    try {
      videoCallObject?.acceptRequest({
        signalData: signalData
          ? signalData
          : videoCallData.meta.initiator.signal,
        senderAddress: videoCallData.local.address,
        recipientAddress: videoCallData.incoming[0].address,
        chatId: videoCallData.meta.chatId
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

  const setIncomingVideoCall = (videoCallMetaData: VideoCallMetaDataType) => {
    videoCallObject?.setData((oldData) => {
      return produce(oldData, (draft) => {
        draft.local.address = videoCallMetaData.recipientAddress;
        draft.incoming[0].address = videoCallMetaData.senderAddress;
        draft.incoming[0].status = VideoCallStatus.RECEIVED;
        draft.meta.chatId = videoCallMetaData.chatId;
        draft.meta.initiator.address = videoCallMetaData.senderAddress;
        draft.meta.initiator.signal = videoCallMetaData.signalData;
      });
    });
  };

  // const setRequestVideoCall = async () => {
  //   const localUserAddress = await walletClient.getAddress();
  //   videoCallObject?.setData((oldData) => {
  //     return produce(oldData, (draft) => {
  //       draft.local.address = localUserAddress;
  //       draft.incoming[0].address = ; // get wallet address from chat id
  //       draft.incoming[0].status = VideoCallStatus.INITIALIZED;
  //       draft.meta.chatId = selectedChatId;
  //     });
  //   });
  // };

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

  return {
    createMediaStream,
    requestVideoCall,
    acceptVideoCallRequest,
    connectVideoCall,
    disconnectVideoCall,
    setIncomingVideoCall,
    // setRequestVideoCall,
    toggleVideo,
    toggleAudio
  };
};

export default usePushVideoCall;
