import { Trans } from '@lingui/macro';
import { type FC, useState } from 'react';
import { Card, Input } from 'ui';

interface PreviewListProps {
  selectedConversationKey?: string;
}
const activeIndex = 1;
const PUSH_TABS = {
  CHATS: 'CHATS',
  REQUESTS: 'REQUESTS'
};
const PUSHPreview: FC<PreviewListProps> = () => {
  const [activeTab, setActiveTab] = useState(PUSH_TABS.REQUESTS);
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
              className={`align-items-center flex w-6/12 cursor-pointer gap-x-1.5 border-b-4 pb-3.5 text-center font-bold ${
                activeTab === PUSH_TABS.REQUESTS
                  ? 'border-b-violet-500'
                  : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Requests</Trans>
              <div className="h-5 w-7 rounded-full bg-violet-500 text-sm text-white">2</div>
            </div>
          </div>

          <div className="flex gap-x-2">
            <Input placeholder="Search name.eth or 0x123..." />
            <div className="cursor-pointer rounded-lg rounded-bl-sm bg-violet-500 p-3">
              <img className="h-4.5 w-4.5" src="/plus.svg" alt="plus icon" />
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
    </div>
  );
};

export default PUSHPreview;
