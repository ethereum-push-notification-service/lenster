import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { IS_MAINNET } from 'data';
import { useCallback, useState } from 'react';
import { useAppStore } from 'src/store/app';
import type { GroupDTO } from '@pushprotocol/restapi';

interface fetchGroup {
  account: string;
}

const useGetGroup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const currentProfile = useAppStore((state) => state.currentProfile);
  const { ownedBy } = currentProfile || {};
  const fetchGroup = useCallback(
    async ({ account }: fetchGroup): Promise<GroupDTO | undefined> => {
      setLoading(true);
      try {
        const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.STAGING;
        const response = await PushAPI.chat.getGroup({
          chatId: `eip155:${account}`,
          env: PUSH_ENV
        });
        if (!response) {
          return;
        }
        return response;
      } catch (error: Error | any) {
        setLoading(false);
        console.log(error);
        setError(error.message);
      }
    },
    [ownedBy]
  );
  return { fetchGroup, loading, error };
};

export default useGetGroup;