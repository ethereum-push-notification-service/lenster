import React from 'react'
import Video from './Video'
import { Image } from 'ui'

const OngoingCall = () => {
    return (
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
            <Video />
        </div>
    )
}

export default OngoingCall