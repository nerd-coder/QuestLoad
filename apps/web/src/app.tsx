import { Tabs, TabsContent } from '@questload/ui/components/tabs'
import { TooltipProvider } from '@questload/ui/components/tooltip'
import { useStore } from '@tanstack/react-store'
import { ExtractorView } from './features/extractor'
import { GamesSourceDialog } from './features/games'
import { InstallerView } from './features/install'
import {
  PageIntro,
  SOURCE_URL,
  shellStore,
  showView,
  TopBar,
  UPSTREAM_URL,
  type View,
} from './features/shell'

export function App() {
  const view = useStore(shellStore, (state) => state.view)
  return (
    <TooltipProvider>
      <Tabs
        value={view}
        onValueChange={(value) => showView(value as View)}
        className="block"
      >
        <div aria-hidden="true" className="environment fixed inset-0 -z-10" />
        <TopBar />
        <main className="mx-auto max-w-3xl px-4 pt-28 pb-12 sm:px-6 sm:pt-32">
          <TabsContent value="installer">
            <PageIntro
              title="Install apps on your Quest"
              lede="Plug your headset into this computer, choose an APK, and QuestLoad installs it over USB. Your Quest needs developer mode turned on."
            />
            <InstallerView />
          </TabsContent>
          <TabsContent value="extractor">
            <PageIntro
              title="Copy apps off your Quest"
              lede="Keep a backup of what's on your headset, or move an app to another Quest."
            />
            <ExtractorView sourceUrl={SOURCE_URL} />
          </TabsContent>
        </main>
        <footer className="mx-auto grid max-w-3xl gap-2 px-4 pb-10 text-sm text-muted-foreground sm:px-6">
          <p>
            Maintained by Toàn. Forked from{' '}
            <a
              href={UPSTREAM_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-link underline underline-offset-4"
            >
              QuestLoad by Frizzle
            </a>
            .{' '}
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-link underline underline-offset-4"
            >
              Source on GitHub
            </a>
          </p>
          <p>
            Not affiliated with Meta. Meta Quest is a trademark of Meta
            Platforms, Inc.
          </p>
        </footer>
      </Tabs>
      <GamesSourceDialog />
    </TooltipProvider>
  )
}
