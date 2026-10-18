import { Button } from '@questload/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@questload/ui/components/dialog'
import { Label } from '@questload/ui/components/label'
import { LogoLoader } from '@questload/ui/components/logo'
import { Textarea } from '@questload/ui/components/textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { useState } from 'react'
import { plural } from '../../lib/format'
import { CurrentSource } from './current-source'
import { gamesQuery } from './queries'
import { checkSource, gameCount, UncheckedSource } from './source'
import { gamesStore, saveSource, setSourceDialog } from './store'

const example = `{
  "url": "https://example.com/api/games",
  "password": "…"
}

or https://example.com/games-source.json`

export function GamesSourceDialog() {
  const open = useStore(gamesStore, (state) => state.open)
  return (
    <Dialog open={open} onOpenChange={setSourceDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Games source</DialogTitle>
          <DialogDescription>
            QuestLoad loads its games list from a source you choose. Paste the
            source's config, or a link to it.
          </DialogDescription>
        </DialogHeader>
        <CurrentSource />
        <SourceForm />
      </DialogContent>
    </Dialog>
  )
}

/** Checks a pasted source by loading its games, then saves it. */
function SourceForm() {
  const [text, setText] = useState('')
  const queryClient = useQueryClient()
  const check = useMutation({
    mutationFn: checkSource,
    onSuccess: ({ source, from, games }) => {
      queryClient.setQueryData(gamesQuery(source).queryKey, games)
      saveSource(source, from)
      setText('')
    },
  })
  const unchecked = check.error instanceof UncheckedSource ? check.error : null
  const count = check.isSuccess ? gameCount(check.data.games) : null

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        check.mutate(text)
      }}
    >
      <Label htmlFor="games-source">Config or link</Label>
      <Textarea
        id="games-source"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={example}
        spellCheck={false}
        autoComplete="off"
        className="max-h-60 font-mono text-[0.8125rem]"
        aria-invalid={Boolean(check.error) || undefined}
        aria-describedby="games-source-help"
      />
      <p id="games-source-help" className="text-sm text-muted-foreground">
        Saved in this browser only. QuestLoad sends the password to the games
        server in the x-api-password header.
      </p>
      {check.error && (
        <p role="alert" className="text-sm text-destructive">
          {check.error.message}
          {unchecked && ' Save it anyway, or fix the source and try again.'}
        </p>
      )}
      {check.isSuccess && (
        <p role="status" className="text-sm text-success">
          Saved.{count === null ? '' : ` Loaded ${plural(count, 'game')}.`}
        </p>
      )}
      <DialogFooter>
        {unchecked && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              saveSource(unchecked.source, unchecked.from)
              check.reset()
              setText('')
            }}
          >
            Save anyway
          </Button>
        )}
        <Button
          type="submit"
          disabled={check.isPending || !text.trim()}
          aria-busy={check.isPending || undefined}
        >
          {check.isPending ? (
            <>
              <LogoLoader height="0.8em" label={null} />
              Checking
            </>
          ) : (
            'Save source'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
