import { useStore } from '@tanstack/react-store'
import { ActivityLog } from '../activity'
import { DeviceStatus, deviceStore } from '../device'
import { InstallAction } from './install-action'
import { SourcePicker } from './source-picker'
import { Step, type StepState } from './step'
import { installStore } from './store'

export function InstallerView() {
  const connected = useStore(
    deviceStore,
    (state) => state.status === 'connected'
  )
  const { selection, phase } = useStore(installStore, (state) => state)
  const chosen = Boolean(
    selection && (selection.kind === 'apk' || selection.bundle)
  )
  const running = phase === 'running'

  const choose: StepState = chosen ? 'done' : connected ? 'current' : 'next'
  const install: StepState =
    phase === 'done' ? 'done' : connected && chosen ? 'current' : 'next'

  return (
    <div className="spawn">
      <div className="glass overflow-hidden rounded-3xl shadow-xl ring-1 ring-border">
        <ol className="divide-y">
          <Step
            n={1}
            state={connected ? 'done' : 'current'}
            title="Connect your Quest"
          >
            <DeviceStatus locked={running} />
          </Step>
          <Step n={2} state={choose} title="Choose what to install">
            <SourcePicker locked={running} />
          </Step>
          <Step n={3} state={install} title="Install">
            <InstallAction connected={connected} />
          </Step>
        </ol>
        <div className="border-t px-5 py-6 sm:px-8">
          <ActivityLog />
        </div>
      </div>
    </div>
  )
}
