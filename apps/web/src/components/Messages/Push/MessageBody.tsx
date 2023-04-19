import React from 'react';
import { Input } from 'ui';

export default function MessageBody() {
  return (
    <section className="h-full	p-5 pb-3">
      <div className="h-[85%] max-h-[85%] overflow-scroll">
        {['yesterday', 'today'].map((date) => (
          <section key={date} className="mb-6 mt-2">
            <p className="mb-4 text-center text-sm text-gray-400">{date}</p>
            <div className="flex flex-col gap-2.5">
              <div className="relative w-fit max-w-[80%] rounded-xl rounded-tl-sm border py-3 pl-4 pr-9 font-medium">
                <p className="text-sm	">Lenster is on 🔥</p>
                <span className="absolute bottom-1.5	right-1.5 text-xs text-gray-500">8:20</span>
              </div>
              <div className="relative w-fit max-w-[80%] rounded-xl rounded-tl-sm border py-3 pl-4 pr-9 font-medium">
                <p className="text-sm	">
                  The Lenster team is doing some really innovative work, I'm excited to see what new features
                  they'll roll out next.
                </p>
                <span className="absolute bottom-1.5	right-1.5 text-xs text-gray-500">8:25</span>
              </div>
              <div className="relative w-fit	max-w-[80%] self-end rounded-xl rounded-tr-sm border bg-violet-500 py-3 pl-4 pr-9 font-medium">
                <p className="text-sm	text-white">Group chats, video calls... I wonder what’s next</p>
                <span className="absolute bottom-1.5	right-1.5 text-xs text-white">8:25</span>
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="relative mt-2">
        <img className="absolute left-2 top-2.5 cursor-pointer" src="/push/emoji.svg" alt="" />
        <div className="absolute right-4 top-2 flex items-center gap-5">
          <img className="relative cursor-pointer" src="/push/gif.svg" alt="gif" />
          <img className="relative cursor-pointer" src="/push/send.svg" alt="send" />
        </div>
        <Input className="pl-11" type="text" placeholder="Type your message..." />
      </div>
    </section>
  );
}
