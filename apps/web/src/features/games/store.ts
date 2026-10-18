import { Store } from '@tanstack/store'
import { type GameSource, parseSource } from './source'

const KEY = 'questload-games-source'

/** A source saved in this browser, and the link it was read from, if any. */
export type SavedSource = GameSource & { from: string | null }

function load(): SavedSource | null {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (!stored) return null
    const from = typeof stored.from === 'string' ? stored.from : null
    return { ...parseSource(stored), from }
  } catch {
    return null
  }
}

export const gamesStore = new Store<{
  saved: SavedSource | null
  open: boolean
}>({
  saved: load(),
  open: false,
})

export function saveSource(source: GameSource, from: string | null) {
  const saved = { ...source, from }
  localStorage.setItem(KEY, JSON.stringify(saved))
  gamesStore.setState((state) => ({ ...state, saved }))
}

export function forgetSource() {
  localStorage.removeItem(KEY)
  gamesStore.setState((state) => ({ ...state, saved: null }))
}

export function setSourceDialog(open: boolean) {
  gamesStore.setState((state) => ({ ...state, open }))
}
