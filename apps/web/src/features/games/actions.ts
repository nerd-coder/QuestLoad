import type { QueryClient } from '@tanstack/react-query'
import { errorText, log } from '../activity'

type GameSourceConfig = { url: string; password: string }

async function fetchGames(): Promise<unknown> {
  const configResponse = await fetch('/games-source.json', {
    cache: 'no-store',
  })
  if (!configResponse.ok) throw new Error('Unable to load /games-source.json')
  const config = (await configResponse.json()) as GameSourceConfig
  if (typeof config.url !== 'string' || typeof config.password !== 'string') {
    throw new Error(
      '/games-source.json must include string values for url and password'
    )
  }
  const response = await fetch(config.url, {
    headers: { 'x-api-password': config.password },
  })
  if (!response.ok)
    throw new Error(`Unable to fetch games. Status: ${response.status}`)
  return response.json()
}

export const gamesQuery = {
  queryKey: ['games'],
  queryFn: fetchGames,
  retry: 3,
} as const

/** Loads the remote games source once at startup and reports it. */
export async function loadGames(queryClient: QueryClient) {
  try {
    const games = await queryClient.fetchQuery(gamesQuery)
    log(
      'info',
      Array.isArray(games)
        ? `Loaded ${games.length} games from the games source`
        : 'Loaded the games source'
    )
  } catch (error) {
    log('warning', `Games source unavailable: ${errorText(error)}`)
  }
}
