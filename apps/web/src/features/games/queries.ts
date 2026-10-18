import { queryOptions } from '@tanstack/react-query'
import { fetchGames, type GameSource, parseSource } from './source'

/** This site's default source: public/games-source.json, if it ships one. */
export const defaultSourceQuery = queryOptions({
  queryKey: ['games-source', 'default'],
  queryFn: async (): Promise<GameSource | null> => {
    const response = await fetch('/games-source.json', { cache: 'no-store' })
    if (!response.ok) return null
    try {
      return parseSource(await response.json())
    } catch {
      return null
    }
  },
  staleTime: Number.POSITIVE_INFINITY,
})

export const gamesQuery = (source: GameSource) =>
  queryOptions({
    queryKey: ['games', source.url, source.password],
    queryFn: () => fetchGames(source),
    staleTime: 5 * 60_000,
    retry: 1,
  })
