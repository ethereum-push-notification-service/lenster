import type { IFeeds, SignerType } from '@pushprotocol/restapi';
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

interface SetRequestVideoCallOptionsType {
  selectedChat: IFeeds;
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
    selectedChat
  }: SetRequestVideoCallOptionsType) => {
    const localUserAddress = await walletClient.getAddress();

    videoCallObject?.setData((oldData) => {
      return produce(oldData, (draft) => {
        if (!selectedChat.chatId || selectedChat.wallets) {
          return;
        }

        draft.local.address = localUserAddress;
        draft.incoming[0].address = selectedChat.wallets;
        draft.incoming[0].status = VideoCallStatus.INITIALIZED;
        draft.meta.chatId = selectedChat.chatId;
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

  return {
    createMediaStream,
    requestVideoCall,
    acceptVideoCallRequest,
    connectVideoCall,
    disconnectVideoCall,
    setIncomingVideoCall,
    setRequestVideoCall,
    toggleVideo,
    toggleAudio
  };
};

export default usePushVideoCall;
