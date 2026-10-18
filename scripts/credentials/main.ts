// Walks through the GitHub Actions secrets that deploy apps/web to Cloudflare:
// brief what each is for, infer what the machine already knows, prompt for the
// rest, check it against Cloudflare, then store it. Run: bun run credentials
// --dry-run does every read and check but stores nothing.
import {
  type Account,
  deployTarget,
  domainOwner,
  isAccountId,
  loginAccounts,
  probeToken,
  type Target,
  tokenUrls,
} from './cloudflare'
import {
  canManageSecrets,
  existingSecrets,
  ghLogin,
  originRepo,
  type Repo,
  setSecret,
} from './github'
import {
  ask,
  askSecret,
  c,
  confirm,
  fail,
  heading,
  installCleanup,
  note,
  offerLink,
  ok,
  restoreTerminal,
  say,
  step,
  warn,
} from './tty'

const dryRun = process.argv.includes('--dry-run')
const ACCOUNT = 'CLOUDFLARE_ACCOUNT_ID'
const TOKEN = 'CLOUDFLARE_API_TOKEN'

type Outcome = 'stored' | 'unverified' | 'kept' | 'skipped'
const outcomes: [string, Outcome][] = []

function brief(usedFor: string, needs: { name: string; why: string }[]) {
  say(`  ${c.dim('Used for:')} ${usedFor}`)
  say(`  ${c.dim('Needs:')}`)
  for (const need of needs) say(`    • ${need.name} ${c.dim(`— ${need.why}`)}`)
}

async function store(
  repo: Repo,
  name: string,
  value: string,
  verified: boolean
) {
  const flag = verified ? '' : c.yellow(' (unverified)')
  if (dryRun) {
    ok(`Would store ${name} on ${repo.slug}${flag}`)
  } else {
    await step(`Storing ${name}`, () => setSecret(repo, name, value))
    ok(`Stored ${name} on ${repo.slug}${flag}`)
  }
  outcomes.push([name, verified ? 'stored' : 'unverified'])
}

async function pickAccount(accounts: Account[]) {
  if (accounts.length === 1) {
    const [only] = accounts
    return (await confirm(`Use ${only.name} (${only.id})?`, true))
      ? only.id
      : ''
  }
  for (const [i, a] of accounts.entries()) {
    say(`    ${i + 1}. ${a.name} ${c.dim(a.id)}`)
  }
  const choice = Number(await ask('Number, or Enter to type an ID:'))
  return accounts[choice - 1]?.id ?? ''
}

async function accountStep(repo: Repo, existing: Set<string>, target: Target) {
  heading(`1. 🏢 Cloudflare account ID ${c.dim(ACCOUNT)}`)
  brief(`tells wrangler which account owns the ${target.worker} Worker.`, [
    {
      name: `The account that holds the ${target.domain.split('.').slice(-2).join('.')} zone`,
      why: "custom domains only attach to zones on the Worker's own account",
    },
  ])
  const accounts = await step('Reading your wrangler login', loginAccounts)
  let id = ''
  if (accounts.length) {
    note('From `wrangler login`. Pick the account that holds the zone.')
    id = await pickAccount(accounts)
  }
  while (!isAccountId(id)) {
    if (id) fail('An account ID is 32 hexadecimal characters.')
    note('Dashboard: Workers & Pages › the account ID is in the sidebar.')
    id = await ask('Account ID:')
  }
  if (
    existing.has(ACCOUNT) &&
    !(await confirm(`${ACCOUNT} is already set. Replace it with ${id}?`, false))
  ) {
    outcomes.push([ACCOUNT, 'kept'])
    return id
  }
  // The token step proves the ID works; the format and login are enough here.
  await store(repo, ACCOUNT, id, true)
  return id
}

async function tokenStep(
  repo: Repo,
  existing: Set<string>,
  accountId: string,
  target: Target
) {
  const zone = target.domain.split('.').slice(-2).join('.')
  heading(`2. 🔑 Cloudflare API token ${c.dim(TOKEN)}`)
  brief(
    `wrangler deploy in GitHub Actions: uploads the ${target.worker} Worker and attaches ${target.domain}.`,
    [
      {
        name: 'Account › Workers Scripts › Edit',
        why: 'upload the Worker and its static assets',
      },
      {
        name: `Zone › Workers Routes › Edit, on ${zone}`,
        why: "attach the custom domain; every later deploy reads the zone's routes",
      },
      {
        name: `Zone › Zone › Read, on ${zone}`,
        why: 'find the zone that owns the hostname',
      },
    ]
  )
  if (
    existing.has(TOKEN) &&
    !(await confirm(`${TOKEN} is already set. Enter a new one?`, false))
  ) {
    note(
      "Kept. GitHub doesn't return secret values, so it can't be checked here."
    )
    outcomes.push([TOKEN, 'kept'])
    return
  }

  let token = ''
  if (process.env.CLOUDFLARE_API_TOKEN) {
    warn('CLOUDFLARE_API_TOKEN is set in this shell. It is checked either way,')
    note('but use it only if it was minted for this deploy.')
    if (
      await confirm('Use CLOUDFLARE_API_TOKEN from the environment?', false)
    ) {
      token = process.env.CLOUDFLARE_API_TOKEN
    }
  }
  if (!token) {
    const urls = tokenUrls(`QuestLoad deploy (${repo.slug})`)
    say('  Mint one with the access above pre-filled:')
    say(
      `  🏢 Account-owned ${c.dim("(preferred: outlives any one person's access)")}`
    )
    say(`     ${c.cyan(urls.account)}`)
    say(`  👤 User-owned ${c.dim('(if you are not an account admin)')}`)
    say(`     ${c.cyan(urls.user)}`)
    note(
      `In the form, limit Zone resources to ${zone}. wrangler's OAuth login is not a token.`
    )
    await offerLink('🏢 Account-owned', urls.account)
    token = await askSecret('API token (Enter to skip):')
  }
  if (!token) {
    outcomes.push([TOKEN, 'skipped'])
    return
  }

  let verified = false
  while (true) {
    const checks = await step('Checking what the token can do', () =>
      probeToken(token, accountId, target)
    )
    for (const check of checks)
      (check.ok ? ok : fail)(`${check.label}: ${check.detail}`)
    verified = checks.every((check) => check.ok)
    if (verified) break
    note(`A wrong account ID fails the same way; re-run to pick another.`)
    if (!(await confirm('Enter a different token?', true))) break
    token = await askSecret('API token:')
  }
  if (verified) {
    const owner = await domainOwner(token, accountId, target.domain)
    if (owner && owner !== target.worker) {
      warn(
        `${target.domain} serves the ${owner} Worker; detach it before deploying.`
      )
    }
  }
  // A failed check still stores: the operator chose to keep this token.
  await store(repo, TOKEN, token, verified)
}

async function main() {
  if (!process.stdin.isTTY) {
    say('Run this in a terminal: it asks for a secret.')
    process.exitCode = 1
    return
  }
  installCleanup()
  const target = await deployTarget()
  say(
    c.bold(
      `🔐 QuestLoad deploy credentials${dryRun ? ' (dry run: nothing is stored)' : ''}`
    )
  )
  say(
    `Sets the GitHub Actions secrets that .github/workflows/deploy.yml uses to deploy ${c.bold(target.worker)} to ${c.bold(`https://${target.domain}`)}.`
  )

  heading('Preflight')
  const repo = await step('Reading the git remote', originRepo)
  if (!repo) {
    fail('origin is not a GitHub repository.')
    process.exitCode = 1
    return
  }
  const login = await step('Checking the GitHub CLI', ghLogin)
  if (!login) {
    fail(
      'The GitHub CLI is not signed in. Run `gh auth login`, then try again.'
    )
    process.exitCode = 1
    return
  }
  ok(`gh is signed in as ${login}`)
  if (
    !(await step(`Checking access to ${repo.slug}`, () =>
      canManageSecrets(repo)
    ))
  ) {
    fail(
      `${login} can't manage Actions secrets on ${repo.slug}; a repo admin has to run this.`
    )
    process.exitCode = 1
    return
  }
  ok(`Can manage Actions secrets on ${repo.slug}`)
  const existing = await step('Listing secrets', () => existingSecrets(repo))
  const set = [ACCOUNT, TOKEN].filter((name) => existing.has(name))
  note(
    set.length ? `Already set: ${set.join(', ')}` : 'No deploy secrets set yet.'
  )

  heading('Required')
  const accountId = await accountStep(repo, existing, target)
  await tokenStep(repo, existing, accountId, target)

  heading('Summary')
  const label: Record<Outcome, string> = {
    stored: c.green(dryRun ? '✓ would store' : '✓ stored'),
    unverified: c.yellow(
      dryRun ? '! would store, unverified' : '! stored, unverified'
    ),
    kept: c.dim('· kept'),
    skipped: c.yellow('· skipped'),
  }
  for (const [name, outcome] of outcomes) say(`  ${label[outcome]}  ${name}`)
  if (
    outcomes.some(
      ([, outcome]) => outcome === 'skipped' || outcome === 'unverified'
    )
  ) {
    note(
      'Deploys fail until both secrets are set and the token passes its checks.'
    )
  }
}

try {
  await main()
} finally {
  restoreTerminal()
}
