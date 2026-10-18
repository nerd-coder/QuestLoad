import { buttonVariants } from '@questload/ui/components/button'
import { ArchiveRestoreIcon, ExternalLinkIcon } from 'lucide-react'

export function ExtractorView({ sourceUrl }: { sourceUrl: string }) {
  return (
    <div className="glass grid justify-items-center gap-4 rounded-3xl px-6 py-14 text-center shadow-xl ring-1 ring-border">
      <span className="grid size-14 place-items-center rounded-full bg-primary/12 text-link">
        <ArchiveRestoreIcon aria-hidden="true" className="size-6" />
      </span>
      <h2 className="text-2xl font-semibold tracking-tight">Not ready yet</h2>
      <p className="max-w-md text-muted-foreground">
        The Extractor will copy apps installed on your Quest back to this
        computer, so you can keep a backup or move them to another headset.
      </p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ variant: 'secondary', className: 'mt-2' })}
      >
        Follow progress on GitHub
        <ExternalLinkIcon data-icon="inline-end" />
      </a>
    </div>
  )
}
