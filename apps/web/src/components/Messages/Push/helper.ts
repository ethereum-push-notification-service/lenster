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
  var fromNow = moment(timestamp).fromNow();
  const timestampDate = moment(timestamp).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    // nextDay:  '[Tomorrow]',
    nextWeek: 'dddd',
    // when the date is further away, use from-now functionality
    sameElse: function () {
      return '[' + fromNow + ']';
    }
  });
  return timestampDate;
};
