// GitHub Actions secrets through the gh CLI. Values go in on stdin, never argv.

export type Repo = { owner: string; name: string; slug: string }

async function run(cmd: string[], stdin?: string) {
  const proc = Bun.spawn(cmd, {
    stdin: stdin === undefined ? 'ignore' : new Blob([stdin]),
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [out, err, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { out: out.trim(), err: err.trim(), code }
}

/** The repo that deploys: origin, not upstream. */
export async function originRepo(): Promise<Repo | null> {
  const { out, code } = await run(['git', 'remote', 'get-url', 'origin'])
  const match =
    code === 0 && out.match(/github\.com[:/]([^/]+)\/(.+?)(\.git)?$/)
  if (!match) return null
  return { owner: match[1], name: match[2], slug: `${match[1]}/${match[2]}` }
}

export async function ghLogin(): Promise<string | null> {
  if (!Bun.which('gh')) return null
  const { out, code } = await run(['gh', 'api', 'user', '--jq', '.login'])
  return code === 0 ? out : null
}

/** Reading the secrets public key needs the same access as writing secrets. */
export async function canManageSecrets(repo: Repo) {
  const { code } = await run([
    'gh',
    'api',
    `repos/${repo.slug}/actions/secrets/public-key`,
  ])
  return code === 0
}

export async function existingSecrets(repo: Repo): Promise<Set<string>> {
  const { out, code } = await run([
    'gh',
    'secret',
    'list',
    '--repo',
    repo.slug,
    '--json',
    'name',
  ])
  if (code !== 0) return new Set()
  return new Set((JSON.parse(out) as { name: string }[]).map((s) => s.name))
}

export async function setSecret(repo: Repo, name: string, value: string) {
  const { code, err } = await run(
    ['gh', 'secret', 'set', name, '--repo', repo.slug],
    value
  )
  if (code !== 0) throw new Error(err || `gh secret set ${name} failed`)
}
