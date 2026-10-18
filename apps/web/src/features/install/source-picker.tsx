import { useStore } from '@tanstack/react-store'
import { FileDownIcon, FolderOpenIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { formatBytes } from '../../lib/format'
import { describeBundle, dropApk, selectApk, selectBundle } from './actions'
import { SourceTile } from './source-tile'
import { installStore } from './store'

const badBundle =
  'This folder needs one APK at its top level and an OBB folder named after the package.'

/** APK or bundle folder: choosing one replaces the other. */
export function SourcePicker({ locked }: { locked: boolean }) {
  const { selection, rejected } = useStore(installStore, (state) => state)
  const apkInput = useRef<HTMLInputElement>(null)
  const folderInput = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const apk = selection?.kind === 'apk' ? selection : null
  const folder = selection?.kind === 'bundle' ? selection : null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SourceTile
        icon={<FileDownIcon />}
        title={apk ? apk.file.name : 'Drop an APK here'}
        detail={apk ? formatBytes(apk.file.size) : 'Or click to choose one'}
        selected={Boolean(apk)}
        dragging={dragging}
        disabled={locked}
        onPick={() => apkInput.current?.click()}
        onDrop={(event) => dropApk(event.dataTransfer.files)}
        onDragState={setDragging}
      />
      <SourceTile
        icon={<FolderOpenIcon />}
        title={folder ? folder.folder : 'Choose a bundle folder'}
        detail={
          folder
            ? folder.bundle && describeBundle(folder.bundle)
            : 'For games with OBB files'
        }
        error={folder && !folder.bundle ? badBundle : null}
        selected={Boolean(folder)}
        disabled={locked}
        onPick={() => folderInput.current?.click()}
      />
      {rejected && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          {rejected} isn't an APK. Drop an .apk file, or choose a bundle folder
          for games with OBB files.
        </p>
      )}
      <input
        ref={apkInput}
        hidden
        type="file"
        accept=".apk"
        onChange={(event) => {
          selectApk(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      <input
        ref={folderInput}
        hidden
        type="file"
        multiple
        {...{ webkitdirectory: '' }}
        onChange={(event) => {
          selectBundle(event.target.files)
          event.target.value = ''
        }}
      />
    </div>
  )
}
