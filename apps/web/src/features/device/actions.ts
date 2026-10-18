import {
  connectToDevice,
  disconnect,
  isWebUsbSupported,
  requestDevice,
  shell,
} from '@questload/adb-client'
import { clearActivity, errorText, log } from '../activity'
import { setDevice } from './store'

export async function connectQuest() {
  clearActivity()
  setDevice({ status: 'connecting' })
  try {
    const device = await requestDevice()
    if (!device) {
      setDevice({ status: 'disconnected' })
      return
    }
    await connectToDevice(device, () => {
      setDevice({ status: 'authorizing' })
      log('info', 'Auth pending...')
    })
    const model = (await shell(['getprop', 'ro.product.model'])).trim()
    setDevice({ status: 'connected', model })
    log('success', `Connected: ${model}`)
  } catch (error) {
    setDevice({ status: 'disconnected', model: null })
    log('error', errorText(error))
  }
}

export async function disconnectQuest() {
  await disconnect()
  setDevice({ status: 'disconnected', model: null })
}

/** Follows the cable: unplugging the headset ends the session. */
export function watchUsbDisconnect(): () => void {
  if (!isWebUsbSupported()) return () => {}
  const onDisconnect = () => {
    log('warning', 'USB Disconnected.')
    void disconnectQuest()
  }
  navigator.usb.addEventListener('disconnect', onDisconnect)
  return () => navigator.usb.removeEventListener('disconnect', onDisconnect)
}
