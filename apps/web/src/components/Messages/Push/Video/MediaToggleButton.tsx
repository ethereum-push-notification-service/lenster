import React from 'react';
import { Image } from 'ui';

type MediaToggleButtonProps = {
  styles: string;
  iconSrc: any;
  onClick: () => void;
};

const MediaToggleButton = ({
  styles,
  iconSrc,
  onClick
}: MediaToggleButtonProps) => {
  return (
    <button onClick={onClick}>
      <Image
        src={iconSrc}
        className={`h-[48px] w-[48px] cursor-pointer rounded-[10px] border border-[#D4D4D8] p-3 ${styles}`}
        alt="call"
      />
    </button>
  );
};

export default MediaToggleButton;
