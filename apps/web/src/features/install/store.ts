import { Store } from '@tanstack/store'

export type InstallState = {
  apk: File | null
  bundle: FileList | null
  installing: boolean
  progress: number
}

export const installStore = new Store<InstallState>({
  apk: null,
  bundle: null,
  installing: false,
  progress: 0,
})

export function setInstall(update: Partial<InstallState>) {
  installStore.setState((state) => ({ ...state, ...update }))
}
