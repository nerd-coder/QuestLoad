import {
  BLUE,
  INK,
  MARK,
  markPills,
  NIGHT,
  PILL_OPACITY,
  TILE,
} from '@questload/ui/lib/logo'
import type { Outline } from './wordmark'

export type Tone = 'color' | 'white' | 'ink'

const svg = (w: number, h: number, body: string, title = 'QuestLoad') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}" width="${n(w)}" height="${n(h)}"><title>${title}</title>${body}</svg>\n`

const n = (value: number) => Number(value.toFixed(2)).toString()

const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  rest = ''
) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(rx)}"${rest}/>`

/**
 * The mark at (x, y), `scale` × the 60 × 36 grid. Color is a blue visor with
 * white pills; mono tones knock the pills out of a single-color visor, so the
 * fade survives on any background.
 */
export function mark(tone: Tone, x = 0, y = 0, scale = 1, id = 'm') {
  const t = `translate(${n(x)} ${n(y)}) scale(${n(scale)})`
  const visor = (fill: string, rest = '') =>
    rect(0, 0, MARK.width, MARK.height, MARK.radius, ` fill="${fill}"${rest}`)
  const pills = (fill: string, opacity: (o: number) => number) =>
    markPills()
      .map((p) =>
        rect(
          p.x,
          p.y,
          p.width,
          p.height,
          p.rx,
          ` fill="${fill}" fill-opacity="${n(opacity(p.opacity))}"`
        )
      )
      .join('')
  if (tone === 'color') {
    return `<g transform="${t}">${visor(BLUE)}${pills('#fff', (o) => o)}</g>`
  }
  const fill = tone === 'white' ? '#fff' : INK
  return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${MARK.width}" height="${MARK.height}">${visor('#fff')}${pills('#000', (o) => o)}</mask></defs><g transform="${t}">${visor(fill, ` mask="url(#${id})"`)}</g>`
}

export function markFile(tone: Tone) {
  return svg(MARK.width, MARK.height, mark(tone))
}

const wordFill = { color: '#fff', white: '#fff', ink: INK }

/** Horizontal lockup. `onLight` sets the color wordmark in Ink. */
export function horizontal(word: Outline, tone: Tone, onLight = false) {
  const gap = 12
  const baseline = 29
  const fill = tone === 'color' && onLight ? INK : wordFill[tone]
  const width = MARK.width + gap + word.width
  return svg(
    width,
    MARK.height,
    `${mark(tone)}<path transform="translate(${MARK.width + gap} ${baseline})" fill="${fill}" d="${word.d}"/>`
  )
}

/** Stacked lockup for square placements: avatars, splash screens. */
export function stacked(word: Outline, tone: Tone, onLight = false) {
  const gap = 10
  const fill = tone === 'color' && onLight ? INK : wordFill[tone]
  const width = Math.max(MARK.width, word.width)
  const baseline = MARK.height + gap - word.top
  const height = baseline + word.bottom
  return svg(
    width,
    height,
    `${mark(tone, (width - MARK.width) / 2)}<path transform="translate(${n((width - word.width) / 2)} ${n(baseline)})" fill="${fill}" d="${word.d}"/>`
  )
}

/** Compact tile for favicons. Pixel-fitted at 16, exact at 32 and 48. */
export function tile() {
  const pills = TILE.pillX
    .map((x, i) =>
      rect(
        x,
        TILE.pill.y,
        TILE.pill.width,
        TILE.pill.height,
        TILE.pill.width / 2,
        ` fill="#fff" fill-opacity="${PILL_OPACITY[i]}"`
      )
    )
    .join('')
  return svg(
    TILE.size,
    TILE.size,
    `${rect(0, 0, TILE.size, TILE.size, TILE.radius, ` fill="${BLUE}"`)}${pills}`
  )
}

/** The Horizon OS scene: night sky, a lit horizon, a floor. */
function environment(w: number, h: number, horizon = 0.62) {
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${NIGHT}"/><stop offset="${horizon}" stop-color="#15244A"/><stop offset="${horizon}" stop-color="#070B14"/><stop offset="1" stop-color="#070B14"/></linearGradient><radialGradient id="glow" cx="0.5" cy="${horizon}" r="0.5" gradientTransform="translate(0.5 ${horizon}) scale(1.2 0.38) translate(-0.5 -${horizon})"><stop offset="0" stop-color="${BLUE}" stop-opacity="0.45"/><stop offset="1" stop-color="${BLUE}" stop-opacity="0"/></radialGradient><filter id="float" x="-30%" y="-30%" width="160%" height="190%"><feGaussianBlur in="SourceAlpha" stdDeviation="${n(w / 64)}"/><feOffset dy="${n(w / 40)}"/><feComponentTransfer><feFuncA type="linear" slope="0.55"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="${w}" height="${h}" fill="url(#sky)"/><rect width="${w}" height="${h}" fill="url(#glow)"/>`
}

/**
 * App icon: the mark floating over the environment. `rounded` gives the
 * transparent-corner "any" icon; otherwise full bleed for iOS and maskable.
 */
export function appIcon(rounded: boolean) {
  const size = 1024
  const markWidth = 600
  const scale = markWidth / MARK.width
  const x = (size - markWidth) / 2
  const y = (size - MARK.height * scale) / 2 - 24
  const clip = rounded
    ? `<clipPath id="tile"><rect width="${size}" height="${size}" rx="${size * 0.225}"/></clipPath>`
    : ''
  const body = `${environment(size, size)}<g filter="url(#float)">${mark('color', x, y, scale)}</g>`
  return svg(
    size,
    size,
    rounded ? `<defs>${clip}</defs><g clip-path="url(#tile)">${body}</g>` : body
  )
}

/** 1200 × 630 social card. */
export function socialCard(word: Outline, tagline: Outline) {
  const w = 1200
  const h = 630
  const scale = 3.2
  const lockupWidth = (MARK.width + 12 + word.width) * scale
  const x = (w - lockupWidth) / 2
  const y = 196
  const tagX = (w - tagline.width) / 2
  return svg(
    w,
    h,
    `${environment(w, h, 0.7)}<g filter="url(#float)">${mark('color', x, y, scale)}</g><path transform="translate(${n(x + (MARK.width + 12) * scale)} ${n(y + 29 * scale)}) scale(${scale})" fill="#fff" d="${word.d}"/><path transform="translate(${n(tagX)} ${n(y + MARK.height * scale + 92)})" fill="#A8B3C2" d="${tagline.d}"/>`
  )
}
