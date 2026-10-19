import { Button } from '@questload/ui/components/button'
import { Input } from '@questload/ui/components/input'
import { Label } from '@questload/ui/components/label'
import { LogoLoader } from '@questload/ui/components/logo'
import { Textarea } from '@questload/ui/components/textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardPasteIcon } from 'lucide-react'
import { useState } from 'react'
import { gamesQuery } from './queries'
import {
  checkSource,
  parseConfig,
  type SourceInput,
  UncheckedSource,
  validateSource,
} from './source'
import { addSource, hasSource } from './store'

const example = `{
  "url": "https://example.com/api/games",
  "password": "…"
}`

/** URL and password, optionally filled from a pasted JSON config. */
export function AddSourceForm({ onDone }: { onDone: () => void }) {
  const [url, setUrl] = useState('')
  const [password, setPassword] = useState('')
  const [pasting, setPasting] = useState(false)
  const [json, setJson] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [filled, setFilled] = useState(false)
  const queryClient = useQueryClient()

  const check = useMutation({
    mutationFn: async (input: SourceInput) => {
      const source = validateSource(input)
      if (hasSource(source.url))
        throw new Error('That URL is already in the list.')
      return checkSource(source)
    },
    onSuccess: ({ source, games }) => {
      queryClient.setQueryData(gamesQuery(source).queryKey, games)
      addSource(source)
      onDone()
    },
  })
  const unchecked = check.error instanceof UncheckedSource ? check.error : null

  const fill = () => {
    try {
      const config = parseConfig(json)
      setUrl(config.url)
      setPassword(config.password)
      setPasting(false)
      setJson('')
      setJsonError(null)
      setFilled(true)
      check.reset()
    } catch (error) {
      setJsonError((error as Error).message)
    }
  }

  return (
    // noValidate: our messages explain the fix; the browser's url bubble does not.
    <form
      noValidate
      aria-labelledby="add-source-title"
      className="grid gap-4 rounded-xl p-4 ring-1 ring-border"
      onSubmit={(event) => {
        event.preventDefault()
        check.mutate({ url, password })
      }}
    >
      <h3 id="add-source-title" className="font-semibold">
        Add a games source
      </h3>
      <div className="grid gap-2">
        <Label htmlFor="source-url">Games list URL</Label>
        <Input
          id="source-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com/api/games"
          autoComplete="off"
          spellCheck={false}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="source-password">Password</Label>
        <Input
          id="source-password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby="source-password-help"
        />
        <p id="source-password-help" className="text-sm text-muted-foreground">
          Sent to the games server in the x-api-password header.
        </p>
      </div>
      {filled && (
        <p role="status" className="text-sm text-success">
          Filled in from the JSON config.
        </p>
      )}
      {pasting ? (
        <div className="grid gap-2">
          <Label htmlFor="source-json">JSON config</Label>
          <Textarea
            id="source-json"
            value={json}
            onChange={(event) => setJson(event.target.value)}
            placeholder={example}
            spellCheck={false}
            className="max-h-48 font-mono text-[0.8125rem]"
            aria-invalid={Boolean(jsonError) || undefined}
          />
          {jsonError && (
            <p role="alert" className="text-sm text-destructive">
              {jsonError}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={fill}
              disabled={!json.trim()}
            >
              Fill in
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setPasting(false)
                setJsonError(null)
              }}
            >
              Hide
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="justify-self-start px-0"
          onClick={() => {
            setPasting(true)
            setFilled(false)
          }}
        >
          <ClipboardPasteIcon data-icon="inline-start" />
          Paste a JSON config
        </Button>
      )}
      {check.error && (
        <p role="alert" className="text-sm text-destructive">
          {check.error.message}
          {unchecked && ' Add it anyway, or fix it and try again.'}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        {unchecked && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              addSource(unchecked.source)
              onDone()
            }}
          >
            Add anyway
          </Button>
        )}
        <Button
          type="submit"
          disabled={!url.trim() || check.isPending}
          aria-busy={check.isPending || undefined}
        >
          {check.isPending ? (
            <>
              <LogoLoader height="0.8em" label={null} />
              Checking
            </>
          ) : (
            'Add source'
          )}
        </Button>
      </div>
    </form>
  )
}
