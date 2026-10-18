import { Button } from '@questload/ui/components/button'
import { LogoLoader } from '@questload/ui/components/logo'
import {
  DownloadIcon,
  FolderOpenIcon,
  PlugIcon,
  RotateCwIcon,
  Trash2Icon,
  UnplugIcon,
} from 'lucide-react'
import { Panel } from '@/components/brand/section'

export function ActionsPanel() {
  return (
    <Panel
      title="Buttons"
      description="One primary per view. Labels say what happens: the verb, then the thing."
    >
      <div className="grid gap-6">
        <Row label="Variants">
          <Button>
            <DownloadIcon data-icon="inline-start" />
            Install APK
          </Button>
          <Button variant="secondary">
            <FolderOpenIcon data-icon="inline-start" />
            Choose folder
          </Button>
          <Button variant="outline">
            <UnplugIcon data-icon="inline-start" />
            Disconnect
          </Button>
          <Button variant="ghost">View log</Button>
          <Button variant="destructive">
            <Trash2Icon data-icon="inline-start" />
            Uninstall
          </Button>
          <Button variant="link">Enable developer mode</Button>
        </Row>
        <Row label="Sizes">
          <Button size="lg">Connect Quest</Button>
          <Button>Connect Quest</Button>
          <Button size="sm">Connect Quest</Button>
          <Button size="xs">Connect Quest</Button>
        </Row>
        <Row label="Icon only">
          <Button size="icon-lg" aria-label="Connect Quest">
            <PlugIcon />
          </Button>
          <Button size="icon" variant="secondary" aria-label="Reinstall">
            <RotateCwIcon />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Disconnect">
            <UnplugIcon />
          </Button>
        </Row>
        <Row label="States">
          <Button disabled aria-busy>
            <LogoLoader height="0.85em" label={null} />
            Installing
          </Button>
          <Button disabled variant="secondary">
            Install APK
          </Button>
        </Row>
      </div>
    </Panel>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[7rem_1fr] md:items-start">
      <p className="text-sm text-muted-foreground md:pt-3">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}
