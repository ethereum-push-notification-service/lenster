import { XIcon } from '@heroicons/react/outline';
import type { ProgressHookType } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Button, Image, Input, Spinner } from 'ui';
import { useSigner } from 'wagmi';

type handleSetPassFunc = () => void;
const totalSteps: number = 6;
enum ProgressType {
  INITIATE = 'INITIATE',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN'
}

const useUpgradeChatProfile = () => {
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowCreateChatProfileModal = usePushChatStore((state) => state.setShowCreateChatProfileModal);
  const [step, setStep] = useState<number>(1);
  const [modalClosable, setModalClosable] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [modalInfo, setModalInfo] = useState<{
    title: string;
    info: string;
    type: string;
  }>({
    title: '',
    info: '',
    type: ProgressType.INITIATE
  });

  const handleProgress = (progress: ProgressHookType) => {
    setStep((step) => step + 1);
    setModalInfo({
      title: progress.progressTitle,
      info: progress.progressInfo,
      type: progress.level
    });
    if (progress.level === 'INFO') {
      setModalClosable(false);
    } else {
      if (progress.level === 'SUCCESS') {
        const timeout = 2000; // after this time, modal will be closed
        setTimeout(() => {
          setShowCreateChatProfileModal(false);
        }, timeout);
      }
      setModalClosable(true);
    }
  };

  const initiateProcess = () => {
    setStep(1);
    setModalInfo({
      title: 'Existing Profile Detected',
      info: 'Please set a password to recover your chats if you transfer your Lens NFT to another wallet.',
      type: ProgressType.INITIATE
    });
    setPassword('');
    setModalClosable(true);
  };

  const handleSetPassword: handleSetPassFunc = async () => {
    if (!signer || !currentProfile) {
      return;
    }

    try {
      await PushAPI.user.createNFTProfile({
        signer: signer,
        password: password,
        did: `eip155:${CHAIN_ID}:${LENSHUB_PROXY}:nft:${currentProfile.id}`,
        progressHook: handleProgress,
        env: PUSH_ENV
      });
      setStep(2);
    } catch (error) {
      console.log(error);
      // handle error here
      const timeout = 3000; // after this time, show modal state to 1st step
      setTimeout(() => {
        initiateProcess();
      }, timeout);
    }
  };

  const createChatProfile = async () => {
    setShowCreateChatProfileModal(true);
    initiateProcess();
  };

  let modalContent: JSX.Element;
  switch (modalInfo.type) {
    case ProgressType.INITIATE:
      modalContent = (
        <div className="relative flex w-full flex-col px-4 py-6">
          <button
            type="button"
            className="absolute right-0 top-0 p-1 pr-4 pt-6 text-[#82828A] dark:text-gray-100"
            onClick={() => setShowCreateChatProfileModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="pb-1.5 text-center text-base font-medium">
            {step}/{totalSteps} - {modalInfo.title}
          </div>
          <div className="pb-4 text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>
          <div className="pb-2 text-base font-medium">Enter new password</div>
          <Input
            type="text"
            className="px-4 py-4 text-sm"
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="mt-7 self-center text-center"
            variant="primary"
            disabled={password === '' ? true : false}
            onClick={handleSetPassword}
          >
            Set password
          </Button>
        </div>
      );
      break;
    case ProgressType.INFO:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="pb-4 text-center text-base font-medium">
            {step}/{totalSteps} - {modalInfo.title}
          </div>
          <div className="pb-4 text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>
          <Spinner variant="primary" size="sm" className="mb-4 self-center" />
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2 rounded-full p-0.5 leading-none"
              style={{ width: `${(step * 100) / totalSteps}%` }}
            />
          </div>
        </div>
      );
      break;
    case ProgressType.SUCCESS:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="flex items-center justify-center pb-4 text-center text-base font-medium">
            <Image
              src="/checkcircle.png"
              loading="lazy"
              className="mr-2 h-7 w-7 rounded-full"
              alt="Check circle"
            />{' '}
            {step}/{totalSteps} - {modalInfo.title}
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2 rounded-full p-0.5 leading-none"
              style={{ width: `${(step * 100) / totalSteps}%` }}
            />
          </div>
        </div>
      );
      break;
    case ProgressType.ERROR:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="flex items-center justify-center pb-4 text-center text-sm font-medium text-[#EF4444]">
            <Image
              src="/xcircle.png"
              loading="lazy"
              className="mr-2 h-7 w-7 rounded-full"
              alt="Check circle"
            />{' '}
            {modalInfo.info} Redirecting...
          </div>
        </div>
      );
      break;
    default:
      modalContent = (
        <div className="relative flex w-full flex-col px-4 py-6">
          <button
            type="button"
            className="absolute right-0 top-0 p-1 pr-4 pt-6 text-[#82828A] dark:text-gray-100"
            onClick={() => setShowCreateChatProfileModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="pb-4 text-center text-base font-medium">{modalInfo.title}</div>
          <div className="text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>
        </div>
      );
  }

  return { createChatProfile, modalContent, isModalClosable: modalClosable };
};

export default useUpgradeChatProfile;
