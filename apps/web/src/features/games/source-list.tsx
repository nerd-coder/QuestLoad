import { Button } from '@questload/ui/components/button'
import { LogoLoader } from '@questload/ui/components/logo'
import { Switch } from '@questload/ui/components/switch'
import { cn } from '@questload/ui/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { LibraryBigIcon, Trash2Icon } from 'lucide-react'
import { plural } from '../../lib/format'
import { gamesQuery } from './queries'
import { gameCount, sourceLabel } from './source'
import {
  type GameSource,
  gamesStore,
  removeSource,
  setSourceEnabled,
} from './store'

export function SourceList() {
  const sources = useStore(gamesStore, (state) => state.sources)
  if (!sources.length) {
    return (
      <div className="grid justify-items-center gap-1 rounded-xl border-2 border-dashed border-input px-6 py-8 text-center">
        <LibraryBigIcon
          aria-hidden="true"
          className="mb-2 size-6 text-muted-foreground"
        />
        <p className="font-semibold">No games sources yet</p>
        <p className="text-sm text-muted-foreground">
          Add one to load a games list.
        </p>
      </div>
    )
  }
  return (
    <ul aria-label="Games sources" className="grid gap-2">
      {sources.map((source) => (
        <SourceRow key={source.id} source={source} />
      ))}
    </ul>
  )
}

/** One source: whether it loads, what it loaded, and its controls. */
function SourceRow({ source }: { source: GameSource }) {
  const games = useQuery({ ...gamesQuery(source), enabled: source.enabled })
  const label = sourceLabel(source.url)
  const count = games.isSuccess ? gameCount(games.data) : null
  const state = !source.enabled
    ? { text: 'Off', tone: 'muted' }
    : games.isPending
      ? { text: 'Loading games', tone: 'busy' }
      : games.isError
        ? { text: games.error.message, tone: 'error' }
        : {
            text: count === null ? 'Loaded' : `Loaded ${plural(count, 'game')}`,
            tone: 'ok',
          }

  return (
    <li
      className={cn(
        'flex items-center gap-3 rounded-xl bg-muted p-3 ring-1 ring-border',
        !source.enabled && 'opacity-70'
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary">
        {state.tone === 'busy' ? (
          <LogoLoader height="0.85rem" label={null} />
        ) : (
          <LibraryBigIcon aria-hidden="true" className="size-5" />
        )}
      </span>
      <div className="grid min-w-0 flex-1 gap-0.5">
        <p className="truncate font-semibold" title={source.url}>
          {label}
        </p>
        <p
          role="status"
          className={cn(
            'text-sm',
            state.tone === 'ok' && 'text-success',
            state.tone === 'error' && 'text-destructive',
            (state.tone === 'busy' || state.tone === 'muted') &&
              'text-muted-foreground'
          )}
        >
          {state.text}
        </p>
      </div>
      <Switch
        checked={source.enabled}
        onCheckedChange={(enabled) => setSourceEnabled(source.id, enabled)}
        aria-label={`Load games from ${label}`}
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => removeSource(source.id)}
        aria-label={`Remove ${label}`}
      >
        <Trash2Icon />
      </Button>
    </li>
  )
}
