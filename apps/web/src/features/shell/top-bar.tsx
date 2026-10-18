import { Button, buttonVariants } from '@questload/ui/components/button'
import { LogoMark } from '@questload/ui/components/logo'
import { TabsList, TabsTrigger } from '@questload/ui/components/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@questload/ui/components/tooltip'
import { cn } from '@questload/ui/lib/utils'
import { useStore } from '@tanstack/react-store'
import { LibraryBigIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { setSourceDialog } from '../games'
import { GitHubMark } from './github-mark'
import { SOURCE_URL } from './links'
import { shellStore, toggleTheme } from './store'

/** Floating glass bar. Sits inside the app's Tabs root so it can switch views. */
export function TopBar() {
  const theme = useStore(shellStore, (state) => state.theme)
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    // Same width and gutters as <main>, so the bar lines up with the panels.
    <header className="fixed inset-x-0 top-4 z-40 mx-auto max-w-3xl px-4 sm:px-6">
      <div className="glass flex h-14 items-center justify-between gap-2 rounded-full pr-2 pl-3 shadow-lg ring-1 ring-border sm:gap-3 sm:pl-4">
        <span className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold tracking-[-0.02em] max-sm:sr-only">
            QuestLoad
          </span>
        </span>
        <TabsList aria-label="Views">
          <TabsTrigger value="installer" className="max-sm:px-3">
            Installer
          </TabsTrigger>
          <TabsTrigger value="extractor" className="max-sm:px-3">
            Extractor
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-1">
          <IconTip label="QuestLoad source on GitHub" className="max-sm:hidden">
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="QuestLoad source on GitHub"
              className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
            >
              <GitHubMark className="size-5" />
            </a>
          </IconTip>
          <IconTip label="Games source">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSourceDialog(true)}
              aria-label="Games source"
            >
              <LibraryBigIcon />
            </Button>
          </IconTip>
          <IconTip label={`Switch to ${next} mode`}>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label={`Switch to ${next} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>
          </IconTip>
        </div>
      </div>
    </header>
  )
}

/** An icon button's name, shown on hover and focus. */
function IconTip({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactElement
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} className={cn(className)} />
      <TooltipContent side="bottom" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
