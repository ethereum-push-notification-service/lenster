import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import type { FC } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Modal } from 'ui';

interface PreviewListProps {
  selectedConversationKey?: string;
}
const PUSHPreview: FC<PreviewListProps> = () => {
  const showCreateChatProfileModal = usePushChatStore((state) => state.showCreateChatProfileModal);
  const setShowCreateChatProfileModal = usePushChatStore((state) => state.setShowCreateChatProfileModal);
  const { createChatProfile, modalContent, isModalClosable } = useCreateChatProfile();

  return (
    <div className="flex h-full flex-col justify-between">
      show push conversations to redirect to push conversation page
      <button onClick={createChatProfile}>Create Profile</button>
      <div>
        <Modal
          size="xs"
          show={showCreateChatProfileModal}
          onClose={isModalClosable ? () => setShowCreateChatProfileModal(false) : () => {}}
        >
          {modalContent}
        </Modal>
      </div>
    </div>
  );
};

export default PUSHPreview;
