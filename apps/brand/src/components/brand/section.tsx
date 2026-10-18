import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string
  title: string
  lede: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-14 md:py-20">
      <header className="mb-8 max-w-2xl">
        <h2
          id={`${id}-title`}
          className="text-4xl font-bold tracking-[-0.025em]"
        >
          {title}
        </h2>
        <p className="mt-3 text-lg text-pretty text-muted-foreground">{lede}</p>
      </header>
      {children}
    </section>
  )
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'glass rounded-3xl p-6 shadow-xl ring-1 ring-border md:p-8',
        className
      )}
    >
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
