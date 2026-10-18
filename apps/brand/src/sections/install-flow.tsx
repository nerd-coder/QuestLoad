import { Panel, Section } from '@/components/brand/section'
import { DeviceStatus } from '@/patterns/device-status'
import { DropZone } from '@/patterns/drop-zone'
import { Installer } from '@/patterns/installer'
import { Library } from '@/patterns/library'

export function InstallFlowSection() {
  return (
    <Section
      id="install-flow"
      title="Install flow"
      lede="The components assembled into QuestLoad's real job: connect a headset, choose a file, install it, find it again."
    >
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Panel
            title="Headset connection"
            description="Three states. Each names the next physical step."
          >
            <DeviceStatus />
          </Panel>
          <Panel
            title="Nothing chosen yet"
            className="flex flex-col [&>div:last-child]:flex-1"
          >
            <DropZone />
          </Panel>
        </div>
        <Installer />
        <Panel
          title="Installed apps"
          description="Sideloaded apps appear under Unknown Sources in the headset. Covers are tiles, so they lift."
        >
          <Library />
        </Panel>
      </div>
    </Section>
  )
}
