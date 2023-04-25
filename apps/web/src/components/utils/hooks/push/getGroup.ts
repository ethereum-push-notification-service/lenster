import type { GroupDTO } from "@pushprotocol/restapi";
import * as PushAPI from "@pushprotocol/restapi";
import { useCallback, useState } from "react";
import { useAppStore } from "src/store/app";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { IS_MAINNET } from 'data';


interface fetchGroup {
    account: string;
}

const getGroup = () => {

    const [group, setGroup] = useState<GroupDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const currentProfile = useAppStore((state) => state.currentProfile);
    const { ownedBy } = currentProfile || {};
    const fetchGroup = useCallback(async ({ account }: fetchGroup) => {
        setLoading(true);
        try {
            const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.STAGING;
            const fetchGroup = await PushAPI.chat.getGroup({
                chatId: `eip155:${account}`,
                env: PUSH_ENV,
            });
            if (!fetchGroup) {
                return
            }
            setGroup(fetchGroup)
        } catch (error: Error | any) {
            setLoading(false);
            console.log(error)
            setError(error.message)
        }
    },
        [ownedBy]
    );
    return { group, fetchGroup, loading, error };
}

export default getGroup;
