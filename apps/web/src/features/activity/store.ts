import { Store } from '@tanstack/store'

export type Tone = 'info' | 'success' | 'warning' | 'error'
export type ActivityEntry = { id: number; tone: Tone; text: string }

export const activityStore = new Store<{ entries: ActivityEntry[] }>({
  entries: [],
})

let nextId = 0

export function log(tone: Tone, text: string) {
  activityStore.setState((state) => ({
    entries: [...state.entries, { id: nextId++, tone, text }],
  }))
}

export function clearActivity() {
  activityStore.setState(() => ({ entries: [] }))
}

export function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
