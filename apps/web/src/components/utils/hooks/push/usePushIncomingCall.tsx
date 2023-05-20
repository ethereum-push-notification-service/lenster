import CallButton from '@components/Messages/Push/Video/CallButton';
import MediaToggleButton from '@components/Messages/Push/Video/MediaToggleButton';
import ProfileInfo from '@components/Messages/Push/Video/ProfileInfo';
import Video from '@components/Messages/Push/Video/Video';
import { useRef, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { Modal } from 'ui';

import useOnClickOutside from '../useOnClickOutside';

const usePushIncomingCall = () => {
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);

  const openIncomingCallModal = () => {
    setShowIncomingCallModal(true);
  };

  const closeIncomingCallModal = () => {
    setShowIncomingCallModal(false);
  };

  const IncomingCallModal = () => {
    const downRef = useRef(null);
    const [incomingCallUserData, setIncomingCallUserData] = useState(null);
    const [isIncomingCallMinimized, setIsIncomingCallMinimized] = useState(false);

    useOnClickOutside(downRef, () => closeIncomingCallModal());

    const handleCloseall = () => {
      if (showIncomingCallModal) {
        setShowIncomingCallModal(false);
      }
    };

    const minimizeCallHandler = () => {
      setIsIncomingCallMinimized(true);
    };

    return (
      <div>
        {isIncomingCallMinimized ? (
          <div className="absolute bottom-[15%] left-0 right-0 z-50 ml-auto mr-auto box-border w-11/12 rounded-[24px] bg-[#F4F4F5] md:bottom-[13%] md:left-[62%] md:m-0 md:ml-1 md:mr-1 md:w-fit md:w-fit">
            <div className="flex flex-row items-center gap-8 p-4">
              <div className="">
                <ProfileInfo status={'Incoming Video Call'} removeSlug={true} />
              </div>

              <div className="flex flex-row items-center justify-center gap-4">
                <MediaToggleButton
                  buttonStyles="py-[12px] px-[18px] w-[60px] h-[48px] bg-[#30CC8B] rounded-[16px]"
                  iconSrc={'/push/whitevideobtn.svg'}
                  onClick={() => {
                    console.log('one');
                  }}
                />
                <CallButton
                  buttonStyles="py-[12px] px-[16px] w-[55px] h-[48px] bg-[red] rounded-[16px]"
                  iconSrc={'/push/callendbtn.svg'}
                  onClick={() => {
                    console.log('one');
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <Modal size="sm" show={showIncomingCallModal}>
            <div ref={downRef} className="my-4 px-6">
              <div className="mt-8 flex w-full justify-end">
                <MdExpandMore
                  size={30}
                  color={'#82828A'}
                  className="mr-0 cursor-pointer"
                  onClick={minimizeCallHandler}
                />
              </div>
              <div className="mt-4 w-fit sm:justify-start">
                <ProfileInfo status={'Incoming Video Call'} />
              </div>
              <div>
                <Video />
              </div>
              <div className="flex w-full flex-row items-center justify-center gap-4">
                <MediaToggleButton
                  buttonStyles="py-[12px] px-[28px] w-[80px] h-[48px] bg-[#30CC8B] rounded-[16px]"
                  iconSrc={'/push/whitevideobtn.svg'}
                  onClick={() => {
                    console.log('one');
                  }}
                />
                <CallButton
                  buttonStyles="py-[12px] px-[22px] w-[70px] h-[48px] bg-[red] rounded-[16px]"
                  iconSrc={'/push/callendbtn.svg'}
                  onClick={() => {
                    console.log('one');
                  }}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  return {
    openIncomingCallModal,
    closeIncomingCallModal,
    IncomingCallModal,
    showIncomingCallModal
  };
};

export default usePushIncomingCall;
