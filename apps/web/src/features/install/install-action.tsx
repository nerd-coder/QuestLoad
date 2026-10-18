import { Button } from '@questload/ui/components/button'
import { LogoLoader } from '@questload/ui/components/logo'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@questload/ui/components/progress'
import { cn } from '@questload/ui/lib/utils'
import { useStore } from '@tanstack/react-store'
import { CheckIcon, CircleAlertIcon, DownloadIcon } from 'lucide-react'
import { installSelection } from './actions'
import { installStore } from './store'

function hint(connected: boolean, chosen: boolean) {
  if (!connected && !chosen)
    return 'Connect your Quest and choose what to install.'
  if (!connected) return 'Connect your Quest to install.'
  if (!chosen) return 'Choose an APK or a bundle folder.'
  return null
}

export function InstallAction({ connected }: { connected: boolean }) {
  const { selection, phase, label, progress } = useStore(
    installStore,
    (state) => state
  )
  const chosen = Boolean(
    selection && (selection.kind === 'apk' || selection.bundle)
  )
  const running = phase === 'running'
  const note = hint(connected, chosen)

  return (
    <div className="grid gap-5">
      {phase !== 'idle' && (
        <div className="grid gap-2">
          <Progress value={progress}>
            <ProgressLabel
              className={cn(
                'flex min-w-0 items-center gap-2',
                phase === 'done' && 'text-success',
                phase === 'failed' && 'text-destructive'
              )}
            >
              {phase === 'done' && <CheckIcon className="size-4 shrink-0" />}
              {phase === 'failed' && (
                <CircleAlertIcon className="size-4 shrink-0" />
              )}
              <span className="min-w-0 break-words">{label}</span>
            </ProgressLabel>
            <ProgressValue />
          </Progress>
          {phase === 'done' && (
            <p className="text-sm text-muted-foreground">
              Find it in Apps, under Unknown Sources, on your Quest.
            </p>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-end gap-4">
        {note && (
          <p className="mr-auto text-sm text-muted-foreground">{note}</p>
        )}
        <Button
          size="lg"
          disabled={!connected || !chosen || running}
          aria-busy={running || undefined}
          onClick={() => void installSelection()}
        >
          {running ? (
            <>
              <LogoLoader height="0.8em" label={null} />
              Installing
            </>
          ) : (
            <>
              <DownloadIcon data-icon="inline-start" />
              {selection?.kind === 'bundle' ? 'Install bundle' : 'Install APK'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
