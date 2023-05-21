import React, { useState } from 'react'
import { Image, Card } from 'ui'
import Video from '@components/Messages/Push/Video/Video'
import CallButton from '@components/Messages/Push/Video/CallButton'
import LensHandleTag from '@components/Messages/Push/Video/LensHandleTag'

const useOngoingCall = () => {

    const [showOngoingCall, setShowOngoingCall] = useState(true)

    const OngoingCall = () => {
        const Incomingvideo = () => {
            return (
                <div>
                    <video
                        id="localVideo"
                        className="h-[120px] w-[198px] rounded-2xl bg-white object-cover sm:h-[143px] sm:w-[254px] md:h-[143px] md:w-[254px]"
                        autoPlay
                        muted
                    />
                </div>
            );
        };
        return (
            <div className='flex items-center justify-center'>
                <div className='md:w-[100%] 2xl:max-w-screen-xl grow max-w-[100%] sm:w-[100%] w-[100%]  flex items-center justify-center'>
                    <Card className='w-[100%] sm:w-[90%] md:w-[95%] md:mt-4 sm:mt-4 mt-1'>
                        <div>
                            <div className='pt-4 pb-4'>
                                <span className="mb-2 sm:flex md:flex hidden absolute left-0 right-0 top-5 m-auto flex items-center justify-center sm:static md:static">
                                    <div className="mb-2 flex items-center rounded-lg bg-[#F4F4F5] dark:bg-[#18181B] px-2 py-0.5 sm:p-2 md:p-2">
                                        <Image className="dark:hidden mr-2 h-4" src="/push/lock.svg" alt="lock" />
                                        <Image className="dark:flex hidden mr-2 h-4" src="/push/lockdark.svg" alt="lock" />
                                        <span className="text-[10px] text-[#9E9EA9] dark:text-[#D4D4D8] sm:text-[13px] md:text-[15px]">
                                            End-to-end encrypted
                                        </span>
                                    </div>
                                </span>
                                <div className='relative'>
                                    <Video showOngoingCall={showOngoingCall} videoFramestyles='bg-black h-[66vh] w-[95%] rounded-2xl object-cover sm:block sm:h-[62vh] md:h-[62vh]' />
                                    <div className="absolute bottom-2 right-5 sm:right-10 md:right-10">
                                        <div>
                                            <Incomingvideo />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='py-[3px] px-[8px] bg-[#2E313B] absolute mt-[-60px] text-white rounded-xl sm:ml-10 md:ml-10 ml-6'>
                            <LensHandleTag />
                        </div>
                        <div className='mb-4 cursor-pointer mt-2 flex items-center justify-center gap-2.5'>
                            <CallButton iconSrc={"/push/videobtn.svg"} buttonStyles='bg-white p-3 border-[#D4D4D8] border w-[48px] h-[48px] rounded-[10px]' onClick={() => setShowOngoingCall(false)} />
                            <CallButton iconSrc={"/push/micbtn.svg"} buttonStyles='bg-white w-[48px] h-[48px] p-3 border-[#D4D4D8] border rounded-[10px]' onClick={() => setShowOngoingCall(false)} />
                            <CallButton iconSrc={"/push/callendbtn.svg"} buttonStyles='py-[12px] px-[28px] w-[80px] h-[48px] bg-[red] rounded-[10px]' onClick={() => setShowOngoingCall(false)} />
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    return { OngoingCall, showOngoingCall, setShowOngoingCall }
}

export default useOngoingCall