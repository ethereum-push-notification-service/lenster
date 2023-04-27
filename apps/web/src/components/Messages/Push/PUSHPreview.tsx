import { chat, chats } from '@components/utils/hooks/push/data';
import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
// import useFetchChat from '@components/utils/hooks/push/useFetchChat';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/router';
import { type FC, useEffect, useState } from 'react';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Card, Input, Modal } from 'ui';

interface PreviewListProps {
  selectedConversationKey?: string;
}

const PUSHPreview: FC<PreviewListProps> = () => {
  const router = useRouter();

  const activeTab = usePushChatStore((state) => state.activeTab);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const showCreateChatProfileModal = usePushChatStore((state) => state.showCreateChatProfileModal);
  const setShowCreateChatProfileModal = usePushChatStore((state) => state.setShowCreateChatProfileModal);
  const { modalContent, isModalClosable } = useCreateChatProfile();
  // todo once we have the type of chats, replace it with 'any' here
  const [allChats, setAllChats] = useState<any>([]);

  useEffect(() => {
    // const chats = useFetchChats()
    // todo once we have the type of chats, replace it with 'any' here
    const userChats = [...chats].map((oneChat: any) => {
      // populate the latest chat for this conversation
      // const response = useFetchChat()
      oneChat.chat = chat;
      return oneChat;
    });
    setAllChats(userChats);
  }, []);

  const [conversationId] = router.query.conversationKey as string[];

  const clickChat = (key: string) => {
    router.push(`/messages/push/${key}`);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <Card className="flex h-full flex-col p-4 pt-7">
        {/* section for header */}
        <section className="mb-4">
          <div className="mb-6 flex gap-x-5 border-b border-b-gray-300">
            <div
              onClick={() => setActiveTab(PUSH_TABS.CHATS)}
              className={`w-6/12 cursor-pointer border-b-4 pb-3.5 text-center  font-bold ${
                activeTab === PUSH_TABS.CHATS ? 'border-b-violet-500' : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Chats</Trans>
            </div>
            <div
              onClick={() => setActiveTab(PUSH_TABS.REQUESTS)}
              className={`align-items-center flex w-6/12 cursor-pointer justify-center gap-x-1.5 border-b-4 pb-3.5 font-bold ${
                activeTab === PUSH_TABS.REQUESTS
                  ? 'border-b-violet-500'
                  : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Requests</Trans>
              <div className=" flex h-5 w-7 justify-center rounded-full bg-violet-500 text-sm text-white">
                2
              </div>
            </div>
          </div>

          <div className="flex gap-x-2">
            <Input placeholder="Search name.eth or 0x123..." />
            <div className="">
              <img className="h-10 w-11" src="/push/requestchat.svg" alt="plus icon" />
            </div>
          </div>
        </section>
        {/* section for header */}
        {/* section for chats */}
        {activeTab === PUSH_TABS.CHATS && (
          <section className="flex flex-col	gap-2.5	">
            {/* todo change the type here from 'any' to another typw */}
            {allChats.map((oneChat: any, number: number) => (
              <div
                key={number}
                className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
                  conversationId === oneChat.id && 'bg-violet-100'
                }`}
                onClick={() => clickChat(oneChat.id)}
              >
                <img className="h-12	w-12 rounded-full" src="/user.svg" alt="" />
                <div className="flex w-full	justify-between	">
                  <div>
                    <p className="bold text-base">{oneChat.name}</p>
                    <p className="text-sm text-gray-500	">{oneChat.chat.text}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">{oneChat.chat.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
        {/* section for chats */}
        {/* sections for requests */}
        {activeTab === PUSH_TABS.REQUESTS && <section>requests</section>}
        {/* sections for requests */}
      </Card>
      {/* <button onClick={createChatProfile}>Create Profile</button> */}
      <Modal
        size="xs"
        show={showCreateChatProfileModal}
        onClose={isModalClosable ? () => setShowCreateChatProfileModal(false) : () => {}}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default PUSHPreview;
