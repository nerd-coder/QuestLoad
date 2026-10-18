import { pushFileStream, shell } from '@questload/adb-client'
import { formatBytes, plural } from '../../lib/format'
import { errorText, log } from '../activity'
import { deviceStore } from '../device'
import { type Bundle, basename, resolveBundle, sanitize } from './bundle'
import { installStore, type Selection, setInstall } from './store'

const fresh = { rejected: null, phase: 'idle', label: '', progress: 0 } as const

export function selectApk(file: File | null | undefined) {
  if (file) setInstall({ ...fresh, selection: { kind: 'apk', file } })
}

export function selectBundle(files: FileList | null) {
  if (!files?.length) return
  let bundle: Bundle | null = null
  try {
    bundle = resolveBundle(files)
  } catch {}
  const all = Array.from(files)
  setInstall({
    ...fresh,
    selection: {
      kind: 'bundle',
      folder: all[0].webkitRelativePath.split('/')[0] || all[0].name,
      bundle,
    },
  })
}

/** Accepts a dropped file when it is an APK. */
export function dropApk(files: FileList) {
  const file = files[0]
  if (!file) return
  if (file.name.toLowerCase().endsWith('.apk')) selectApk(file)
  else setInstall({ rejected: file.name })
}

export function selectionName(selection: Selection) {
  return selection.kind === 'apk'
    ? selection.file.name.replace(/\.apk$/i, '')
    : selection.folder
}

/** Copies an APK, installs it, and maps its progress into [start, end]. */
async function installApk(file: File, start: number, end: number) {
  const remote = `/data/local/tmp/${Date.now()}_${sanitize(file.name)}`
  const copyEnd = start + (end - start) * 0.9
  try {
    setInstall({ label: `Copying ${file.name}`, progress: start })
    log('info', `Copying ${file.name} (${formatBytes(file.size)})`)
    await pushFileStream(remote, file, (sent, total) =>
      setInstall({ progress: start + (copyEnd - start) * (sent / total) })
    )
    setInstall({ label: `Installing ${file.name}`, progress: copyEnd })
    log('info', `Installing ${file.name}`)
    const output = await shell(['pm', 'install', '-r', remote])
    if (!output.toLowerCase().includes('success')) {
      throw new Error(`The Quest refused the install: ${output.trim()}`)
    }
    setInstall({ progress: end })
  } finally {
    // A lost connection fails this too; keep the original error.
    await shell(['rm', '-f', remote]).catch(() => undefined)
  }
}

/** Progress is weighted by bytes, so big OBB files move the bar most. */
async function installBundle(bundle: Bundle) {
  const obbBytes = bundle.obbFiles.reduce((sum, obb) => sum + obb.file.size, 0)
  const total = bundle.apkFile.size + obbBytes || 1
  await installApk(bundle.apkFile, 0, (bundle.apkFile.size / total) * 100)

  const remoteDir = `/sdcard/Android/obb/${bundle.packageName}`
  await shell(['rm', '-rf', remoteDir])
  await shell(['mkdir', '-p', remoteDir])
  let copied = bundle.apkFile.size
  for (const [index, obb] of bundle.obbFiles.entries()) {
    const name = basename(obb.path)
    setInstall({
      label: `Copying OBB ${index + 1} of ${bundle.obbFiles.length}`,
    })
    log('info', `Copying ${name} (${formatBytes(obb.file.size)})`)
    await pushFileStream(`${remoteDir}/${name}`, obb.file, (sent) =>
      setInstall({ progress: ((copied + sent) / total) * 100 })
    )
    copied += obb.file.size
  }
}

export async function installSelection() {
  const { selection, phase } = installStore.state
  if (!selection || phase === 'running') return
  if (deviceStore.state.status !== 'connected') return
  if (selection.kind === 'bundle' && !selection.bundle) return

  const name = selectionName(selection)
  setInstall({ phase: 'running', label: 'Starting', progress: 0 })
  try {
    if (selection.kind === 'apk') await installApk(selection.file, 0, 100)
    else if (selection.bundle) await installBundle(selection.bundle)
    setInstall({ phase: 'done', label: `Installed ${name}`, progress: 100 })
    log('success', `Installed ${name}`)
  } catch (error) {
    setInstall({ phase: 'failed', label: errorText(error) })
    log('error', errorText(error))
  }
}

export function describeBundle(bundle: Bundle) {
  const size = bundle.obbFiles.reduce(
    (sum, obb) => sum + obb.file.size,
    bundle.apkFile.size
  )
  return `1 APK, ${plural(bundle.obbFiles.length, 'OBB file')}, ${formatBytes(size)}`
}
