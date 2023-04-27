import { chat, chats } from '@components/utils/hooks/push/data';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function PUSHPreviewChats({ selectedConversationKey }: { selectedConversationKey: string }) {
  const router = useRouter();
  const [allChats, setAllChat] = useState<String[]>([]);

  const clickChat = (key: string) => {
    router.push(`/messages/push/${key}`);
  };

  useEffect(() => {
    // const chats = useFetchChats()
    // todo once we have the type of chats, replace it with 'any' here
    const userChats = [...chats].map((oneChat: any) => {
      // populate the latest chat for this conversation
      // const response = useFetchChat()
      oneChat.chat = chat;
      return oneChat;
    });
    setAllChat(userChats);
  }, []);

  return (
    <section className="flex flex-col	gap-2.5	">
      {/* todo change the type here from 'any' to another typw */}
      {allChats.map((oneChat: any, number: number) => (
        <div
          key={number}
          className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
            selectedConversationKey === oneChat.id && 'bg-violet-100'
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
  );
}
