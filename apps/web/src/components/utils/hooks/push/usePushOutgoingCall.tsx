import ProfileInfo from '@components/Messages/Push/Video/ProfileInfo';
import Video from '@components/Messages/Push/Video/Video';
import { useRef, useState } from 'react';
import { Image, Modal } from 'ui';

const usePushOutgoingCall = () => {
  const [showCallModal, setShowCallModal] = useState(false);

  const openModal = () => {
    setShowCallModal(true);
  };

  const closeModal = () => {
    setShowCallModal(false);
  };

  const CallModal = () => {
    const downRef = useRef(null);
    const handleCloseall = () => {
      if (showCallModal) {
        setShowCallModal(false);
      }
    };
    return (
      <div>
        <Modal size="md" show={showCallModal}>
          <div ref={downRef} className="my-4">
            <span className="absolute left-0 right-0 top-5 m-auto flex items-center justify-center sm:static md:static">
              <div className="mb-2 flex items-center rounded-lg bg-[#F4F4F5] px-2 py-0.5 sm:p-2 md:p-2">
                <Image className="mr-2 h-2 " src="/push/lock.svg" alt="lock" />
                <span className="text-[10px] text-[#9E9EA9] sm:text-[13px] md:text-[15px]">
                  End-to-end encrypted
                </span>
              </div>
            </span>
            <div className="mt-2">
              <ProfileInfo />
            </div>
            <span className="absolute left-0 right-0 top-[105px] m-auto mb-2 mt-2 flex items-center justify-center text-[15px] sm:static md:static">
              Calling...
            </span>
            <div>
              <Video />
            </div>
            {/* check call button component to make changes where neccessary */}
            {/* <div>
              <CallButton />
            </div> */}
          </div>
        </Modal>
      </div>
    );
  };

  return {
    openModal,
    closeModal,
    CallModal,
    showCallModal
  };
};

export default usePushOutgoingCall;
