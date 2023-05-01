// import useGroupByName from '@components/utils/hooks/push/getGroupByName';
import UserProfile from '@components/Shared/UserProfile';
// import { GroupDTO } from '@pushprotocol/restapi';
import useFetchChats from '@components/utils/hooks/push/useFetchChats';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Profile, ProfileSearchResult } from 'lens';
import { CustomFiltersTypes, SearchRequestTypes, useSearchProfilesLazyQuery } from 'lens';
import formatHandle from 'lib/formatHandle';
import { useRouter } from 'next/router';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Card, Input, Spinner } from 'ui';

interface SearchProps {
  hideDropdown?: boolean;
  onProfileSelected?: (profile: Profile) => void;
  placeholder?: string;
  modalWidthClassName?: string;
}

const Search: FC<SearchProps> = ({
  hideDropdown = false,
  onProfileSelected,
  placeholder = t`Search…`,
  modalWidthClassName = 'max-w-md'
}) => {
  const { push, pathname, query } = useRouter();
  const [searchText, setSearchText] = useState('');
  const activeTab = usePushChatStore((state) => state.activeTabNumber);
  const setActiveTab = usePushChatStore((state) => state.setActiveTabNumber);
  const [feed, setFeed] = useState<any[]>([]);
  const dropdownRef = useRef(null);
  // const {fetchGroupByName, loading, error} = useGroupByName({ name });
  const { fetchChats, error, loading } = useFetchChats();

  useOnClickOutside(dropdownRef, () => setSearchText(''));

  const getChat = useCallback(async () => {
    const chatfeed = await fetchChats();
    if (chatfeed) {
      const newFeed = [...feed]; // create a copy of the current feed array
      for (const [key, value] of chatfeed) {
        const extract = value.intentSentBy;
        const segments = extract ? extract.split(':') : null;
        const lensAddress = segments ? segments[3] : null;
        console.log(lensAddress, 'lensAddress');
        newFeed.push(lensAddress); // add the new lensAddress to the newFeed array
      }
      setFeed(newFeed); // update the feed state with the new array
    }
  }, [fetchChats, feed]);

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] = useSearchProfilesLazyQuery();
  // const [searchGroups, { data: searchGroupsData, loading: searchGroupsLoading }] = useSearchProfilesLazyQuery();

  const segments = searchText.split(' ');
  const lensAddress = segments[segments.length - 1];
  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    getChat();
    setSearchText(keyword);
    if (pathname !== '/search' && !hideDropdown) {
      searchUsers({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query: keyword,
            customFilters: [CustomFiltersTypes.Gardeners],
            limit: 8
          }
        }
      });
      // ToDo
      // fetchGroupByName({ name: keyword });
    }
  };

  useEffect(() => {
    if (activeTab === 2) {
      setActiveTab(1);
    }
  }, []);

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log(feed, 'feed');
    if (!feed.includes(lensAddress) && searchText.length > 0) {
      setActiveTab(2);
    } else {
      setActiveTab(1);
    }
    if (pathname === '/search') {
      push(`/search?q=${encodeURIComponent(searchText)}&type=${query.type}`);
    } else {
      push(`/search?q=${encodeURIComponent(searchText)}&type=profiles`);
    }
    setSearchText('');
  };

  const searchResult = searchUsersData?.search as ProfileSearchResult;
  const isProfileSearchResult = searchResult && searchResult.hasOwnProperty('items');
  const profiles = isProfileSearchResult ? searchResult.items : [];
  // const groupsResult = searchGroupsData?.search;
  // const isGroupSearchResult = groupsResult && groupsResult.hasOwnProperty('items');
  // const groups = isGroupSearchResult ? groupsResult : [];
  // console.log(groups)

  return (
    <div aria-hidden="true" className="w-full" data-testid="global-search">
      <form onSubmit={handleKeyDown}>
        <Input
          type="text"
          className="px-3 py-2 text-sm"
          placeholder={placeholder}
          value={searchText}
          iconLeft={<SearchIcon />}
          iconRight={
            <XIcon
              className={clsx('cursor-pointer', searchText ? 'visible' : 'invisible')}
              onClick={() => setSearchText('')}
            />
          }
          onChange={handleSearch}
        />
      </form>
      {pathname !== '/search' && !hideDropdown && searchText.length > 0 && (
        <div
          className={clsx('absolute mt-2 flex w-[94%] flex-col', modalWidthClassName)}
          ref={dropdownRef}
          data-testid="search-profiles-dropdown"
        >
          <Card className="max-h-[80vh] overflow-y-auto py-2">
            {searchUsersLoading ? (
              <div className="space-y-2 px-4 py-2 text-center text-sm font-bold">
                <Spinner size="sm" className="mx-auto" />
                <div>
                  <Trans>Searching users</Trans>
                </div>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <div
                    key={profile?.handle}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      if (onProfileSelected) {
                        onProfileSelected(profile);
                      }
                      setSearchText('');
                    }}
                    data-testid={`search-profile-${formatHandle(profile?.handle)}`}
                  >
                    <UserProfile
                      linkToProfile={!onProfileSelected}
                      profile={profile}
                      showUserPreview={false}
                    />
                  </div>
                ))}
                {/* {groups.map((groups: GroupDTO) => (
                                    <div
                                        key={groups?.chatId}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => {
                                            if (onProfileSelected) {
                                                onProfileSelected(groups);
                                            }
                                            setSearchText('');
                                        }}
                                        data-testid={`search-profile-${formatHandle(profile?.handle)}`}
                                    >
                                        <Card className="max-h-[80vh] overflow-y-auto py-2">
                                            {groups.chatId}
                                        </Card>
                                    </div>
                                ))} */}
                {profiles.length === 0 && (
                  <div className="px-4 py-2">
                    <Trans>No matching users</Trans>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Search;
