import { Store } from '@tanstack/store'
import type { Bundle } from './bundle'

export type Selection =
  | { kind: 'apk'; file: File }
  | {
      kind: 'bundle'
      folder: string
      /** null when the folder isn't laid out as a bundle. */
      bundle: Bundle | null
    }

export type Phase = 'idle' | 'running' | 'done' | 'failed'

export type InstallState = {
  selection: Selection | null
  /** A dropped file that isn't an APK. */
  rejected: string | null
  phase: Phase
  /** What's happening now, or how it ended. */
  label: string
  progress: number
}

export const installStore = new Store<InstallState>({
  selection: null,
  rejected: null,
  phase: 'idle',
  label: '',
  progress: 0,
})

export function setInstall(update: Partial<InstallState>) {
  installStore.setState((state) => ({ ...state, ...update }))
}
