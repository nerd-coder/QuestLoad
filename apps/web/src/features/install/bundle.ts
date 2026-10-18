export type Bundle = {
  packageName: string
  apkFile: File
  obbFiles: { file: File; path: string }[]
}

export function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export function basename(path: string) {
  return path.split(/[\\/]/).pop() || path
}

/**
 * A bundle folder holds one APK at its root and one folder of OBB files
 * named after the package.
 */
export function resolveBundle(files: FileList): Bundle {
  const entries = Array.from(files).map((file) => ({
    file,
    path:
      (file.webkitRelativePath || file.name).split('/').slice(1).join('/') ||
      file.name,
  }))
  const apk = entries.find(
    (entry) => entry.path.endsWith('.apk') && !entry.path.includes('/')
  )
  const obbs = entries.filter(
    (entry) => entry.path.endsWith('.obb') && entry.path.includes('/')
  )
  if (!apk || !obbs.length) throw new Error('Invalid bundle layout.')
  return {
    packageName: obbs[0].path.split('/')[0],
    apkFile: apk.file,
    obbFiles: obbs,
  }
}
