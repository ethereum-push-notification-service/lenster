import * as PushAPI from '@pushprotocol/restapi';
import { ADDITIONAL_META_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useEffect, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV } from 'src/store/push-chat';

import type { VideoCallMetaDataType } from './usePushVideoCall';
import usePushVideoCall from './usePushVideoCall';

const NOTIFICATION_SOCKET_TYPE = 'notification';

interface PushNotificationSocket {
  isNotificationSocketConnected: boolean;
}

const usePushNotificationSocket = (): PushNotificationSocket => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [notificationSocket, setNotificationSocket] = useState<any>(null);
  const [isNotificationSocketConnected, setIsNotificationSocketConnected] =
    useState<boolean>(false);

  const {
    setIncomingVideoCall,
    connectVideoCall,
    isVideoCallInitiator,
    requestVideoCall,
    acceptVideoCallRequest,
    resetVideoCallState
  } = usePushVideoCall();

  const addSocketEvents = useCallback(() => {
    notificationSocket?.on(EVENTS.CONNECT, () => {
      setIsNotificationSocketConnected(true);
    });

    notificationSocket?.on(EVENTS.DISCONNECT, () => {
      setIsNotificationSocketConnected(false);
    });

    notificationSocket?.on(EVENTS.USER_FEEDS, (feedItem: any) => {
      try {
        const { payload } = feedItem || {};

        // check for additionalMeta
        if (
          payload.hasOwnProperty('data') &&
          payload['data'].hasOwnProperty('additionalMeta')
        ) {
          const {
            data: { additionalMeta }
          } = payload;

          // check for PUSH_VIDEO
          if (additionalMeta.type === `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`) {
            const videoCallMetaData: VideoCallMetaDataType = JSON.parse(
              additionalMeta.data
            );

            if (
              videoCallMetaData.status === PushAPI.VideoCallStatus.INITIALIZED
            ) {
              setIncomingVideoCall(videoCallMetaData);
            } else if (
              videoCallMetaData.status === PushAPI.VideoCallStatus.RECEIVED ||
              videoCallMetaData.status ===
                PushAPI.VideoCallStatus.RETRY_RECEIVED
            ) {
              connectVideoCall({ signalData: videoCallMetaData.signalData });
            } else if (
              videoCallMetaData.status === PushAPI.VideoCallStatus.DISCONNECTED
            ) {
              resetVideoCallState();
            } else if (
              videoCallMetaData.status ===
                PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
              isVideoCallInitiator()
            ) {
              requestVideoCall({
                retry: true
              });
            } else if (
              videoCallMetaData.status ===
                PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
              !isVideoCallInitiator()
            ) {
              acceptVideoCallRequest({
                signalData: videoCallMetaData.signalData,
                retry: true
              });
            }
          }
        }
      } catch (error) {
        console.error('Error while diplaying received Notification: ', error);
      }
    });
  }, [
    notificationSocket,
    isVideoCallInitiator,
    setIncomingVideoCall,
    connectVideoCall,
    resetVideoCallState,
    requestVideoCall,
    acceptVideoCallRequest
  ]);

  const removeSocketEvents = useCallback(() => {
    notificationSocket?.off(EVENTS.CONNECT);
    notificationSocket?.off(EVENTS.DISCONNECT);
    notificationSocket?.off(EVENTS.USER_FEEDS);
  }, [notificationSocket]);

  useEffect(() => {
    if (notificationSocket) {
      addSocketEvents();
    }

    return () => {
      if (notificationSocket) {
        removeSocketEvents();
      }
    };
  }, [addSocketEvents, notificationSocket, removeSocketEvents]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (currentProfile) {
      const user = `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`;

      // this is auto-connect on instantiation
      const connectionObject = createSocketConnection({
        user,
        socketType: NOTIFICATION_SOCKET_TYPE,
        env: PUSH_ENV
      });
      setNotificationSocket(connectionObject);
    }

    return () => {
      notificationSocket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  // useEffect(() => {
  //   console.log('isNotificationSocketConnected', isNotificationSocketConnected);
  // }, [isNotificationSocketConnected]);

  return {
    isNotificationSocketConnected
  };
};

export default usePushNotificationSocket;
