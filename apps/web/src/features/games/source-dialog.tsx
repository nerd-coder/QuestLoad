import { Button } from '@questload/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@questload/ui/components/dialog'
import { useStore } from '@tanstack/react-store'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { AddSourceForm } from './add-source-form'
import { SourceList } from './source-list'
import { gamesStore, setSourceDialog } from './store'

export function GamesSourceDialog() {
  const open = useStore(gamesStore, (state) => state.open)
  return (
    <Dialog open={open} onOpenChange={setSourceDialog}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Games sources</DialogTitle>
          <DialogDescription>
            QuestLoad loads games lists from the sources you add. A source
            that's off stays saved but isn't loaded.
          </DialogDescription>
        </DialogHeader>
        <Sources />
      </DialogContent>
    </Dialog>
  )
}

// Inside the dialog content, so closing the dialog also closes the add form.
function Sources() {
  const [adding, setAdding] = useState(false)
  return (
    <>
      <SourceList />
      {adding ? (
        <AddSourceForm onDone={() => setAdding(false)} />
      ) : (
        <Button
          variant="secondary"
          className="justify-self-start"
          onClick={() => setAdding(true)}
        >
          <PlusIcon data-icon="inline-start" />
          Add source
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        Sources and their passwords are saved in this browser only.
      </p>
    </>
  )
}
