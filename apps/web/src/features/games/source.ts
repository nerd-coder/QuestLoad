// A games source is { url, password }: QuestLoad requests `url` with the
// password in the x-api-password header. Users paste the config itself, or a
// link to a JSON file holding it.

export type GameSource = { url: string; password: string }

/** A config that parsed but whose games request failed; it can still be saved. */
export class UncheckedSource extends Error {
  constructor(
    message: string,
    readonly source: GameSource,
    readonly from: string | null
  ) {
    super(message)
  }
}

// The app is served over https; an http link would be blocked as mixed content.
const allowsHttp = () => location.protocol === 'http:'

function toLink(value: string, what: string) {
  let link: URL
  try {
    link = new URL(value)
  } catch {
    throw new Error(`${what} must be a full link, starting with https://.`)
  }
  const httpOk = link.protocol === 'http:' && allowsHttp()
  if (link.protocol !== 'https:' && !httpOk) {
    throw new Error(`${what} must start with https://.`)
  }
  return link
}

/** Validates the schema. Extra fields are ignored. */
export function parseSource(value: unknown): GameSource {
  const config = value as Partial<Record<'url' | 'password', unknown>> | null
  if (
    !config ||
    typeof config !== 'object' ||
    typeof config.url !== 'string' ||
    typeof config.password !== 'string'
  ) {
    throw new Error('The config needs "url" and "password", both as text.')
  }
  return {
    url: toLink(config.url, 'The "url"').href,
    password: config.password,
  }
}

const unreachable = (link: URL) =>
  `Couldn't reach ${link.host}. Check the link, and that the server allows requests from this site.`

/** Reads pasted text: the config JSON itself, or a link that serves it. */
export async function readSource(
  text: string
): Promise<{ source: GameSource; from: string | null }> {
  const input = text.trim()
  if (!input) throw new Error('Paste the config JSON, or a link to it.')
  if (input.startsWith('{')) {
    let json: unknown
    try {
      json = JSON.parse(input)
    } catch {
      throw new Error(
        "That isn't valid JSON. Check for a missing quote or comma."
      )
    }
    return { source: parseSource(json), from: null }
  }
  const link = toLink(input, 'A link')
  let response: Response
  try {
    response = await fetch(link, { cache: 'no-store' })
  } catch {
    throw new Error(unreachable(link))
  }
  if (!response.ok) {
    throw new Error(`${link.host} answered ${response.status} for that link.`)
  }
  let json: unknown
  try {
    json = await response.json()
  } catch {
    throw new Error("That link didn't return JSON.")
  }
  return { source: parseSource(json), from: link.href }
}

/** The games list behind a source. */
export async function fetchGames(source: GameSource): Promise<unknown> {
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

/** Parses and then checks a source by loading its games. */
export async function checkSource(text: string) {
  const { source, from } = await readSource(text)
  try {
    return { source, from, games: await fetchGames(source) }
  } catch (error) {
    throw new UncheckedSource((error as Error).message, source, from)
  }
}

export function gameCount(games: unknown) {
  return Array.isArray(games) ? games.length : null
}
