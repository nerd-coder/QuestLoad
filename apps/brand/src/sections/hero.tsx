import { Button } from '@questload/ui/components/button'
import { Checkbox } from '@questload/ui/components/checkbox'
import { UsbIcon } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="top"
      className="grid min-h-[92svh] items-center gap-16 pt-32 pb-16 lg:grid-cols-[1fr_minmax(0,30rem)]"
    >
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold tracking-[-0.04em] text-balance md:text-7xl">
          Feels like it shipped with your headset.
        </h1>
        <p className="mt-6 max-w-lg text-xl text-pretty text-muted-foreground">
          QuestLoad's design system borrows Horizon OS's floating glass, pill
          actions and calm type, so installing an app in the browser looks like
          the prompt you approve inside the Quest.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#components" />}
          >
            Browse components
          </Button>
          <Button
            size="lg"
            variant="secondary"
            nativeButton={false}
            render={<a href="#install-flow" />}
          >
            See the install flow
          </Button>
        </div>
      </div>
      <HeadsetPrompt />
    </section>
  )
}

// The moment every QuestLoad session hinges on, as seen in the headset.
function HeadsetPrompt() {
  return (
    <figure className="[perspective:1400px]">
      <div
        inert
        className="spawn relative transform-3d lg:[transform:rotateY(-16deg)_rotateX(4deg)]"
      >
        <div className="glass relative rounded-3xl p-7 shadow-2xl ring-1 ring-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-foreground">
              <UsbIcon className="size-4.5" />
            </span>
            USB debugging
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-tight">
            Allow USB debugging?
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            The computer's RSA key fingerprint is:
          </p>
          <p className="mt-2 font-mono text-sm break-all text-foreground/90">
            4F:2A:9C:E1:07:B3:5D:88:C0:16:7A:FE:39:D2:64:0B
          </p>
          <div className="mt-6 flex items-center gap-3 text-base">
            <Checkbox defaultChecked />
            Always allow from this computer
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <Button variant="secondary">Cancel</Button>
            <div className="relative">
              <Button className="w-full scale-103 brightness-110">Allow</Button>
              <Ray />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-6 text-center text-sm text-muted-foreground lg:mt-10">
        The prompt users approve in the headset, drawn with QuestLoad tokens.
      </figcaption>
    </figure>
  )
}

// Controller ray and cursor resting on the target, as in Horizon OS.
function Ray() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-[60%] left-[84%]"
    >
      <span className="absolute top-0 left-0 h-[3px] w-56 origin-left -translate-y-1/2 rotate-[52deg] rounded-full bg-linear-to-r from-primary/90 via-primary/30 to-transparent dark:from-white/90 dark:via-white/30" />
      <span className="absolute size-5 -translate-1/2 rounded-full border-[3px] border-white bg-white/30 shadow-[0_0_14px_3px_rgb(8_102_255/0.55)] dark:shadow-[0_0_16px_4px_rgb(255_255_255/0.45)]" />
    </span>
  )
}
