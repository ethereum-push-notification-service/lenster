import React from 'react';
import { Image } from 'ui';

const CallButton = () => {
  return (
    <div className="bottom-8 gap-2 mt-2 left-0 right-0 m-auto flex flex-row items-center justify-center sm:static md:static">
      <Image
        src="/push/videobtn.svg"
        className="bg-white p-3 border-[#D4D4D8] border w-[48px] h-[48px] rounded-[10px]"
        alt="call"
      />
      <Image src="/push/micbtn.svg" className="bg-white w-[48px] h-[48px] p-3 border-[#D4D4D8] border rounded-[10px]" alt="call" />
      <Image
        src="/push/callendbtn.svg"
        className="py-[12px] px-[28px] w-[80px] h-[48px] bg-[red] rounded-[10px]"
        alt="call"
      />
    </div>
  );
};

export default CallButton;
