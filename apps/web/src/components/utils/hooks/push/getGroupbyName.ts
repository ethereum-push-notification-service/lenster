import * as PushAPI from "@pushprotocol/restapi";
import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "src/store/app";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { IS_MAINNET } from 'data';
import { GroupDTO } from "@pushprotocol/restapi";

interface GroupByName {
  name: string;
}

const useGroupByName = ({ name }: GroupByName) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [group, setGroup] = useState<GroupDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const fetchGroupByName = useCallback(async ({ name }: { name: string }) => {
    setLoading(true);
    try {
      const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.STAGING;
      const fetchedGroup = await PushAPI.chat.getGroup({
        chatId: `eip155:${name}`,
        env: PUSH_ENV,
      });
      if (!fetchedGroup) {
        return;
      }
      setGroup(fetchedGroup);
    } catch (error: Error | any) {
      setLoading(false);
      console.log(error);
      setError(error.message);
    }
  }, [currentProfile, name]);

  useEffect(() => {
    fetchGroupByName({ name });
  }, [fetchGroupByName, name]);

  return { group, loading, error };
};

export default useGroupByName;
