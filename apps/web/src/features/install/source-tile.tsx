import { cn } from '@questload/ui/lib/utils'
import type { DragEvent, ReactNode } from 'react'

/** A pressable drop target that opens a file picker. */
export function SourceTile({
  icon,
  title,
  detail,
  error,
  selected,
  dragging = false,
  disabled,
  onPick,
  onDrop,
  onDragState,
}: {
  icon: ReactNode
  title: string
  detail: string | null
  error?: string | null
  selected: boolean
  dragging?: boolean
  disabled: boolean
  onPick: () => void
  onDrop?: (event: DragEvent<HTMLButtonElement>) => void
  onDragState?: (dragging: boolean) => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPick}
      onDrop={(event) => {
        event.preventDefault()
        onDragState?.(false)
        onDrop?.(event)
      }}
      onDragOver={(event) => {
        if (!onDrop) return
        event.preventDefault()
        onDragState?.(true)
      }}
      onDragLeave={() => onDragState?.(false)}
      aria-pressed={selected}
      className={cn(
        'lift flex items-start gap-4 sm:min-h-28 rounded-xl border-2 p-4 text-left disabled:opacity-50',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-dashed border-input hover:bg-accent',
        dragging && 'border-solid border-primary bg-primary/10',
        error && 'border-destructive/60'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-full [&_svg]:size-5',
          selected ? 'bg-primary text-primary-foreground' : 'bg-secondary'
        )}
      >
        {icon}
      </span>
      <span className="grid min-w-0 gap-1">
        <span className="truncate font-semibold">{title}</span>
        {detail && (
          <span className="text-sm text-muted-foreground">{detail}</span>
        )}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </span>
    </button>
  )
}
