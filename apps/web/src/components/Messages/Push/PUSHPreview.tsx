import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import useGetChatProfile from '@components/utils/hooks/push/useGetChatProfile';
import useCreateGroup from '@components/utils/hooks/push/usePushCreateGroupChat';
import usePushDecryption from '@components/utils/hooks/push/usePushDecryption';
import useUpgradeChatProfile from '@components/utils/hooks/push/useUpgradeChatProfile';
import { Trans } from '@lingui/macro';
import { type FC, useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Card, Input, Modal } from 'ui';

interface PreviewListProps {
  selectedConversationKey?: string;
}
const activeIndex = 1;

const PUSHPreview: FC<PreviewListProps> = () => {
  const { fetchChatProfile } = useGetChatProfile();
  const activeTab = usePushChatStore((state) => state.activeTab);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const setPgpPrivateKey = usePushChatStore((state) => state.setPgpPrivateKey);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const showCreateChatProfileModal = usePushChatStore((state) => state.showCreateChatProfileModal);
  const setShowCreateChatProfileModal = usePushChatStore((state) => state.setShowCreateChatProfileModal);
  const showUpgradeChatProfileModal = usePushChatStore((state) => state.showUpgradeChatProfileModal);
  const showDecryptionModal = usePushChatStore((state) => state.showDecryptionModal);
  const { createChatProfile } = useCreateChatProfile();
  const { upgradeChatProfile } = useUpgradeChatProfile();
  const { decryptKey } = usePushDecryption();
  const setShowUpgradeChatProfileModal = usePushChatStore((state) => state.setShowUpgradeChatProfileModal);
  const setShowDecryptionModal = usePushChatStore((state) => state.setShowDecryptionModal);
  const { modalContent: createChatProfileModalContent, isModalClosable: isCreateChatProfileModalClosable } =
    useCreateChatProfile();
  const { modalContent: upgradeChatProfileModalContent, isModalClosable: isUpgradeChatProfileModalClosable } =
    useUpgradeChatProfile();
  const { modalContent: decryptionModalContent, isModalClosable: isDecryptionModalClosable } =
    usePushDecryption();
  console.log('push preview');
  useEffect(() => {
    const connectUser = async () => {
      const connectedProfile = await fetchChatProfile();
      if (connectedProfile && connectedProfile.encryptedPrivateKey) {
        setPgpPrivateKey({ encrypted: connectedProfile.encryptedPrivateKey });
        const encryptedPvtKey = connectedProfile.encryptedPrivateKey;
        const decryptedPvtKey = await decryptKey({ encryptedText: encryptedPvtKey });
        if (decryptedPvtKey) {
          setPgpPrivateKey({ decrypted: decryptedPvtKey });
        } else {
          upgradeChatProfile();
        }
      }
    };
    connectUser();
  }, [currentProfile, decryptKey, fetchChatProfile, setPgpPrivateKey, upgradeChatProfile]);
  const setShowCreateGroupModal = usePushChatStore((state) => state.setShowCreateGroupModal);
  const showCreateGroupModal = usePushChatStore((state) => state.showCreateGroupModal);
  const { modalContent, isModalClosable } = useCreateChatProfile();
  const {
    createGroup,
    modalContent: createGroupModalContent,
    isModalClosable: isCreateModalClosable
  } = useCreateGroup();

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
            {[1, 2].map((number) => (
              <div
                key={number}
                className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
                  activeIndex === number && 'bg-violet-100'
                }`}
              >
                <img className="h-12	w-12 rounded-full" src="/user.svg" alt="" />
                <div className="flex w-full	justify-between	">
                  <div>
                    <p className="bold text-base">Sasi</p>
                    <p className="text-sm text-gray-500	">GMGM!!</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">a minute ago</span>
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
      <button onClick={createChatProfile}>Create Profile</button>
      <button onClick={upgradeChatProfile}>Upgrade Profile</button>
      {/* <button onClick={createChatProfile}>Create Profile</button> */}
      <button onClick={createGroup}>Create Group</button>
      <Modal
        size="xs"
        show={showCreateGroupModal}
        onClose={isCreateModalClosable ? () => setShowCreateGroupModal(false) : () => {}}
      >
        {createGroupModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showCreateChatProfileModal}
        onClose={isCreateChatProfileModalClosable ? () => setShowCreateChatProfileModal(false) : () => {}}
      >
        {createChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showUpgradeChatProfileModal}
        onClose={isUpgradeChatProfileModalClosable ? () => setShowUpgradeChatProfileModal(false) : () => {}}
      >
        {upgradeChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showDecryptionModal}
        onClose={isDecryptionModalClosable ? () => setShowDecryptionModal(false) : () => {}}
      >
        {decryptionModalContent}
      </Modal>
    </div>
  );
};

export default PUSHPreview;
