import type { IUser } from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import moment from 'moment';
import { CHAIN_ID } from 'src/constants';

export const getProfileFromDID = (did: string) => {
  return did?.split(':')?.slice(-2, -1)[0];
};

export const getCAIPFromLensID = (id: string) => {
  return `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${id}`;
};

export const isProfileExist = (connectedProfile: IUser | undefined) => {
  if (!connectedProfile || !connectedProfile.publicKey) {
    return false;
  }
  return true;
};

export const dateToFromNowDaily = (timestamp: number): string => {
  const timestampDate = moment(timestamp).calendar(null, {
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextWeek: 'dddd',
    sameElse: 'DD/MM/YYYY'
  });
  return timestampDate;
};
