import { Modal, Image } from "ui";
import { useRef, useState } from "react";
import useOnClickOutside from "../useOnClickOutside";
import Video from "@components/Video/Video";
import type { Profile } from 'lens';
import ProfileInfo from "@components/Video/ProfileInfo";
import CallButtons from "@components/Video/CallButtons";

const usePushoutgoingCall = () => {
    const [showCallmodal, setShowcallModal] = useState(false);

    const openModal = () => {
        setShowcallModal(true);
    };

    const closeModal = () => {
        setShowcallModal(false);
    };

    const CallModal = () => {
        const downRef = useRef(null);
        const handleCloseall = () => {
            if (showCallmodal) {
                setShowcallModal(false);
            }
        }
        useOnClickOutside(downRef, handleCloseall)
        return (
            <div>
                <Modal size="md" show={showCallmodal}>
                    <div ref={downRef} className="my-4">
                        <span className="sm:static md:static absolute left-0 right-0 m-auto top-5 flex items-center justify-center">
                            <div className="mb-2 bg-[#F4F4F5] p-2 rounded-lg flex items-center">
                                <Image className="mr-2" src="/push/lock.svg" alt="lock" />
                                <span className="text-[#9E9EA9] text-[13px]">End-to-end encrypted</span>
                            </div>
                        </span>
                        <div className="mt-2">
                            <ProfileInfo />
                        </div>
                        <span className="mt-2 sm:static md:static absolute left-0 right-0 m-auto top-32 text-[15px] flex items-center justify-center mb-2">
                            Calling...
                        </span>
                        <div>
                            <Video />
                        </div>
                        <div>
                            <CallButtons />
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
        showCallmodal,
    };
};

export default usePushoutgoingCall;
