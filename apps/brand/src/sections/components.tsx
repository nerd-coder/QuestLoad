import { Section } from '@/components/brand/section'
import { ActionsPanel } from './components-actions'
import { FeedbackPanel } from './components-feedback'
import { FormsPanel } from './components-forms'
import { OverlaysPanel } from './components-overlays'

export function ComponentsSection() {
  return (
    <Section
      id="components"
      title="Components"
      lede="shadcn/ui on Base UI, restyled for Horizon OS: pill actions, 44px targets, glass surfaces and a white focus halo you can see across the room."
    >
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid content-start gap-6">
            <ActionsPanel />
            <OverlaysPanel />
          </div>
          <FormsPanel />
        </div>
        <FeedbackPanel />
      </div>
    </Section>
  )
}
