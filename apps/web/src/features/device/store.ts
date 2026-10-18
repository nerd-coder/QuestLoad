import { isWebUsbSupported } from '@questload/adb-client'
import { Store } from '@tanstack/store'

export type DeviceStatus =
  | 'unsupported'
  | 'disconnected'
  | 'connecting'
  | 'authorizing'
  | 'connected'

export type DeviceState = { status: DeviceStatus; model: string | null }

export const deviceStore = new Store<DeviceState>({
  // Without WebUSB (Firefox, Safari, plain http) there is nothing to connect.
  status: isWebUsbSupported() ? 'disconnected' : 'unsupported',
  model: null,
})

export function setDevice(update: Partial<DeviceState>) {
  deviceStore.setState((state) => ({ ...state, ...update }))
}
