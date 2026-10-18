import { LogoLoader, LogoMark } from '@questload/ui/components/logo'
import { MARK } from '@questload/ui/lib/logo'
import { cn } from '@questload/ui/lib/utils'
import { DownloadIcon } from 'lucide-react'
import { Panel, Section } from '@/components/brand/section'
import { LogoAssets } from './logo-assets'

const lockups = [
  {
    file: 'questload-logo-on-dark',
    bg: 'bg-[#0B1222]',
    note: 'Color, on dark',
  },
  {
    file: 'questload-logo-on-light',
    bg: 'bg-[#F1F4F7]',
    note: 'Color, on light',
  },
  {
    file: 'questload-logo-white',
    bg: 'bg-[#0866FF]',
    note: 'White, on Meta Blue or photos',
  },
  {
    file: 'questload-logo-ink',
    bg: 'bg-white',
    note: 'Ink, for single-color print',
  },
]

const stacks = [
  { file: 'questload-stacked-on-dark', bg: 'bg-[#0B1222]' },
  { file: 'questload-stacked-on-light', bg: 'bg-[#F1F4F7]' },
  { file: 'questload-mark-white', bg: 'bg-[#1C2B33]' },
  { file: 'questload-mark-ink', bg: 'bg-[#F7B928]' },
]

export function LogoSection() {
  return (
    <Section
      id="logo"
      title="Logo"
      lede="The Quest 3's three front sensors, fading left to right like a load in progress. The mark is original: it nods to the hardware and never borrows Meta's logo."
    >
      <div className="grid gap-6">
        <Panel>
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
            <div className="grid place-items-center rounded-xl bg-muted py-14 ring-1 ring-border">
              <LogoMark className="h-28" />
            </div>
            <div className="grid gap-6">
              <Fact title="Visor">
                {MARK.width} × {MARK.height}, radius {MARK.radius}. The Quest 3
                faceplate, simplified to a rounded rectangle in Meta Blue.
              </Fact>
              <Fact title="Sensors">
                Three 7 × 18 pills at 100, 65 and 35% white. Left to right they
                read as done, in progress, waiting.
              </Fact>
              <Fact title="Working">
                <span className="flex items-center gap-3">
                  <span className="grid h-9 place-items-center rounded-full bg-primary px-3.5 text-primary-foreground">
                    <LogoLoader height="0.9rem" label="Example loading state" />
                  </span>
                  The sensors light in turn wherever QuestLoad waits on the
                  headset.
                </span>
              </Fact>
            </div>
          </div>
        </Panel>
        <Panel
          title="Lockups"
          description="Clear space on every side equals one sensor's height. Keep the lockup at least 20px tall, the mark alone at least 24px."
        >
          <ul className="grid gap-4 md:grid-cols-2">
            {lockups.map((item) => (
              <Asset
                key={item.file}
                {...item}
                className="h-36"
                imgClass="h-10"
              />
            ))}
          </ul>
          <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stacks.map((item) => (
              <Asset
                key={item.file}
                {...item}
                className="h-44"
                imgClass="h-16"
              />
            ))}
          </ul>
        </Panel>
        <LogoAssets />
      </div>
    </Section>
  )
}

function Fact({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <div className="mt-1 text-muted-foreground">{children}</div>
    </div>
  )
}

function Asset({
  file,
  bg,
  note,
  className,
  imgClass,
}: {
  file: string
  bg: string
  note?: string
  className: string
  imgClass: string
}) {
  return (
    <li>
      <div
        className={cn(
          'grid place-items-center rounded-xl ring-1 ring-border',
          bg,
          className
        )}
      >
        <img
          src={`/logo/${file}.svg`}
          alt=""
          className={cn('w-auto', imgClass)}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-muted-foreground">
          {note ?? <code className="font-mono text-xs">{file}</code>}
        </span>
        <a
          href={`/logo/${file}.svg`}
          download
          aria-label={`Download ${file}.svg`}
          className="inline-flex shrink-0 items-center gap-1 rounded-full text-link hover:underline"
        >
          <DownloadIcon className="size-3.5" />
          SVG
        </a>
      </div>
    </li>
  )
}
