import { Button, buttonVariants } from '@questload/ui/components/button'
import { LogoMark } from '@questload/ui/components/logo'
import { TabsList, TabsTrigger } from '@questload/ui/components/tabs'
import { useStore } from '@tanstack/react-store'
import { MoonIcon, SunIcon } from 'lucide-react'
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
      <div className="glass flex h-14 items-center justify-between gap-3 rounded-full pr-2 pl-4 shadow-lg ring-1 ring-border">
        <span className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold tracking-[-0.02em] max-sm:sr-only">
            QuestLoad
          </span>
        </span>
        <TabsList aria-label="Views">
          <TabsTrigger value="installer">Installer</TabsTrigger>
          <TabsTrigger value="extractor">Extractor</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-1">
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="QuestLoad source on GitHub"
            className={buttonVariants({
              variant: 'ghost',
              size: 'icon-sm',
              className: 'max-sm:hidden',
            })}
          >
            <GitHubMark className="size-5" />
          </a>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${next} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </div>
    </header>
  )
}
