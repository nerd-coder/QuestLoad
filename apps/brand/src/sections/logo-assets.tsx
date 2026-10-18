import { LogoMark } from '@questload/ui/components/logo'
import { cn } from '@questload/ui/lib/utils'
import { CheckIcon, XIcon } from 'lucide-react'
import { Panel } from '@/components/brand/section'

const icons = [
  {
    src: '/icon-512.png',
    note: 'icon-192, icon-512: PWA and desktop',
    shape: 'rounded-[22.5%]',
  },
  {
    src: '/icon-maskable-512.png',
    note: 'icon-maskable-512: Android crops to a circle',
    shape: 'rounded-full',
  },
  {
    src: '/apple-touch-icon.png',
    note: 'apple-touch-icon: iOS adds the corners',
    shape: 'rounded-[22%]',
  },
]

const rules = [
  [
    'Keep the fade in order, left to right.',
    'Reverse or even out the sensors. The fade only reads as loading one way.',
  ],
  [
    'Use the white mark on Meta Blue and on photos.',
    'Put the blue visor on Meta Blue, where it disappears.',
  ],
  [
    'Say QuestLoad works with Meta Quest.',
    "Pair the mark with Meta's logo or call QuestLoad official.",
  ],
  [
    'Use the tile below 48px.',
    'Shrink the visor into a favicon, where its sensors blur together.',
  ],
]

export function LogoAssets() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel
          title="Small sizes"
          description="Below 48px the favicon tile takes over: the visor seen up close, pixel-fitted to a 16px grid."
        >
          <div className="flex flex-wrap items-end gap-8">
            {[16, 32, 48].map((size) => (
              <figure key={size} className="grid justify-items-center gap-2">
                <img src="/favicon.svg" alt="" width={size} height={size} />
                <figcaption className="text-xs text-muted-foreground">
                  {size}px
                </figcaption>
              </figure>
            ))}
            <figure className="grid justify-items-center gap-2">
              <LogoMark className="h-[9.6px] opacity-90" />
              <figcaption className="text-xs text-muted-foreground">
                Visor at 16px
              </figcaption>
            </figure>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <code className="font-mono text-xs">favicon.svg</code> for modern
            browsers, <code className="font-mono text-xs">favicon.ico</code>{' '}
            (16, 32, 48) for the rest.
          </p>
        </Panel>
        <Panel
          title="App icons"
          description="The mark floating over the Horizon environment, inside every platform's safe zone."
        >
          <ul className="grid grid-cols-3 gap-4">
            {icons.map((icon) => (
              <li key={icon.src} className="grid content-start gap-2">
                <img
                  src={icon.src}
                  alt=""
                  className={cn(
                    'aspect-square w-full ring-1 ring-border',
                    icon.shape
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {icon.note}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Social card"
          description="1200 × 630, for link previews. questload-social.png"
        >
          <img
            src="/logo/questload-social.png"
            width={1200}
            height={630}
            alt="QuestLoad logo above the line: Install apps on your Meta Quest, straight from the browser."
            className="h-auto w-full rounded-xl ring-1 ring-border"
          />
        </Panel>
        <Panel title="Use it well">
          <ul className="divide-y border-t">
            {rules.map(([write, avoid]) => (
              <li key={write} className="grid gap-2 py-4">
                <p className="flex gap-2">
                  <CheckIcon
                    className="mt-0.5 size-4.5 shrink-0 text-success"
                    aria-label="Do"
                  />
                  {write}
                </p>
                <p className="flex gap-2 text-muted-foreground">
                  <XIcon
                    className="mt-0.5 size-4.5 shrink-0 text-destructive"
                    aria-label="Don't"
                  />
                  {avoid}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
