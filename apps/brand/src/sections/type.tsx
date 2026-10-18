import { Panel, Section } from '@/components/brand/section'
import { cn } from '@/lib/utils'

const scale = [
  {
    role: 'Display',
    spec: '72/72 Bold, -4% tracking',
    className: 'text-5xl font-bold tracking-[-0.04em] md:text-7xl',
    sample: 'Ready to install',
  },
  {
    role: 'Headline',
    spec: '36/40 Bold, -2.5%',
    className: 'text-4xl font-bold tracking-[-0.025em]',
    sample: 'Connect your Quest',
  },
  {
    role: 'Title',
    spec: '24/30 Semibold, -1%',
    className: 'text-2xl font-semibold tracking-tight',
    sample: 'Choose what to install',
  },
  {
    role: 'Body',
    spec: '16/24 Regular',
    className: 'max-w-prose text-base',
    sample:
      'Put on your headset and select Allow when the USB debugging prompt appears. QuestLoad waits until you do.',
  },
  {
    role: 'Supporting',
    spec: '14/20 Regular, muted',
    className: 'text-sm text-muted-foreground',
    sample: 'Quest 3 connected over USB',
  },
  {
    role: 'Code',
    spec: 'Geist Mono 13/20',
    className: 'font-mono text-[0.8125rem]',
    sample: '/sdcard/Android/obb/com.CMGames.IntoTheRadius',
  },
]

export function TypeSection() {
  return (
    <Section
      id="type"
      title="Type"
      lede="One family does the talking. Figtree stands in for Meta's Optimistic: open, round and steady at every size. Geist Mono is kept for what users might copy."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Panel>
          <dl className="divide-y">
            {scale.map((step) => (
              <div
                key={step.role}
                className="grid gap-2 py-5 first:pt-0 last:pb-0 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-6"
              >
                <dt>
                  <span className="font-semibold">{step.role}</span>
                  <span className="block text-sm text-muted-foreground">
                    {step.spec}
                  </span>
                </dt>
                <dd
                  className={cn(
                    'min-w-0 text-pretty break-words',
                    step.className
                  )}
                >
                  {step.sample}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
        <div className="grid gap-6">
          <Panel>
            <p className="text-7xl font-bold tracking-[-0.04em]">Aa</p>
            <p className="mt-4 font-semibold">Figtree Variable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything readable. Regular for reading, Semibold for actions and
              titles, Bold only at 36px and up.
            </p>
          </Panel>
          <Panel>
            <p className="font-mono text-7xl tracking-tight">Aa</p>
            <p className="mt-4 font-semibold">Geist Mono Variable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Package names, file paths, device logs, fingerprints. Never for
              labels or decoration.
            </p>
          </Panel>
        </div>
      </div>
    </Section>
  )
}
