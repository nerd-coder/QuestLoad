import { cn } from '@questload/ui/lib/utils'
import { Panel, Section } from '@/components/brand/section'
import {
  brandSwatches,
  type Swatch,
  semanticTokens,
  signalSwatches,
} from '@/lib/palette'

export function ColorSection() {
  return (
    <Section
      id="color"
      title="Color"
      lede="Meta's blue and slate on a night environment. Signal colors come from Meta's own system set, each with a text tone tuned per mode."
    >
      <div className="grid gap-6">
        <Panel title="Brand">
          <SwatchGrid swatches={brandSwatches} />
        </Panel>
        <Panel title="Signal">
          <SwatchGrid swatches={signalSwatches} />
        </Panel>
        <Panel
          title="Semantic tokens"
          description="What components read, rendered live from theme.css. Left chip dark mode, right chip light."
        >
          <SemanticTokens />
        </Panel>
      </div>
    </Section>
  )
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {swatches.map((swatch) => (
        <li key={swatch.name}>
          <div
            className={cn(
              'flex h-24 items-end rounded-xl p-3 ring-1 ring-border ring-inset',
              swatch.ink === 'light' ? 'text-white' : 'text-[#1C2B33]'
            )}
            style={{ backgroundColor: swatch.hex }}
          >
            <span className="font-mono text-xs">{swatch.hex}</span>
          </div>
          <p className="mt-3 font-semibold">{swatch.name}</p>
          <p className="mt-1 text-sm text-pretty text-muted-foreground">
            {swatch.role}
          </p>
          <p className="mt-2 text-sm text-foreground/80">{swatch.contrast}</p>
        </li>
      ))}
    </ul>
  )
}

function SemanticTokens() {
  return (
    <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {semanticTokens.map(([token, use]) => (
        <li key={token} className="flex items-center gap-4 border-t py-3">
          <div className="min-w-0 flex-1">
            <code className="font-mono text-[0.8125rem]">{token}</code>
            <p className="text-sm text-muted-foreground">{use}</p>
          </div>
          {(['dark', 'light'] as const).map((mode) => (
            <span
              key={mode}
              title={`${token} in ${mode} mode`}
              className={cn(
                mode,
                'size-8 shrink-0 rounded-full ring-1 ring-border'
              )}
              style={{
                backgroundColor: 'var(--background)',
                backgroundImage: `linear-gradient(var(${token}), var(${token}))`,
              }}
            />
          ))}
        </li>
      ))}
    </ul>
  )
}
