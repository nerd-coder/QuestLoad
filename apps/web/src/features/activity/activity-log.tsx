import { cn } from '@questload/ui/lib/utils'
import { useStore } from '@tanstack/react-store'
import { CheckIcon, CircleAlertIcon, TriangleAlertIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { activityStore, type Tone } from './store'

function ToneIcon({ tone }: { tone: Tone }) {
  const className = 'size-3.5'
  if (tone === 'success')
    return <CheckIcon className={cn(className, 'text-success')} />
  if (tone === 'warning')
    return <TriangleAlertIcon className={cn(className, 'text-warning')} />
  if (tone === 'error')
    return <CircleAlertIcon className={cn(className, 'text-destructive')} />
  return <span className="size-1 rounded-full bg-muted-foreground" />
}

export function ActivityLog() {
  const entries = useStore(activityStore, (state) => state.entries)
  const log = useRef<HTMLDivElement>(null)

  // Keep the newest line in view as the install reports progress.
  useEffect(() => {
    if (log.current && entries.length) {
      log.current.scrollTop = log.current.scrollHeight
    }
  }, [entries])

  return (
    <section aria-labelledby="activity-title">
      <h2 id="activity-title" className="mb-3 text-sm font-semibold">
        Activity
      </h2>
      <div
        ref={log}
        role="log"
        aria-labelledby="activity-title"
        // Scrollable regions must be reachable by keyboard.
        // biome-ignore lint/a11y/noNoninteractiveTabindex: see above
        tabIndex={0}
        className="h-36 overflow-y-auto rounded-xl bg-muted p-4 ring-1 ring-border"
      >
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Each connection and install step shows up here.
          </p>
        ) : (
          <ol className="grid gap-1.5 font-mono text-[0.8125rem]">
            {entries.map((entry) => (
              <li key={entry.id} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="grid h-5 w-3.5 shrink-0 place-items-center"
                >
                  <ToneIcon tone={entry.tone} />
                </span>
                <span className="min-w-0 break-words">{entry.text}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
