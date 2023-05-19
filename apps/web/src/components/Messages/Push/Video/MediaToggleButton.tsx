import React from 'react';
import { Image } from 'ui';

type MediaToggleButtonProps = {
  buttonStyles: string;
  iconSrc: any;
  onClick: () => void;
};

// toggle media on and off
const MediaToggleButton = ({ buttonStyles, iconSrc, onClick }: MediaToggleButtonProps) => {
  return (
    <div
      // className=
      onClick={onClick}
    >
      <Image src={iconSrc} className={buttonStyles} alt="call" />
    </div>
  );
};

export default MediaToggleButton;
