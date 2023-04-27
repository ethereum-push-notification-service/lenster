import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
// import useFetchChat from '@components/utils/hooks/push/useFetchChat';
import { Trans } from '@lingui/macro';
import { type FC } from 'react';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Card, Input, Modal } from 'ui';

import PUSHPreviewChats from './PUSHPreviewChats';
import PUSHPreviewRequests from './PUSHPreviewRequests';

interface PreviewListProps {
  selectedConversationKey?: string;
}

const PUSHPreview: FC<PreviewListProps> = ({ selectedConversationKey }) => {
  const activeTab = usePushChatStore((state) => state.activeTab);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const showCreateChatProfileModal = usePushChatStore((state) => state.showCreateChatProfileModal);
  const setShowCreateChatProfileModal = usePushChatStore((state) => state.setShowCreateChatProfileModal);
  const { modalContent, isModalClosable } = useCreateChatProfile();

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
          <PUSHPreviewChats selectedConversationKey={String(selectedConversationKey)} />
        )}
        {/* section for chats */}
        {/* sections for requests */}
        {activeTab === PUSH_TABS.REQUESTS && <PUSHPreviewRequests />}
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
