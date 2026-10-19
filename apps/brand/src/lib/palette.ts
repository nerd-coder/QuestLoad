export type Swatch = {
  name: string
  hex: string
  role: string
  /** Contrast of the swatch's text pairing, WCAG 2 ratio. */
  contrast: string
  ink: 'light' | 'dark'
}

export const brandSwatches: Swatch[] = [
  {
    name: 'Meta Blue',
    hex: '#0866FF',
    role: 'Primary actions, progress, the logo. Text uses --link: #0559DE in light mode, Beam in dark.',
    contrast: '4.8:1 with white',
    ink: 'light',
  },
  {
    name: 'Beam',
    hex: '#5AA0FF',
    role: 'Links and blue text on dark glass, where Meta Blue is too deep.',
    contrast: '6.2:1 on Panel',
    ink: 'dark',
  },
  {
    name: 'Horizon Night',
    hex: '#0B1222',
    role: 'The dark environment behind every panel.',
    contrast: '18.7:1 with white',
    ink: 'light',
  },
  {
    name: 'Panel',
    hex: '#1A1F2B',
    role: 'Dark glass at 78% over the environment, blurred 40px.',
    contrast: '16.5:1 with white',
    ink: 'light',
  },
  {
    name: 'Ink',
    hex: '#1C2B33',
    role: "Meta's text slate. Body text in light mode, selected pills.",
    contrast: '13.2:1 on Wash',
    ink: 'light',
  },
  {
    name: 'Wash',
    hex: '#F1F4F7',
    role: 'The daylight environment. Panels on it are white glass.',
    contrast: '13.2:1 with Ink',
    ink: 'dark',
  },
]

export const signalSwatches: Swatch[] = [
  {
    name: 'Connected',
    hex: '#31A24C',
    role: 'Headset connected, install finished. Text tone #4CC765 dark, #237A3A light.',
    contrast: '5.7:1 on Night',
    ink: 'dark',
  },
  {
    name: 'Waiting',
    hex: '#F7B928',
    role: 'Waiting on the headset. Text tone #8F6400 in light mode.',
    contrast: '10.6:1 on Night',
    ink: 'dark',
  },
  {
    name: 'Fault',
    hex: '#E41E3F',
    role: 'Failed install, lost connection. Text tone #FF8394 in dark mode.',
    contrast: '4.6:1 on white',
    ink: 'light',
  },
]

/** Semantic tokens, rendered live from theme.css in both modes. */
export const semanticTokens = [
  ['--background', 'Environment base'],
  ['--card', 'Panel glass'],
  ['--popover', 'Raised: menus, dialogs'],
  ['--primary', 'Primary action fill'],
  ['--secondary', 'Secondary pill fill'],
  ['--muted-foreground', 'Supporting text'],
  ['--link', 'Links, blue text'],
  ['--selected', 'Selected tab, active pill'],
  ['--success', 'Connected text'],
  ['--warning', 'Waiting text'],
  ['--destructive', 'Fault text'],
  ['--ring', 'Focus halo'],
] as const
