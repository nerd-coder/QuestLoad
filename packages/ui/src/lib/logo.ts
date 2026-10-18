// QuestLoad mark geometry: the Quest 3 visor with its three sensor pills,
// fading left to right like a load in progress. Shared by the React
// components and scripts/logo, which exports every logo file from it.

export const BLUE = '#0866FF'
export const INK = '#1C2B33'
export const NIGHT = '#0B1222'

/** Pill opacity, left to right: done, in progress, waiting. */
export const PILL_OPACITY = [1, 0.65, 0.35] as const

/** Primary mark, drawn tight to the visor on a 60 × 36 grid. */
export const MARK = {
  width: 60,
  height: 36,
  radius: 15,
  pill: { width: 7, height: 18, y: 9 },
  pillCenters: [14, 30, 46],
} as const

/** Compact mark for 16–48px: the tile is the visor, pixel-fitted to 16 × 16. */
export const TILE = {
  size: 16,
  radius: 4,
  pill: { width: 2, height: 8, y: 4 },
  pillX: [3, 7, 11],
} as const

export function markPills() {
  return MARK.pillCenters.map((cx, i) => ({
    x: cx - MARK.pill.width / 2,
    y: MARK.pill.y,
    width: MARK.pill.width,
    height: MARK.pill.height,
    rx: MARK.pill.width / 2,
    opacity: PILL_OPACITY[i],
  }))
}
