import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useEffect } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV } from 'src/store/push-chat';
import * as pushChat from 'src/store/push-chat';

const useGetChatProfile = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const connectedProfile = pushChat.usePushChatStore((state) => state.connectedProfile);
  const setConnectedProfile = pushChat.usePushChatStore((state) => state.setConnectedProfile);
  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    const fetchChatProfile = async () => {
      try {
        const did = `eip155:${CHAIN_ID}:${LENSHUB_PROXY}:nft:${currentProfile.id}`;
        const profile = await PushAPI.user.getNFTProfile({
          env: PUSH_ENV,
          did: did
        });
        setConnectedProfile(profile);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChatProfile();
  }, [connectedProfile, currentProfile, setConnectedProfile]);
  return { connectedProfile };
};

export default useGetChatProfile;
