import { queryOptions } from '@tanstack/react-query'
import { fetchGames, type SourceInput } from './source'

export const gamesQuery = (source: SourceInput) =>
  queryOptions({
    queryKey: ['games', source.url, source.password],
    queryFn: () => fetchGames(source),
    staleTime: 5 * 60_000,
    retry: 1,
  })
