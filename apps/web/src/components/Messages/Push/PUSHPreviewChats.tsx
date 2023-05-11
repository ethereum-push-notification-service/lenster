import Loader from '@components/Shared/Loader';
import useFetchChats from '@components/utils/hooks/push/useFetchChats';
import { useIsInViewport } from '@components/utils/hooks/push/useIsInViewport';
import type { IFeeds } from '@pushprotocol/restapi/src/lib/types';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

export const PreviewMessage = ({ messageType, content }: { messageType: string; content: string }) => {
  if (messageType === 'GIF') {
    return <Image className="right-2.5 top-2.5" src="/push/gitIcon.svg" alt="" />;
  }

  return <p className="max-w-[150px] truncate text-sm text-gray-500">{content}</p>;
};

const chatLimit = 8;
export default function PUSHPreviewChats() {
  const router = useRouter();
  const testRef = useRef<HTMLDivElement>(null);

  // const [parsedChats, setParsedChats] = useState<any>([]);
  const { fetchChats, loading } = useFetchChats();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const setChatsFeed = usePushChatStore((state) => state.setChatsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const [page, setPage] = useState<number>(1);
  const [allFeeds, setAllFeeds] = useState<object[]>();
  const [paginateLoading, setPaginateLoading] = useState<boolean>(false);
  const isInViewport1 = useIsInViewport(testRef, '0px');

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  // load all chatsFeed
  useEffect(() => {
    if (Object.keys(chatsFeed).length) {
      return;
    }

    (async function () {
      // only run this hook when there's a decrypted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      let feeds = await fetchChats({ page, chatLimit });
      let firstFeeds: { [key: string]: IFeeds } = { ...feeds };
      setChatsFeed(firstFeeds);
    })();
  }, [decryptedPgpPvtKey, fetchChats, page]);

  useEffect(() => {
    if (!isInViewport1 || loading || Object.keys(chatsFeed).length < chatLimit) {
      return;
    }

    let newPage = page + 1;
    setPage(newPage);
    // eslint-disable-next-line no-use-before-define
    callFeeds(newPage);
  }, [isInViewport1]);

  // action for when you click on a chat
  const onChatFeedClick = (chatId: string) => {
    router.push(`/messages/push/chat/${chatId}`);
  };

  const callFeeds = async (page: number) => {
    if (!decryptedPgpPvtKey) {
      return;
    }
    try {
      setPaginateLoading(true);
      let feeds = await fetchChats({ page, chatLimit });
      let newFeed: { [key: string]: IFeeds } = { ...chatsFeed, ...feeds };
      setChatsFeed(newFeed);
    } catch (error) {
      console.log(error);
      setPaginateLoading(false);
    } finally {
      setPaginateLoading(false);
    }
  };

  const withNestedKeys = (data?: any) => {
    // let newArray = [];
    let newList = Object.entries(data).map((entry) => {
      return { [entry[0]]: entry[1] };
    });
    // if (newList) {
    //   for (const element of newList) {
    //     const [resultOf] = Object.entries(element).map(([id, val]) => ({ id, ...val }));
    //     newArray.push(resultOf);
    //   }
    // }
    // return newArray;
    return newList;
  };

  useEffect(() => {
    setChatsFeed(chatsFeed);
    let getItems = withNestedKeys(chatsFeed);
    setAllFeeds(getItems);
  }, [chatsFeed]);

  return (
    <section className="flex flex-col gap-2.5	overflow-auto">
      {!loading ? (
        // allFeeds
        //   ?.sort((a, b) => b?.msg?.timestamp - a?.msg?.timestamp)
        allFeeds?.map((item, i) => {
          // let id = item.id;
          // let feed = chatsFeed[id];
          // let lensProfile = lensProfiles.get(id);
          return (
            <div key={i}>koko</div>
            // <div
            //   onClick={() => onChatFeedClick(id)}
            //   key={id}
            //   className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
            //     selectedChatId === id && 'bg-brand-100'
            //   }`}
            // >
            //   <Image
            //     onError={({ currentTarget }) => {
            //       currentTarget.src = getAvatar(lensProfile, false);
            //     }}
            //     src={getAvatar(lensProfile)}
            //     loading="lazy"
            //     className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
            //     height={40}
            //     width={40}
            //     alt={formatHandle(lensProfile?.handle)}
            //   />
            //   <div className="flex w-full	justify-between	">
            //     <div>
            //       <p className="bold max-w-[180px] truncate text-base">{formatHandle(lensProfile?.handle)}</p>
            //       {/* <p className="text-sm text-gray-500	">{feed.msg.messageContent}</p> */}
            //       <PreviewMessage content={feed?.msg.messageContent} messageType={feed?.msg.messageType} />
            //     </div>
            //     <div>
            //       <span className="text-xs text-gray-500">{moment(feed.msg.timestamp).fromNow()}</span>
            //     </div>
            //   </div>
            // </div>
          );
        })
      ) : (
        <div className="flex h-full flex-grow items-center justify-center">
          <Loader message="Loading Chats" />
        </div>
      )}

      <div ref={testRef} className="invisible" />

      {paginateLoading && (
        <div className="flex h-full flex-grow items-center justify-center">
          <Loader message="Loading More Chats" />
        </div>
      )}
    </section>
  );
}
