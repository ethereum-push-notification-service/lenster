import CallButton from '@components/Messages/Push/Video/CallButton';
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
            <span className="absolute left-0 right-0 top-8 m-auto flex items-center justify-center sm:static md:static">
              <div className="mb-2 flex items-center rounded-lg bg-[#F4F4F5] px-2 py-0.5 dark:bg-[#18181B] sm:p-2 md:p-2">
                <Image
                  className="mr-2 flex h-4 dark:hidden"
                  src="/push/lock.svg"
                  alt="lock"
                />
                <Image
                  className="mr-2 hidden h-4 dark:flex"
                  src="/push/lockdark.svg"
                  alt="lock"
                />
                <span className="text-[10px] text-[#9E9EA9] dark:text-white sm:text-[13px] md:text-[15px]">
                  End-to-end encrypted
                </span>
              </div>
            </span>
            <div className="absolute z-50 left-0 right-0 top-16 m-auto mt-2 flex items-center justify-center sm:static sm:flex md:static md:flex">
              <ProfileInfo />
            </div>
            <span className="absolute left-0 right-0 top-[130px] m-auto mb-2 mt-2 flex items-center justify-center text-[15px] sm:static sm:flex md:static md:flex">
              Calling...
            </span>
            <div>
              <Video
                showOngoingCall={false}
                videoFramestyles="bg-black h-[87vh] w-[95%] rounded-2xl object-cover sm:block sm:h-[57vh] md:h-[57vh]"
              />
            </div>
            {/* check call button component to make changes where neccessary */}
            {/* <div>
            </div> */}
            <div className="mb-8 mt-4 flex items-center justify-center gap-2.5">
              <CallButton
                iconSrc={'/push/videobtn.svg'}
                buttonStyles="cursor-pointer bg-white p-3 border-[#D4D4D8] border w-[48px] h-[48px] rounded-[10px]"
                onClick={() => setShowCallModal(false)}
              />
              <CallButton
                iconSrc={'/push/micbtn.svg'}
                buttonStyles="cursor-pointer bg-white w-[48px] h-[48px] p-3 border-[#D4D4D8] border rounded-[10px]"
                onClick={() => setShowCallModal(false)}
              />
              <CallButton
                iconSrc={'/push/callendbtn.svg'}
                buttonStyles="cursor-pointer py-[12px] px-[28px] w-[80px] h-[48px] bg-[red] rounded-[10px]"
                onClick={() => setShowCallModal(false)}
              />
            </div>
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
