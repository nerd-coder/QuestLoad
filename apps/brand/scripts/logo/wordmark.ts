import { parse } from 'opentype.js'

const fontFile = (weight: 400 | 700) =>
  Bun.resolveSync(
    `@fontsource/figtree/files/figtree-latin-${weight}-normal.woff`,
    import.meta.dir
  )

export type Outline = {
  d: string
  /** Advance width of the set text, in output units. */
  width: number
  /** Ink bounds relative to the baseline origin. */
  top: number
  bottom: number
}

/**
 * Sets `text` in Figtree and returns it as one outlined path, so logo files
 * never depend on the font being installed. Units are output units, with
 * the baseline at y = 0.
 */
export async function outline(
  text: string,
  {
    capHeight,
    weight = 700,
    tracking = 0,
  }: { capHeight: number; weight?: 400 | 700; tracking?: number }
): Promise<Outline> {
  const buffer = await Bun.file(fontFile(weight)).arrayBuffer()
  const font = parse(buffer)
  const fontSize = (capHeight * font.unitsPerEm) / font.tables.os2.sCapHeight
  const scale = fontSize / font.unitsPerEm
  const glyphs = font.stringToGlyphs(text)

  let x = 0
  const parts: string[] = []
  let top = 0
  let bottom = 0
  glyphs.forEach((glyph, i) => {
    const path = glyph.getPath(x, 0, fontSize)
    const box = path.getBoundingBox()
    top = Math.min(top, box.y1)
    bottom = Math.max(bottom, box.y2)
    parts.push(path.toPathData(2))
    const next = glyphs[i + 1]
    const kern = next ? font.getKerningValue(glyph, next) : 0
    x +=
      ((glyph.advanceWidth ?? 0) + kern) * scale +
      (next ? tracking * fontSize : 0)
  })
  return { d: parts.join(''), width: x, top, bottom }
}
