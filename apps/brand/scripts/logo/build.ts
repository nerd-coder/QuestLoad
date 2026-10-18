// Exports every QuestLoad logo file from src/lib/logo.ts.
// Run with `bun run logo` in apps/brand. Needs rsvg-convert (librsvg) and
// magick (ImageMagick) on PATH for the PNG and ICO files.
import { mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  appIcon,
  horizontal,
  markFile,
  socialCard,
  stacked,
  type Tone,
  tile,
} from './svg'
import { outline } from './wordmark'

const root = join(import.meta.dir, '../../public')
const out = join(root, 'logo')
const tmp = join(tmpdir(), 'questload-logo')

const word = await outline('QuestLoad', { capHeight: 22, tracking: -0.02 })
const smallWord = await outline('QuestLoad', { capHeight: 16, tracking: -0.02 })
const tagline = await outline(
  'Install apps on your Meta Quest, straight from the browser.',
  {
    capHeight: 26,
    weight: 400,
  }
)

await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })
await mkdir(tmp, { recursive: true })

const files: Record<string, string> = {
  'questload-mark.svg': markFile('color'),
  'questload-logo-on-dark.svg': horizontal(word, 'color'),
  'questload-logo-on-light.svg': horizontal(word, 'color', true),
  'questload-stacked-on-dark.svg': stacked(smallWord, 'color'),
  'questload-stacked-on-light.svg': stacked(smallWord, 'color', true),
  'questload-app-icon.svg': appIcon(false),
  'questload-tile.svg': tile(),
  'questload-social.svg': socialCard(word, tagline),
}
for (const tone of ['white', 'ink'] satisfies Tone[]) {
  files[`questload-mark-${tone}.svg`] = markFile(tone)
  files[`questload-logo-${tone}.svg`] = horizontal(word, tone)
  files[`questload-stacked-${tone}.svg`] = stacked(smallWord, tone)
}
for (const [name, content] of Object.entries(files)) {
  await Bun.write(join(out, name), content)
}

async function run(cmd: string[]) {
  const proc = Bun.spawn(cmd, { stderr: 'pipe' })
  if ((await proc.exited) !== 0) {
    throw new Error(
      `${cmd[0]} failed: ${await new Response(proc.stderr).text()}`
    )
  }
}

/** Rasterize an SVG string to a PNG `width` pixels wide. */
async function png(svgContent: string, width: number, dest: string) {
  const src = join(tmp, 'in.svg')
  await Bun.write(src, svgContent)
  await run(['rsvg-convert', '-w', String(width), src, '-o', dest])
}

const roundedIcon = appIcon(true)
await png(
  files['questload-app-icon.svg'],
  1024,
  join(out, 'questload-app-icon.png')
)
await png(
  files['questload-social.svg'],
  1200,
  join(out, 'questload-social.png')
)
for (const name of [
  'questload-logo-on-dark',
  'questload-logo-on-light',
  'questload-logo-white',
  'questload-logo-ink',
]) {
  await png(files[`${name}.svg`], 1200, join(out, `${name}.png`))
}

// Favicon set, written to the public root where browsers look for it.
await Bun.write(join(root, 'favicon.svg'), tile())
const sizes = [16, 32, 48]
for (const size of sizes) await png(tile(), size, join(tmp, `tile-${size}.png`))
await run([
  'magick',
  ...sizes.map((s) => join(tmp, `tile-${s}.png`)),
  join(root, 'favicon.ico'),
])
await png(
  files['questload-app-icon.svg'],
  180,
  join(root, 'apple-touch-icon.png')
)
await png(roundedIcon, 192, join(root, 'icon-192.png'))
await png(roundedIcon, 512, join(root, 'icon-512.png'))
await png(
  files['questload-app-icon.svg'],
  512,
  join(root, 'icon-maskable-512.png')
)

await rm(tmp, { recursive: true, force: true })
await Bun.write(
  Bun.stdout,
  `Wrote ${Object.keys(files).length} SVGs, PNGs and the favicon set to ${root}` +
    '\n'
)
