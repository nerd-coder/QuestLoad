import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cn } from '@questload/ui/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// Horizon OS: every action is a pill, every pill lifts on hover. A disabled
// button that is working (aria-busy) keeps full color: it isn't unavailable.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-semibold whitespace-nowrap outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 aria-busy:opacity-100 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.15em]",
  {
    variants: {
      variant: {
        default:
          'lift bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2)] hover:brightness-110',
        outline:
          'lift border-input bg-transparent hover:bg-accent aria-expanded:bg-accent',
        secondary:
          'lift bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] aria-expanded:bg-accent',
        ghost: 'lift hover:bg-accent aria-expanded:bg-accent',
        destructive:
          'lift bg-destructive/12 text-destructive hover:bg-destructive/20',
        link: 'text-link underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        xs: 'h-7 gap-1 px-3 text-xs',
        sm: 'h-9 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        lg: 'h-13 gap-2.5 px-7 text-lg has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6',
        icon: 'size-11',
        'icon-xs': 'size-7',
        'icon-sm': 'size-9',
        'icon-lg': "size-13 [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
