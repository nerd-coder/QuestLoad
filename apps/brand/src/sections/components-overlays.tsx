import { Button } from '@questload/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@questload/ui/components/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@questload/ui/components/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@questload/ui/components/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@questload/ui/components/tooltip'
import { EllipsisIcon, PlayIcon, RotateCwIcon, Trash2Icon } from 'lucide-react'
import { Panel } from '@/components/brand/section'

export function OverlaysPanel() {
  return (
    <Panel
      title="Navigation and overlays"
      description="The selected tab is a solid pill, like the Horizon OS library. Menus and dialogs sit one distance closer."
    >
      <div className="grid gap-8">
        <Tabs defaultValue="installer">
          <TabsList>
            <TabsTrigger value="installer">Installer</TabsTrigger>
            <TabsTrigger value="extractor">Extractor</TabsTrigger>
          </TabsList>
          <TabsContent value="installer" className="pt-2 text-muted-foreground">
            Install an APK or a bundle folder on your Quest.
          </TabsContent>
          <TabsContent value="extractor" className="pt-2 text-muted-foreground">
            Copy installed apps from your Quest back to this computer.
          </TabsContent>
        </Tabs>
        <div className="flex flex-wrap items-center gap-3">
          <UninstallDialog />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="More for Into the Radius"
                />
              }
            >
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <PlayIcon />
                  Open on Quest
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RotateCwIcon />
                  Reinstall
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Uninstall
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" />}>
              Why USB?
            </TooltipTrigger>
            <TooltipContent>
              Quest only accepts installs from a trusted computer.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Panel>
  )
}

function UninstallDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        <Trash2Icon data-icon="inline-start" />
        Uninstall
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uninstall Into the Radius?</DialogTitle>
          <DialogDescription>
            The app, its OBB files and its local save data are removed from your
            Quest.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>
            Keep app
          </DialogClose>
          <DialogClose render={<Button variant="destructive" />}>
            Uninstall
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
