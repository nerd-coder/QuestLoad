import { Store } from '@tanstack/store'
import type { SourceInput } from './source'

const KEY = 'questload-games-sources'
// The single saved source from earlier versions, moved into the list on load.
const LEGACY_KEY = 'questload-games-source'

export type GameSource = SourceInput & { id: string; enabled: boolean }

const isSource = (value: unknown): value is GameSource => {
  const s = value as Partial<GameSource> | null
  return (
    typeof s?.id === 'string' &&
    typeof s.url === 'string' &&
    typeof s.password === 'string' &&
    typeof s.enabled === 'boolean'
  )
}

function load(): GameSource[] {
  let sources: GameSource[] = []
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    if (Array.isArray(stored)) sources = stored.filter(isSource)
  } catch {}
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? 'null')
    if (
      typeof legacy?.url === 'string' &&
      typeof legacy.password === 'string'
    ) {
      if (!sources.some((s) => s.url === legacy.url)) {
        sources.push({
          id: crypto.randomUUID(),
          url: legacy.url,
          password: legacy.password,
          enabled: true,
        })
      }
      localStorage.setItem(KEY, JSON.stringify(sources))
    }
    localStorage.removeItem(LEGACY_KEY)
  } catch {}
  return sources
}

export const gamesStore = new Store<{ sources: GameSource[]; open: boolean }>({
  sources: load(),
  open: false,
})

function setSources(update: (sources: GameSource[]) => GameSource[]) {
  gamesStore.setState((state) => {
    const sources = update(state.sources)
    localStorage.setItem(KEY, JSON.stringify(sources))
    return { ...state, sources }
  })
}

export function hasSource(url: string) {
  return gamesStore.state.sources.some((source) => source.url === url)
}

export function addSource(source: SourceInput) {
  setSources((sources) => [
    ...sources,
    { ...source, id: crypto.randomUUID(), enabled: true },
  ])
}

export function setSourceEnabled(id: string, enabled: boolean) {
  setSources((sources) =>
    sources.map((source) =>
      source.id === id ? { ...source, enabled } : source
    )
  )
}

export function removeSource(id: string) {
  setSources((sources) => sources.filter((source) => source.id !== id))
}

export function setSourceDialog(open: boolean) {
  gamesStore.setState((state) => ({ ...state, open }))
}
