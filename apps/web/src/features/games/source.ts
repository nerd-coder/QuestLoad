// A games source is a URL and a password: QuestLoad requests the URL with the
// password in the x-api-password header and expects the games list as JSON.

export type SourceInput = { url: string; password: string }

/** A source that parsed but whose games request failed; it can still be added. */
export class UncheckedSource extends Error {
  constructor(
    message: string,
    readonly source: SourceInput
  ) {
    super(message)
  }
}

// The app is served over https; an http URL would be blocked as mixed content.
const allowsHttp = () => location.protocol === 'http:'

/** Checks the URL and returns the source with the URL normalized. */
export function validateSource({ url, password }: SourceInput): SourceInput {
  let link: URL
  try {
    link = new URL(url.trim())
  } catch {
    throw new Error('Enter the full URL, starting with https://.')
  }
  const httpOk = link.protocol === 'http:' && allowsHttp()
  if (link.protocol !== 'https:' && !httpOk) {
    throw new Error('The URL must start with https://.')
  }
  return { url: link.href, password }
}

/** Reads a pasted JSON config into URL and password. Extra fields are ignored. */
export function parseConfig(text: string): SourceInput {
  let json: unknown
  try {
    json = JSON.parse(text.trim())
  } catch {
    throw new Error(
      "That isn't valid JSON. Check for a missing quote or comma."
    )
  }
  const config = json as Partial<Record<'url' | 'password', unknown>> | null
  if (
    !config ||
    typeof config !== 'object' ||
    typeof config.url !== 'string' ||
    typeof config.password !== 'string'
  ) {
    throw new Error('The JSON needs "url" and "password", both as text.')
  }
  return { url: config.url, password: config.password }
}

const unreachable = (link: URL) =>
  `Couldn't reach ${link.host}. Check the URL, and that the server allows requests from this site.`

/** The games list behind a source. */
export async function fetchGames(source: SourceInput): Promise<unknown> {
  const link = new URL(source.url)
  let response: Response
  try {
    response = await fetch(link, {
      headers: { 'x-api-password': source.password },
    })
  } catch {
    throw new Error(unreachable(link))
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error(`${link.host} refused the password.`)
  }
  if (!response.ok) {
    throw new Error(`${link.host} answered ${response.status}.`)
  }
  try {
    return await response.json()
  } catch {
    throw new Error(`${link.host} didn't return JSON.`)
  }
}

/** Validates a source, then checks it by loading its games. */
export async function checkSource(input: SourceInput) {
  const source = validateSource(input)
  try {
    return { source, games: await fetchGames(source) }
  } catch (error) {
    throw new UncheckedSource((error as Error).message, source)
  }
}

export function gameCount(games: unknown) {
  return Array.isArray(games) ? games.length : null
}

/** Host and path, enough to tell sources apart in a list. */
export function sourceLabel(url: string) {
  const link = new URL(url)
  const path = link.pathname === '/' ? '' : link.pathname
  return `${link.host}${path}`
}
