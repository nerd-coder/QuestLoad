import { Button } from '@questload/ui/components/button'
import { cn } from '@questload/ui/lib/utils'
import { DownloadIcon } from 'lucide-react'
import { Panel, Section } from '@/components/brand/section'

const layers = [
  {
    name: 'Environment',
    note: 'The scene. Nothing interactive.',
    className: 'environment',
  },
  {
    name: 'Panel',
    note: 'Glass, 78%, blur 40. shadow-xl',
    className: 'glass shadow-xl',
  },
  {
    name: 'Raised',
    note: 'Menus, selects. shadow-lg',
    className: 'bg-popover shadow-lg',
  },
  {
    name: 'Overlay',
    note: 'Dialogs over a scrim. shadow-2xl',
    className: 'bg-popover shadow-2xl',
  },
]

const motion = [
  ['Lift', '160ms', 'Pressables scale to 103% on hover, 97% on press.'],
  ['Spawn', '520ms', 'A window opening: fade, unblur, scale from 94%.'],
  [
    'Ease',
    'cubic-bezier(.2, .8, .2, 1)',
    'Fast out, soft landing. Used by both.',
  ],
]

export function ShapeSection() {
  return (
    <Section
      id="shape"
      title="Shape and depth"
      lede="Shape tells you what a thing is. Pills act, rounded rectangles hold. Depth is distance from you, and only panels leave the ground."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Radius tiers"
          description="Inner radius shrinks by the padding around it."
        >
          <div className="rounded-3xl bg-muted p-3 ring-1 ring-border">
            <p className="px-2 pb-2 text-sm text-muted-foreground">
              Panel, 28px
            </p>
            <div className="rounded-xl bg-muted p-3 ring-1 ring-border">
              <p className="px-1 pb-2 text-sm text-muted-foreground">
                Tile, 20px
              </p>
              <div className="flex h-11 items-center rounded-lg border border-input bg-muted px-3.5 text-sm text-muted-foreground">
                Control, 14px
              </div>
              <Button className="mt-3 w-full">
                <DownloadIcon data-icon="inline-start" />
                Pill, for actions
              </Button>
            </div>
          </div>
        </Panel>
        <Panel
          title="Depth"
          description="Four distances, each with one shadow."
        >
          <ol className="relative h-72">
            {layers.map((layer, index) => (
              <li
                key={layer.name}
                className={cn(
                  'absolute flex h-24 w-[78%] flex-col rounded-xl p-3 ring-1 ring-border',
                  layer.className
                )}
                style={{
                  top: `${index * 4}rem`,
                  left: `${index * 7}%`,
                  zIndex: index,
                }}
              >
                <span className="font-semibold">{layer.name}</span>
                <span className="text-xs text-muted-foreground">
                  {layer.note}
                </span>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel
          title="Motion"
          description="Motion answers a pointer. The one exception is a window spawning."
        >
          <button
            type="button"
            className="lift glass grid h-24 w-full place-items-center rounded-xl text-sm font-semibold shadow-lg ring-1 ring-border"
          >
            Point at this tile
          </button>
          <dl className="mt-5 grid gap-4">
            {motion.map(([name, value, note]) => (
              <div key={name}>
                <dt className="flex items-baseline justify-between gap-4 font-semibold">
                  {name}
                  <code className="font-mono text-xs font-normal text-muted-foreground">
                    {value}
                  </code>
                </dt>
                <dd className="text-sm text-muted-foreground">{note}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </Section>
  )
}
