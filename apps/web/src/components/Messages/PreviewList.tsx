import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';
import { MESSAGING_PROVIDER } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useMessagePersistStore, useMessageStore } from 'src/store/message';
import { Card, GridItemFour } from 'ui';

import PushPreviewList from './PushPreview';
import XMTPPreviewList from './XMTPPreview';

interface PreviewListProps {
  className?: string;
  selectedConversationKey?: string;
}

const PreviewList: FC<PreviewListProps> = ({ className, selectedConversationKey }) => {
  const router = useRouter();

  const { provider: urlProvider = MESSAGING_PROVIDER.PUSH } = router.query;

  const currentProfile = useAppStore((state) => state.currentProfile);
  const provider = useMessageStore((state) => state.provider);
  const setProvider = useMessageStore((state) => state.setProvider);
  const clearMessagesBadge = useMessagePersistStore((state) => state.clearMessagesBadge);

  const changeProvider = (newProvider: string) => {
    setProvider(newProvider);
    const queryParams = { provider: newProvider };
    if (!router.pathname.includes('[...conversationKey]')) {
      router.push({
        pathname: router.pathname,
        query: queryParams
      });
    }
  };

  useEffect(() => {
    const defaultProvider =
      urlProvider === MESSAGING_PROVIDER.XMTP ? MESSAGING_PROVIDER.XMTP : MESSAGING_PROVIDER.PUSH;
    changeProvider(defaultProvider);
  }, [urlProvider]);

  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    clearMessagesBadge(currentProfile.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return (
    <GridItemFour
      className={clsx(
        'xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-4 md:h-[80vh] xl:h-[84vh]',
        className
      )}
    >
      <Card className="mb-6 flex justify-between font-bold">
        <div
          onClick={() => changeProvider(MESSAGING_PROVIDER.XMTP)}
          className={`flex basis-1/2 cursor-pointer items-center justify-center rounded-l-xl py-2.5 transition-all hover:bg-gray-200 ${
            provider === MESSAGING_PROVIDER.XMTP && 'bg-gray-100'
          }`}
        >
          <img width={16} height={16} className="mx-1" src="/xmtp.svg" alt="xmtp" draggable={false} />
          <Trans>{MESSAGING_PROVIDER.XMTP}</Trans>
        </div>
        <div
          onClick={() => changeProvider(MESSAGING_PROVIDER.PUSH)}
          className={`flex basis-1/2 cursor-pointer items-center justify-center rounded-r-xl py-2.5 transition-all hover:bg-gray-200 ${
            provider === MESSAGING_PROVIDER.PUSH && 'bg-gray-100'
          }`}
        >
          <img width={20} height={20} className="mx-1" src="/push.svg" alt="xmtp" draggable={false} />
          <Trans>{MESSAGING_PROVIDER.PUSH}</Trans>
        </div>
      </Card>

      <div className="flex h-[91.8%] flex-col justify-between">
        {provider === MESSAGING_PROVIDER.XMTP ? (
          <XMTPPreviewList selectedConversationKey={selectedConversationKey} />
        ) : (
          <PushPreviewList selectedConversationKey={selectedConversationKey} />
        )}
      </div>
    </GridItemFour>
  );
};

export default PreviewList;
