import { cn } from '@questload/ui/lib/utils'
import type * as React from 'react'

// Styled like Input: a control on a muted fill, never mistaken for a button.
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-24 w-full rounded-lg border border-input bg-muted px-3.5 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
