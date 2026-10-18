import { CheckIcon, XIcon } from 'lucide-react'
import { Panel, Section } from '@/components/brand/section'

const pairs = [
  [
    'Connect Quest',
    'Initialize ADB session',
    'Name the thing users hold, not the protocol.',
  ],
  [
    'Put on your headset and select Allow',
    'Awaiting RSA authorization',
    'Give the next physical step.',
  ],
  [
    'Open QuestLoad in Chrome or Edge to connect your Quest',
    'Error: navigator.usb is undefined',
    'Errors say what to do, never apologize.',
  ],
  [
    'Installed Into the Radius',
    'Success!',
    'Confirm with the same verb the button used.',
  ],
  [
    'Replace the installed version',
    'Use -r flag',
    'Options describe the outcome.',
  ],
]

export function VoiceSection() {
  return (
    <Section
      id="voice"
      title="Voice"
      lede="Calm, specific, sentence case. QuestLoad talks like the headset does: short instructions with no emoji and no exclamation marks."
    >
      <Panel>
        <div className="hidden gap-6 pb-3 text-sm text-muted-foreground md:grid md:grid-cols-[1fr_1fr_1fr]">
          <span>Write</span>
          <span>Not</span>
          <span>Because</span>
        </div>
        <ul className="divide-y border-t">
          {pairs.map(([write, avoid, why]) => (
            <li
              key={write}
              className="grid gap-2 py-4 md:grid-cols-[1fr_1fr_1fr] md:gap-6"
            >
              <p className="flex gap-2 font-semibold">
                <CheckIcon
                  className="mt-0.5 size-4.5 shrink-0 text-success"
                  aria-label="Write"
                />
                {write}
              </p>
              <p className="flex gap-2 text-muted-foreground line-through decoration-destructive/60">
                <XIcon
                  className="mt-0.5 size-4.5 shrink-0 text-destructive"
                  aria-label="Not"
                />
                {avoid}
              </p>
              <p className="text-sm text-muted-foreground">{why}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </Section>
  )
}
