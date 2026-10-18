import {
  connectToDevice,
  disconnect,
  isWebUsbSupported,
  requestDevice,
  shell,
} from '@questload/adb-client'
import { clearActivity, errorText, log } from '../activity'
import { setDevice } from './store'

/** Turns WebUSB failures into the step that fixes them. */
function connectError(error: unknown) {
  const text = errorText(error)
  if (/claim|in use|busy/i.test(text)) {
    return 'Another program is using the Quest over USB. Quit adb, SideQuest or Meta Quest Developer Hub, then connect again.'
  }
  return `Couldn't connect: ${text}`
}

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
      log('info', 'Put on your headset and select Allow')
    })
    const model = (await shell(['getprop', 'ro.product.model'])).trim()
    setDevice({ status: 'connected', model: model || 'Quest' })
    log('success', `Connected to ${model || 'your Quest'}`)
  } catch (error) {
    setDevice({ status: 'disconnected', model: null })
    log('error', connectError(error))
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
    log('warning', 'Quest unplugged')
    void disconnectQuest()
  }
  navigator.usb.addEventListener('disconnect', onDisconnect)
  return () => navigator.usb.removeEventListener('disconnect', onDisconnect)
}
