import { CheckIcon, FolderIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { LogoLoader } from '@/components/brand/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const log = [
  ['ok', 'Connected to Quest 3'],
  ['', 'Checking IntoTheRadius bundle'],
  ['ok', 'Found com.CMGames.IntoTheRadius.apk and 2 OBB files'],
  ['', 'Copying com.CMGames.IntoTheRadius.apk (164 MB)'],
  ['ok', 'Installed com.CMGames.IntoTheRadius'],
  ['', 'Copying main.161562.com.CMGames.IntoTheRadius.obb (1.2 GB)'],
] as const

type StepState = 'done' | 'current' | 'next'

// The installer's three steps are a real sequence, so they are numbered.
export function Installer() {
  return (
    <div className="glass overflow-hidden rounded-3xl shadow-xl ring-1 ring-border">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-8">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">
            Install on your Quest
          </h3>
          <p className="text-sm text-muted-foreground">
            Keep the headset plugged in until the install finishes.
          </p>
        </div>
        <Badge variant="success">
          <CheckIcon />
          Quest 3 connected
        </Badge>
      </div>
      <ol className="grid border-t md:grid-cols-[1fr_1.2fr_1.4fr] md:divide-x">
        <Step n={1} state="done" title="Connect">
          <p className="text-sm text-muted-foreground">
            Quest 3 approved this computer.
          </p>
        </Step>
        <Step n={2} state="done" title="Choose">
          <div className="flex items-center gap-3 rounded-xl bg-muted p-3 ring-1 ring-border">
            <FolderIcon className="size-5 shrink-0 text-link" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">IntoTheRadius</p>
              <p className="text-xs text-muted-foreground">
                1 APK, 2 OBB files, 1.4 GB
              </p>
            </div>
          </div>
        </Step>
        <Step n={3} state="current" title="Install">
          <Progress value={58}>
            <ProgressLabel className="font-normal text-muted-foreground">
              Copying OBB 1 of 2
            </ProgressLabel>
            <ProgressValue />
          </Progress>
        </Step>
      </ol>
      <div className="border-t px-6 py-5 md:px-8">
        <h4 className="mb-3 text-sm font-semibold">Activity</h4>
        <ScrollArea className="h-36 rounded-xl bg-muted ring-1 ring-border">
          <ol className="grid gap-1.5 p-4 font-mono text-[0.8125rem]">
            {log.map(([status, line]) => (
              <li key={line} className="flex gap-2.5">
                <span
                  className="grid h-5 w-3.5 shrink-0 place-items-center"
                  aria-hidden="true"
                >
                  {status === 'ok' ? (
                    <CheckIcon className="size-3.5 text-success" />
                  ) : (
                    <span className="size-1 rounded-full bg-muted-foreground" />
                  )}
                </span>
                <span className="min-w-0 break-all">{line}</span>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </div>
      <div className="flex flex-wrap justify-end gap-3 border-t bg-muted px-6 py-4 md:px-8">
        <Button variant="outline">Cancel install</Button>
        <Button disabled>
          <LogoLoader height="0.85em" label={null} />
          Installing
        </Button>
      </div>
    </div>
  )
}

function Step({
  n,
  state,
  title,
  children,
}: {
  n: number
  state: StepState
  title: string
  children: ReactNode
}) {
  return (
    <li
      aria-current={state === 'current' ? 'step' : undefined}
      className={cn(
        'grid content-start gap-4 border-b px-6 py-5 last:border-b-0 md:border-b-0 md:px-8',
        state === 'next' && 'opacity-50'
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'grid size-8 place-items-center rounded-full text-sm font-semibold',
            state === 'done' && 'bg-success/14 text-success',
            state === 'current' && 'bg-primary text-primary-foreground',
            state === 'next' && 'bg-secondary'
          )}
        >
          {state === 'done' ? <CheckIcon className="size-4" /> : n}
        </span>
        <span className="font-semibold">
          {title}
          {state === 'done' && <span className="sr-only">, done</span>}
        </span>
      </div>
      {children}
    </li>
  )
}
