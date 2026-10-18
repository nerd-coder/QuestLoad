export function PageIntro({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="mb-10 max-w-2xl">
      <h1 className="text-4xl font-bold tracking-[-0.025em] text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-pretty text-muted-foreground">{lede}</p>
    </header>
  )
}
