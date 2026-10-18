import { Badge } from '@questload/ui/components/badge'
import { Button } from '@questload/ui/components/button'
import { CheckIcon, PlugIcon, UsbIcon } from 'lucide-react'

const states = [
  {
    badge: <Badge variant="secondary">Not connected</Badge>,
    title: 'No headset',
    detail: 'Plug in your Quest with a USB-C cable.',
    action: (
      <Button size="sm">
        <PlugIcon data-icon="inline-start" />
        Connect Quest
      </Button>
    ),
  },
  {
    badge: <Badge variant="warning">Waiting for headset</Badge>,
    title: 'Quest found',
    detail: 'Put on your headset and select Allow.',
    action: null,
  },
  {
    badge: (
      <Badge variant="success">
        <CheckIcon />
        Connected
      </Badge>
    ),
    title: 'Quest 3',
    detail: 'Ready to install over USB.',
    action: (
      <Button size="sm" variant="outline">
        Disconnect
      </Button>
    ),
  },
]

export function DeviceStatus() {
  return (
    <ul className="grid gap-3">
      {states.map((state) => (
        <li
          key={state.title}
          className="flex flex-wrap items-center gap-4 rounded-xl bg-muted p-4 ring-1 ring-border"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary">
            <UsbIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{state.title}</p>
            <p className="text-sm text-muted-foreground">{state.detail}</p>
          </div>
          <div className="flex w-full items-center gap-3 pl-15 sm:w-auto sm:pl-0">
            {state.badge}
            {state.action}
          </div>
        </li>
      ))}
    </ul>
  )
}
