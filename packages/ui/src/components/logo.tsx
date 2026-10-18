import { BLUE, MARK, markPills } from '@questload/ui/lib/logo'
import { cn } from '@questload/ui/lib/utils'

/** The Quest 3 visor and its three sensors, fading like a load in progress. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MARK.width} ${MARK.height}`}
      className={cn('h-6 w-auto', className)}
      aria-hidden="true"
    >
      <rect
        width={MARK.width}
        height={MARK.height}
        rx={MARK.radius}
        fill={BLUE}
      />
      {markPills().map((pill) => (
        <rect
          key={pill.x}
          x={pill.x}
          y={pill.y}
          width={pill.width}
          height={pill.height}
          rx={pill.rx}
          fill="#fff"
          fillOpacity={pill.opacity}
        />
      ))}
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-lg font-bold tracking-[-0.02em]">QuestLoad</span>
    </span>
  )
}

// Cropped to the pills alone, so they fill the text height.
const [first, , last] = markPills()
const pillsViewBox = `${first.x} ${first.y} ${last.x + last.width - first.x} ${first.height}`

/**
 * The mark's pills as a working indicator: each sensor lights in turn.
 * Under reduced motion it holds the static fade. Sized inline so icon-slot
 * rules (like Button's square svg size) can't squash it.
 */
export function LogoLoader({
  className,
  height = '1em',
  label = 'Loading',
}: {
  className?: string
  height?: string
  /** null hides it from assistive tech, for when nearby text says it. */
  label?: string | null
}) {
  return (
    <svg
      viewBox={pillsViewBox}
      className={className}
      style={{ height, width: 'auto' }}
      role={label ? 'img' : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
    >
      {markPills().map((pill, i) => (
        <rect
          key={pill.x}
          x={pill.x}
          y={pill.y}
          width={pill.width}
          height={pill.height}
          rx={pill.rx}
          fill="currentColor"
          fillOpacity={pill.opacity}
          className="animate-[sensor_1.2s_ease-in-out_infinite] motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  )
}
