import {
  BlocksIcon,
  DownloadIcon,
  MessageSquareTextIcon,
  PaletteIcon,
  ShapesIcon,
  StampIcon,
  TypeIcon,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const items = [
  { href: '#logo', label: 'Logo', Icon: StampIcon },
  { href: '#color', label: 'Color', Icon: PaletteIcon },
  { href: '#type', label: 'Type', Icon: TypeIcon },
  { href: '#shape', label: 'Shape and depth', Icon: ShapesIcon },
  { href: '#components', label: 'Components', Icon: BlocksIcon },
  { href: '#install-flow', label: 'Install flow', Icon: DownloadIcon },
  { href: '#voice', label: 'Voice', Icon: MessageSquareTextIcon },
]

// The Horizon OS universal menu, as page navigation.
export function Dock() {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
    >
      <ul className="glass flex gap-1 rounded-full p-1.5 shadow-2xl ring-1 ring-border">
        {items.map(({ href, label, Icon }) => (
          <li key={href}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={href}
                    aria-label={label}
                    className="lift grid size-11 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                  />
                }
              >
                <Icon className="size-5" />
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>{label}</TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
    </nav>
  )
}
