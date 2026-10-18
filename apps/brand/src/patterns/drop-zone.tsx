import { Button } from '@questload/ui/components/button'
import { FileDownIcon } from 'lucide-react'

// Empty state for step 2: an invitation, with the folder option one level down.
export function DropZone() {
  return (
    <div className="grid h-full place-items-center rounded-xl border-2 border-dashed border-input p-8 text-center">
      <div className="grid justify-items-center gap-3">
        <span className="grid size-14 place-items-center rounded-full bg-primary/12 text-link">
          <FileDownIcon className="size-6" />
        </span>
        <p className="text-lg font-semibold">Drop an APK here</p>
        <p className="max-w-60 text-sm text-muted-foreground">
          Or choose one from this computer. Games with OBB files install as a
          bundle folder.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button size="sm">Choose APK</Button>
          <Button size="sm" variant="secondary">
            Choose folder
          </Button>
        </div>
      </div>
    </div>
  )
}
