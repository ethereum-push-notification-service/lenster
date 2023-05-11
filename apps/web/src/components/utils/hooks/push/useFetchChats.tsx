import { getProfileFromDID } from '@components/Messages/Push/helper';
import type { IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useFetchLensProfiles from './useFetchLensProfiles';

interface fetchChats {
  page: number;
  chatLimit: number;
}

const useFetchChats = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setChatsFeed = usePushChatStore((state) => state.setChatsFeed);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const { loadLensProfiles } = useFetchLensProfiles();

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const fetchChats = useCallback(
    async ({ page, chatLimit }: fetchChats) => {
      if (!currentProfile) {
        return;
      }
      if (page === 1) {
        setLoading(true);
      }
      try {
        const chats = await PushAPI.chat.chats({
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`,
          toDecrypt: decryptedPgpPvtKey ? true : false,
          pgpPrivateKey: String(decryptedPgpPvtKey),
          env: PUSH_ENV,
          page: page,
          limit: chatLimit
        });

        const lensIds: Array<string> = [];

        //conversation to map from array
        const modifiedChatsObj: { [key: string]: IFeeds } = {};

        for (const chat of chats) {
          const profileId: string = getProfileFromDID(chat.did);
          lensIds.push(profileId);
          modifiedChatsObj[profileId] = chat;
        }

        await loadLensProfiles(lensIds);
        // if (page <= 1) {
        //   setChatsFeed(modifiedChatsObj);
        // } else {
        //   let newFeed: { [key: string]: IFeeds } = { ...chatsFeed, ...modifiedChatsObj };
        //   setChatsFeed(newFeed);
        //   console.log(chatsFeed, newFeed, 'alltogether');
        // }
        // console.log(modifiedChatsObj, 'modified');
        return modifiedChatsObj;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [currentProfile, decryptedPgpPvtKey, loadLensProfiles, setChatsFeed]
  );

  return { fetchChats, error, loading };
};

export default useFetchChats;
