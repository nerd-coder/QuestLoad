import { Badge } from '@questload/ui/components/badge'
import { Button } from '@questload/ui/components/button'
import { LogoLoader } from '@questload/ui/components/logo'
import { useStore } from '@tanstack/react-store'
import { CheckIcon, PlugIcon, UsbIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { connectQuest, disconnectQuest } from './actions'
import { deviceStore, type DeviceStatus as Status } from './store'

type View = { title: string; detail: string; badge: ReactNode | null }

function describe(status: Status, model: string | null): View {
  switch (status) {
    case 'disconnected':
      return {
        title: 'No headset connected',
        detail: 'Plug your Quest into this computer with a USB-C cable.',
        badge: null,
      }
    case 'connecting':
      return {
        title: 'Choose your Quest',
        detail: 'Pick it in the list your browser opened.',
        badge: <Badge variant="secondary">Connecting</Badge>,
      }
    case 'authorizing':
      return {
        title: 'Quest found',
        detail: 'Put on your headset and select Allow.',
        badge: (
          <Badge variant="warning">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-warning"
            />
            Waiting for headset
          </Badge>
        ),
      }
    case 'connected':
      return {
        title: model ?? 'Quest',
        detail: 'Ready to install over USB.',
        badge: (
          <Badge variant="success">
            <CheckIcon />
            Connected
          </Badge>
        ),
      }
  }
}

/** Names the headset's state and the next physical step. */
export function DeviceStatus({ locked }: { locked: boolean }) {
  const { status, model } = useStore(deviceStore, (state) => state)
  const view = describe(status, model)
  const waiting = status === 'connecting' || status === 'authorizing'

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-muted p-4 ring-1 ring-border">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary">
        {waiting ? (
          <LogoLoader height="0.9rem" label={null} />
        ) : (
          <UsbIcon aria-hidden="true" className="size-5" />
        )}
      </span>
      <div role="status" className="min-w-0 flex-1">
        <p className="font-semibold">{view.title}</p>
        <p className="text-sm text-muted-foreground">{view.detail}</p>
      </div>
      <div className="flex w-full items-center gap-3 pl-15 sm:w-auto sm:pl-0">
        {view.badge}
        {status === 'disconnected' && (
          <Button onClick={() => void connectQuest()}>
            <PlugIcon data-icon="inline-start" />
            Connect Quest
          </Button>
        )}
        {status === 'connected' && (
          <Button
            variant="outline"
            disabled={locked}
            onClick={() => void disconnectQuest()}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  )
}
