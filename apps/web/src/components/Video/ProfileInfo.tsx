import React, { useCallback, useEffect, useState } from 'react'
import { usePushChatStore } from 'src/store/push-chat'
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles'
import { getProfileFromDID } from '@components/Messages/Push/helper'
import { Profile } from 'lens'
import { Image } from 'ui'
import getAvatar from 'lib/getAvatar'
import formatHandle from 'lib/formatHandle'
import Slug from '@components/Shared/Slug'

const ProfileInfo = () => {
  const [Yoooprofile, setYoooprofile] = useState<Profile[]>([])
  const selectedChatid = usePushChatStore((state) => state.selectedChatId)
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);

  const getLensProfile = async () => {
    const something = getProfileFromDID(selectedChatid);
    const lesnter = lensProfiles.get(something);
    setYoooprofile(lesnter ? [lesnter] : []);
  }

  console.log(Yoooprofile)

  useEffect(() => {
    console.log("YOoo")
    getLensProfile();
  }, [])

  return (
    <div>
      <div>
        {Yoooprofile.map((profile) => (
          <div key={profile.id}>
            <div className="sm:static md:static absolute left-0 right-0 m-auto top-16 flex flex-row items-center justify-center mb-2">
              <Image src={getAvatar(profile)} className='mr-3 h-12 rounded-full' alt={formatHandle(profile?.handle)} />
              <div className='flex flex-col'>
                {profile?.name ?? formatHandle(profile?.handle)}
              <Slug
                className="text-sm"
                slug={formatHandle(profile?.handle)}
                prefix="@"
              />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileInfo
