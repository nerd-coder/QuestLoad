import { cn } from '@questload/ui/lib/utils'
import { CheckIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type StepState = 'done' | 'current' | 'next'

// The installer's steps are a real sequence, so they are numbered. State only
// changes the marker: a later step stays usable, it just isn't the focus yet.
export function Step({
  n,
  state,
  title,
  children,
}: {
  n: number
  state: StepState
  title: string
  children: ReactNode
}) {
  return (
    <li
      aria-current={state === 'current' ? 'step' : undefined}
      className="grid grid-cols-[2rem_1fr] gap-x-4 gap-y-4 px-5 py-6 sm:px-8"
    >
      <span
        className={cn(
          'grid size-8 place-items-center rounded-full text-sm font-semibold',
          state === 'done' && 'bg-success/14 text-success',
          state === 'current' && 'bg-primary text-primary-foreground',
          state === 'next' && 'bg-secondary text-muted-foreground'
        )}
      >
        {state === 'done' ? <CheckIcon className="size-4" /> : n}
      </span>
      <h2 className="self-center text-lg font-semibold tracking-tight">
        {title}
        {state === 'done' && <span className="sr-only">, done</span>}
      </h2>
      <div className="col-span-2 sm:col-start-2 sm:col-end-3">{children}</div>
    </li>
  )
}
