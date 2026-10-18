import { useStore } from '@tanstack/react-store'
import { type DragEvent, type ReactNode, useRef } from 'react'
import { activityStore, type Tone } from '../activity'
import { connectQuest, deviceStore, disconnectQuest } from '../device'
import {
  dropApk,
  installBundle,
  installSelectedApk,
  selectApk,
  selectBundle,
} from './actions'
import { installStore } from './store'

const prefix: Record<Tone, string> = {
  info: '',
  success: '✅ ',
  warning: '⚠️ ',
  error: '❌ ',
}

export function InstallerView() {
  const device = useStore(deviceStore, (state) => state)
  const install = useStore(installStore, (state) => state)
  const entries = useStore(activityStore, (state) => state.entries)
  const apkInput = useRef<HTMLInputElement>(null)
  const bundleInput = useRef<HTMLInputElement>(null)

  const connected = device.status === 'connected'
  const busy =
    install.installing ||
    device.status === 'connecting' ||
    device.status === 'authorizing'
  const hasSelection = Boolean(install.apk || install.bundle?.length)
  const step = !connected ? 1 : hasSelection ? 3 : 2

  return (
    <section className="card">
      <Step title="1. Connection" active={step === 1}>
        <div className="actions">
          <button
            type="button"
            onClick={() => void connectQuest()}
            disabled={busy || connected}
          >
            Connect Quest
          </button>
          <button
            type="button"
            onClick={() => void disconnectQuest()}
            disabled={!connected || busy}
          >
            Disconnect
          </button>
        </div>
      </Step>
      <Step title="2. Selection" active={step === 2}>
        <div className="grid">
          <Picker
            label={install.apk?.name ?? 'Select APK'}
            detail="Drop .apk here"
            tag="APK"
            onClick={() => apkInput.current?.click()}
            onDrop={(event) => {
              event.preventDefault()
              dropApk(event.dataTransfer.files)
            }}
          />
          <Picker
            label={
              install.bundle?.length
                ? `Folder: ${install.bundle.length} files`
                : 'Select Bundle'
            }
            detail="Folder with APK + OBB"
            tag="FOLDER"
            onClick={() => bundleInput.current?.click()}
          />
        </div>
        <input
          ref={apkInput}
          hidden
          type="file"
          accept=".apk"
          onChange={(event) => selectApk(event.target.files?.[0] ?? null)}
        />
        <input
          ref={bundleInput}
          hidden
          type="file"
          multiple
          {...{ webkitdirectory: '' }}
          onChange={(event) => selectBundle(event.target.files)}
        />
      </Step>
      <Step title="3. Execution" active={step === 3}>
        <div className="actions">
          <button
            type="button"
            onClick={() => void installSelectedApk()}
            disabled={busy || !install.apk}
          >
            Install APK
          </button>
          <button
            type="button"
            onClick={() => void installBundle()}
            disabled={busy || !install.bundle}
          >
            Install Bundle
          </button>
        </div>
      </Step>
      <div className="progress-wrap">
        <div className="progress-head">
          <span>System Status</span>
          <span>{Math.round(install.progress)}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={install.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${install.progress}%` }}
          />
        </div>
        <div className="latest-log">
          {entries.map((entry) => (
            <div key={entry.id}>
              {prefix[entry.tone]}
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Step({
  title,
  active,
  children,
}: {
  title: string
  active: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`section step-section${active ? '' : ' section--disabled'}`}
    >
      <div className="title">{title}</div>
      {children}
    </div>
  )
}

function Picker({
  label,
  detail,
  tag,
  onClick,
  onDrop,
}: {
  label: string
  detail: string
  tag: string
  onClick: () => void
  onDrop?: (event: DragEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      className="picker"
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <div>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
      <div className="tag">{tag}</div>
    </button>
  )
}
