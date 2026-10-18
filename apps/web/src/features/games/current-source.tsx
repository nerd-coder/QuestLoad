import { Button } from '@questload/ui/components/button'
import { LogoLoader } from '@questload/ui/components/logo'
import { cn } from '@questload/ui/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { LibraryBigIcon } from 'lucide-react'
import { plural } from '../../lib/format'
import { defaultSourceQuery, gamesQuery } from './queries'
import { gameCount } from './source'
import { forgetSource, gamesStore } from './store'

const none = { url: 'about:blank', password: '' }

/** Which source is in use, where it came from, and whether it loads. */
export function CurrentSource() {
  const saved = useStore(gamesStore, (state) => state.saved)
  const fallback = useQuery({ ...defaultSourceQuery, enabled: !saved })
  const source = saved ?? fallback.data ?? null
  const games = useQuery({
    ...gamesQuery(source ?? none),
    enabled: Boolean(source),
  })

  if (!saved && fallback.isPending) {
    return <Row title="Looking for a games source" detail={null} busy />
  }
  if (!source) {
    return (
      <Row
        title="No games source yet"
        detail="Paste one below to load a games list."
      />
    )
  }

  const host = new URL(source.url).host
  const origin = saved
    ? saved.from
      ? `Saved in this browser, read from ${new URL(saved.from).host}`
      : 'Saved in this browser'
    : "This site's default"
  const count = games.isSuccess ? gameCount(games.data) : null
  const state = games.isPending
    ? 'Loading games'
    : games.isError
      ? games.error.message
      : count === null
        ? 'Loaded'
        : `Loaded ${plural(count, 'game')}`

  return (
    <Row
      title={host}
      detail={origin}
      state={state}
      tone={games.isError ? 'error' : games.isSuccess ? 'ok' : 'busy'}
      action={
        saved && (
          <Button variant="ghost" size="sm" onClick={forgetSource}>
            Remove
          </Button>
        )
      }
    />
  )
}

function Row({
  title,
  detail,
  state,
  tone,
  busy = tone === 'busy',
  action,
}: {
  title: string
  detail: string | null
  state?: string
  tone?: 'ok' | 'error' | 'busy'
  busy?: boolean
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-muted p-4 ring-1 ring-border">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary">
        {busy ? (
          <LogoLoader height="0.9rem" label={null} />
        ) : (
          <LibraryBigIcon aria-hidden="true" className="size-5" />
        )}
      </span>
      <div role="status" className="grid min-w-0 flex-1 gap-0.5">
        <p className="truncate font-semibold">{title}</p>
        {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
        {state && (
          <p
            className={cn(
              'text-sm',
              tone === 'ok' && 'text-success',
              tone === 'error' && 'text-destructive',
              tone === 'busy' && 'text-muted-foreground'
            )}
          >
            {state}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
