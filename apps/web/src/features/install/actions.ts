import { pushFileStream, shell } from '@questload/adb-client'
import { errorText, log } from '../activity'
import { basename, resolveBundle, sanitize } from './bundle'
import { installStore, setInstall } from './store'

export function selectApk(file: File | null) {
  setInstall({ apk: file })
}

export function selectBundle(files: FileList | null) {
  setInstall({ bundle: files })
}

/** Accepts a dropped file when it is an APK. */
export function dropApk(files: FileList) {
  const file = files[0]
  if (file?.name.toLowerCase().endsWith('.apk')) selectApk(file)
}

async function runTask(task: () => Promise<void>) {
  try {
    setInstall({ installing: true })
    await task()
  } catch (error) {
    log('error', errorText(error))
  } finally {
    setInstall({ installing: false })
  }
}

async function installApk(apk: File, start = 0, end = 100) {
  const remoteApk = `/data/local/tmp/${Date.now()}_${sanitize(apk.name)}`
  try {
    log('info', `Pushing ${apk.name}...`)
    await pushFileStream(remoteApk, apk, (sent, total) =>
      setInstall({ progress: start + 5 + (end - start - 10) * (sent / total) })
    )
    log('info', 'Installing...')
    const output = await shell(['pm', 'install', '-r', remoteApk])
    if (output.toLowerCase().includes('success')) log('success', 'Success')
    else log('warning', output)
  } finally {
    await shell(['rm', '-f', remoteApk])
    setInstall({ progress: end })
  }
}

export async function installSelectedApk() {
  const { apk } = installStore.state
  if (!apk) return
  await runTask(() => installApk(apk))
}

export async function installBundle() {
  const { bundle: files } = installStore.state
  if (!files) return
  await runTask(async () => {
    const bundle = resolveBundle(files)
    await installApk(bundle.apkFile, 0, 50)
    const remoteDir = `/sdcard/Android/obb/${bundle.packageName}`
    await shell(['rm', '-rf', remoteDir])
    await shell(['mkdir', '-p', remoteDir])
    for (const obb of bundle.obbFiles) {
      log('info', `Pushing OBB: ${basename(obb.path)}`)
      await pushFileStream(`${remoteDir}/${basename(obb.path)}`, obb.file)
    }
    setInstall({ progress: 100 })
    log('success', 'Bundle completed. You can safely detach your Quest.')
  })
}
