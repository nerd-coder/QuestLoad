import { TooltipProvider } from '@questload/ui/components/tooltip'
import { Dock } from '@/components/brand/dock'
import { TopBar } from '@/components/brand/top-bar'
import { ColorSection } from '@/sections/color'
import { ComponentsSection } from '@/sections/components'
import { Hero } from '@/sections/hero'
import { InstallFlowSection } from '@/sections/install-flow'
import { LogoSection } from '@/sections/logo'
import { ShapeSection } from '@/sections/shape'
import { TypeSection } from '@/sections/type'
import { VoiceSection } from '@/sections/voice'

export function App() {
  return (
    <TooltipProvider>
      <div aria-hidden="true" className="environment fixed inset-0 -z-10" />
      <TopBar />
      {/* Clips the hero's controller ray without clipping the viewport */}
      <div className="overflow-x-clip">
        <main className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
          <Hero />
          <LogoSection />
          <ColorSection />
          <TypeSection />
          <ShapeSection />
          <ComponentsSection />
          <InstallFlowSection />
          <VoiceSection />
          <footer className="border-t pt-8 pb-4 text-sm text-muted-foreground">
            QuestLoad is not affiliated with Meta. Meta Quest and Horizon OS are
            trademarks of Meta Platforms, Inc.
          </footer>
        </main>
      </div>
      <Dock />
    </TooltipProvider>
  )
}
