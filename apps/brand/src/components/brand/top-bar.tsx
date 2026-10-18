import { Button } from '@questload/ui/components/button'
import { Logo } from '@questload/ui/components/logo'
import { useStore } from '@tanstack/react-store'
import { MoonIcon, SunIcon } from 'lucide-react'
import { brandStore, toggleTheme } from '@/store'

export function TopBar() {
  const theme = useStore(brandStore, (state) => state.theme)
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4">
      <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pr-2 pl-4 shadow-lg ring-1 ring-border">
        <a
          href="#top"
          className="rounded-full"
          aria-label="QuestLoad, back to top"
        >
          <Logo />
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Design system
          </span>
          <Button
            variant="secondary"
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
