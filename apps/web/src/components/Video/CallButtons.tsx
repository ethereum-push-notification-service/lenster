import React from 'react'
import { Image } from 'ui'

const CallButtons = () => {
  return (
    // absolute left-0 right-0 m-auto
    <div className='sm:relative left-0 right-0 m-auto md:relative absolute flex flex-row items-center justify-center md:mt-[-40px] sm:mt-[-40px] mt-[-110px] mb-[-50px]'>
        <Image src="/push/videobtn.svg" className='h-[150px] mr-[-100px]' alt="call" />
        <Image src="/push/micbtn.svg" className='h-[150px] ml-0' alt="call" />
        <Image src="/push/callendbtn.svg" className='h-[150px] ml-[-100px]' alt="call" />
    </div>
  )
}

export default CallButtons