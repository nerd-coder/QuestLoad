import {
  CircleAlertIcon,
  InfoIcon,
  TriangleAlertIcon,
  UsbIcon,
} from 'lucide-react'
import { Panel } from '@/components/brand/section'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function FeedbackPanel() {
  return (
    <Panel
      title="Status and feedback"
      description="Say what happened and what to do next. Color backs up the words, never replaces them."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid content-start gap-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">
              <Dot className="bg-success" />
              Connected
            </Badge>
            <Badge variant="warning">
              <Dot className="bg-warning" />
              Waiting for headset
            </Badge>
            <Badge variant="destructive">
              <Dot className="bg-destructive" />
              Install failed
            </Badge>
            <Badge variant="secondary">
              <UsbIcon />
              USB 3
            </Badge>
            <Badge>Beta</Badge>
            <Badge variant="outline">Quest 3</Badge>
          </div>
          <Progress value={62}>
            <ProgressLabel>Copying Into the Radius</ProgressLabel>
            <ProgressValue />
          </Progress>
          <div
            role="status"
            aria-label="Loading library"
            className="flex items-center gap-4"
          >
            <Skeleton className="size-14 rounded-xl" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-2/3 rounded-full" />
              <Skeleton className="h-3 w-1/3 rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid content-start gap-4">
          <Alert>
            <InfoIcon />
            <AlertTitle>Turn on developer mode first</AlertTitle>
            <AlertDescription>
              Open the Meta Horizon app on your phone, go to Devices, then
              Developer mode. Restart the headset after switching it on.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>Put on your headset</AlertTitle>
            <AlertDescription>
              Select Allow on the USB debugging prompt. QuestLoad continues as
              soon as you do.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>This browser can't reach USB devices</AlertTitle>
            <AlertDescription>
              Open QuestLoad in Chrome or Edge on a computer to connect your
              Quest.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </Panel>
  )
}

function Dot({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('size-1.5 rounded-full', className)}
    />
  )
}
