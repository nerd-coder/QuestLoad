import { Panel } from '@/components/brand/section'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const headsets = [
  { label: 'Quest 3', value: 'quest-3' },
  { label: 'Quest 3S', value: 'quest-3s' },
  { label: 'Quest Pro', value: 'quest-pro' },
  { label: 'Quest 2', value: 'quest-2' },
]

export function FormsPanel() {
  return (
    <Panel
      title="Inputs"
      description="Controls are rounded rectangles on a muted fill, so they never read as buttons."
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="source-url">Games source URL</Label>
          <Input
            id="source-url"
            type="url"
            placeholder="https://example.com/api/games"
          />
          <p className="text-sm text-muted-foreground">
            QuestLoad sends the password in the{' '}
            <code className="font-mono text-[0.8125rem]">x-api-password</code>{' '}
            header.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="source-password">Password</Label>
          <Input
            id="source-password"
            type="password"
            defaultValue="hunter22"
            aria-invalid
            aria-describedby="source-password-error"
          />
          <p id="source-password-error" className="text-sm text-destructive">
            The games source rejected this password. Check it and try again.
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Headset</Label>
          <Select items={headsets} defaultValue="quest-3">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {headsets.map((headset) => (
                <SelectItem key={headset.value} value={headset.value}>
                  {headset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <fieldset className="grid gap-3">
          <legend className="mb-3 text-sm font-medium">What to install</legend>
          <RadioGroup defaultValue="apk" className="grid gap-3">
            <Label className="gap-3 text-base leading-normal font-normal">
              <RadioGroupItem value="apk" />A single APK
            </Label>
            <Label className="gap-3 text-base leading-normal font-normal">
              <RadioGroupItem value="bundle" />A bundle folder with APK and OBB
              files
            </Label>
          </RadioGroup>
        </fieldset>
        <div className="grid gap-4 border-t pt-6">
          <Label className="justify-between gap-3 text-base leading-normal font-normal">
            Replace the installed version
            <Switch defaultChecked />
          </Label>
          <Label className="gap-3 text-base leading-normal font-normal">
            <Checkbox defaultChecked />
            Disconnect when the install finishes
          </Label>
          <p className="text-sm text-muted-foreground">
            Press <Kbd>Enter</Kbd> to start the install once a file is chosen.
          </p>
        </div>
      </div>
    </Panel>
  )
}
