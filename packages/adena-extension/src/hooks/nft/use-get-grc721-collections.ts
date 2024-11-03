import { useAdenaContext } from '@hooks/use-context';
import { useCurrentAccount } from '@hooks/use-current-account';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { GRC721CollectionModel } from '@types';

export const useGetGRC721Collections = (
  options?: UseQueryOptions<GRC721CollectionModel[] | null, Error>,
): UseQueryResult<GRC721CollectionModel[] | null> => {
  const { tokenService } = useAdenaContext();
  const { currentAccount } = useCurrentAccount();

  return useQuery<GRC721CollectionModel[] | null, Error>({
    queryKey: ['nft/useGetGRC721Collections', currentAccount?.id || ''],
    queryFn: () => {
      if (!currentAccount) {
        return null;
      }

      return tokenService.getAccountGRC721Collections(currentAccount.id).catch(() => []);
    },
    staleTime: Infinity,
    keepPreviousData: true,
    ...options,
  });
};
