import React from 'react';
import { Image } from 'ui';

type CallButtonProps = {
  buttonStyles: string;
  iconSrc: any;
  onClick: () => void;
};

// accept or reject on and off
const CallButton = ({ buttonStyles, iconSrc, onClick }: CallButtonProps) => {
  return (
    <div className="" onClick={onClick}>
      <Image src={iconSrc} className={buttonStyles} alt="call" />

      {/* <Image
        src="/push/videobtn.svg"
        className="bg-white p-3 border-[#D4D4D8] border w-[48px] h-[48px] rounded-[10px]"
        alt="call"
      />
      <Image src="/push/micbtn.svg" className="bg-white w-[48px] h-[48px] p-3 border-[#D4D4D8] border rounded-[10px]" alt="call" />
      <Image
        src="/push/callendbtn.svg"
        className="py-[12px] px-[28px] w-[80px] h-[48px] bg-[red] rounded-[10px]"
        alt="call"
      /> */}
    </div>
  );
};

export default CallButton;
