import { Store } from '@tanstack/store'

export type DeviceStatus =
  | 'disconnected'
  | 'connecting'
  | 'authorizing'
  | 'connected'

export type DeviceState = { status: DeviceStatus; model: string | null }

export const deviceStore = new Store<DeviceState>({
  status: 'disconnected',
  model: null,
})

export function setDevice(update: Partial<DeviceState>) {
  deviceStore.setState((state) => ({ ...state, ...update }))
}
