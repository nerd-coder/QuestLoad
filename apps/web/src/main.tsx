import {
  connectToDevice,
  disconnect,
  isWebUsbSupported,
  pushFileStream,
  requestDevice,
  shell,
} from '@questload/adb-client'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  useEffect,
  useRef,
} from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { appStore, logMessage, setAppState } from './store'

type GameSourceConfig = { url: string; password: string }

async function fetchGames(): Promise<unknown> {
  const configResponse = await fetch('/games-source.json', {
    cache: 'no-store',
  })
  if (!configResponse.ok) throw new Error('Unable to load /games-source.json')
  const config = (await configResponse.json()) as GameSourceConfig
  if (typeof config.url !== 'string' || typeof config.password !== 'string') {
    throw new Error(
      '/games-source.json must include string values for url and password'
    )
  }
  const response = await fetch(config.url, {
    headers: { 'x-api-password': config.password },
  })
  if (!response.ok)
    throw new Error(`Unable to fetch games. Status: ${response.status}`)
  return response.json()
}

function App() {
  const state = useStore(appStore, (value) => value)
  const apkInput = useRef<HTMLInputElement>(null)
  const bundleInput = useRef<HTMLInputElement>(null)
  const games = useQuery({ queryKey: ['games'], queryFn: fetchGames })

  useEffect(() => {
    if (games.isSuccess) {
      const count = Array.isArray(games.data) ? games.data.length : null
      logMessage(
        count === null
          ? '🎮 Games source loaded.'
          : `🎮 Loaded ${count} games from remote source.`
      )
    }
    if (games.isError) logMessage(`❌ ${games.error.message}`)
  }, [games.data, games.isError, games.isSuccess, games.error])

  useEffect(() => {
    if (!isWebUsbSupported()) return
    const handleDisconnect = () => {
      logMessage('⚠️ USB Disconnected.')
      void disconnect().then(() => setAppState({ connected: false }))
    }
    navigator.usb.addEventListener('disconnect', handleDisconnect)
    return () =>
      navigator.usb.removeEventListener('disconnect', handleDisconnect)
  }, [])

  const hasSelection = Boolean(state.apk || state.bundle?.length)
  const step = !state.connected ? 1 : hasSelection ? 3 : 2

  const selectApk = (event: ChangeEvent<HTMLInputElement>) => {
    setAppState({ apk: event.target.files?.[0] ?? null })
  }
  const selectBundle = (event: ChangeEvent<HTMLInputElement>) => {
    setAppState({ bundle: event.target.files })
  }
  const dropApk = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file?.name.toLowerCase().endsWith('.apk')) setAppState({ apk: file })
  }

  const connect = async () => {
    try {
      setAppState({ busy: true, logs: [] })
      const device = await requestDevice()
      if (!device) return
      await connectToDevice(device, () => logMessage('Auth pending...'))
      setAppState({ connected: true })
      logMessage(
        `✅ Connected: ${(await shell(['getprop', 'ro.product.model'])).trim()}`
      )
    } catch (error) {
      logMessage(`❌ ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setAppState({ busy: false })
    }
  }

  const installApk = async (apk: File, start = 0, end = 100) => {
    const remoteApk = `/data/local/tmp/${Date.now()}_${sanitize(apk.name)}`
    try {
      logMessage(`Pushing ${apk.name}...`)
      await pushFileStream(remoteApk, apk, (sent, total) =>
        setAppState({
          progress: start + 5 + (end - start - 10) * (sent / total),
        })
      )
      logMessage('Installing...')
      const output = await shell(['pm', 'install', '-r', remoteApk])
      logMessage(
        output.toLowerCase().includes('success') ? '✅ Success' : `⚠️ ${output}`
      )
    } finally {
      await shell(['rm', '-f', remoteApk])
      setAppState({ progress: end })
    }
  }

  const installSelectedApk = async () => {
    if (!state.apk) return
    await runTask(() => installApk(state.apk as File))
  }

  const installBundle = async () => {
    if (!state.bundle) return
    await runTask(async () => {
      const bundle = resolveBundle(state.bundle as FileList)
      await installApk(bundle.apkFile, 0, 50)
      const remoteDir = `/sdcard/Android/obb/${bundle.packageName}`
      await shell(['rm', '-rf', remoteDir])
      await shell(['mkdir', '-p', remoteDir])
      for (const obb of bundle.obbFiles) {
        logMessage(`Pushing OBB: ${basename(obb.path)}`)
        await pushFileStream(`${remoteDir}/${basename(obb.path)}`, obb.file)
      }
      setAppState({ progress: 100 })
      logMessage('✨ Bundle completed. You can safely detach your Quest.')
    })
  }

  const runTask = async (task: () => Promise<void>) => {
    try {
      setAppState({ busy: true })
      await task()
    } catch (error) {
      logMessage(`❌ ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setAppState({ busy: false })
    }
  }

  return (
    <main className="wrap">
      <h1>QuestLoad</h1>
      <p className="sub">
        Install apps on Meta Quest devices. Developer mode required.{' '}
        <b>By Frizzle.</b>
      </p>
      <nav className="top-nav" aria-label="Primary">
        <div className="top-nav__tabs">
          <button
            className="top-nav__item"
            type="button"
            role="tab"
            aria-selected={state.view === 'installer'}
            onClick={() => setAppState({ view: 'installer' })}
          >
            Installer
          </button>
          <button
            className="top-nav__item"
            type="button"
            role="tab"
            aria-selected={state.view === 'extractor'}
            onClick={() => setAppState({ view: 'extractor' })}
          >
            Extractor
          </button>
        </div>
        <a
          className="top-nav__github"
          href="https://github.com/FrizzleM/QuestLoad"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </nav>
      {state.view === 'extractor' ? (
        <section className="extractor-view">COMING SOON</section>
      ) : (
        <section className="card">
          <Step title="1. Connection" active={step === 1}>
            <div className="actions">
              <button
                type="button"
                onClick={() => void connect()}
                disabled={state.busy || state.connected}
              >
                Connect Quest
              </button>
              <button
                type="button"
                onClick={() =>
                  void disconnect().then(() =>
                    setAppState({ connected: false })
                  )
                }
                disabled={!state.connected || state.busy}
              >
                Disconnect
              </button>
            </div>
          </Step>
          <Step title="2. Selection" active={step === 2}>
            <div className="grid">
              <Picker
                label={state.apk?.name ?? 'Select APK'}
                detail="Drop .apk here"
                tag="APK"
                onClick={() => apkInput.current?.click()}
                onDrop={dropApk}
              />
              <Picker
                label={
                  state.bundle?.length
                    ? `Folder: ${state.bundle.length} files`
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
              onChange={selectApk}
            />
            <input
              ref={bundleInput}
              hidden
              type="file"
              multiple
              {...{ webkitdirectory: '' }}
              onChange={selectBundle}
            />
          </Step>
          <Step title="3. Execution" active={step === 3}>
            <div className="actions">
              <button
                type="button"
                onClick={() => void installSelectedApk()}
                disabled={state.busy || !state.apk}
              >
                Install APK
              </button>
              <button
                type="button"
                onClick={() => void installBundle()}
                disabled={state.busy || !state.bundle}
              >
                Install Bundle
              </button>
            </div>
          </Step>
          <div className="progress-wrap">
            <div className="progress-head">
              <span>System Status</span>
              <span>{Math.round(state.progress)}%</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={state.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <div className="latest-log">
              {state.logs.map((message) => (
                <div key={message}>{message}</div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
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

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}
function basename(path: string) {
  return path.split(/[\\/]/).pop() || path
}
function resolveBundle(files: FileList) {
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

const queryClient = new QueryClient()
createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
