import { Store } from '@tanstack/store'

export type AppState = {
  apk: File | null
  bundle: FileList | null
  busy: boolean
  connected: boolean
  logs: string[]
  progress: number
  view: 'installer' | 'extractor'
}

export const appStore = new Store<AppState>({
  apk: null,
  bundle: null,
  busy: false,
  connected: false,
  logs: ['Ready.'],
  progress: 0,
  view: 'installer',
})

export function setAppState(update: Partial<AppState>) {
  appStore.setState((state) => ({ ...state, ...update }))
}
export function logMessage(message: string) {
  appStore.setState((state) => ({ ...state, logs: [...state.logs, message] }))
}
