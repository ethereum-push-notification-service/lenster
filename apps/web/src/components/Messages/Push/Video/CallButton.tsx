import React from 'react';
import { Image } from 'ui';

type CallButtonProps = {
  styles: string;
  iconSrc: any;
  onClick: () => void;
};

// accept or reject on and off
const CallButton = ({ styles, iconSrc, onClick }: CallButtonProps) => {
  return (
    <button className="" onClick={onClick}>
      <Image
        src={iconSrc}
        className={`h-[48px] cursor-pointer rounded-[10px] py-[12px] outline-none focus:outline-none ${styles}`}
        alt="call"
      />
    </button>
  );
};

export default CallButton;
