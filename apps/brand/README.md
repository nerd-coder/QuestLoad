# QuestLoad design system

QuestLoad should look like it shipped with the headset. The system follows Meta Quest's
Horizon OS: glass panels floating over an environment, pill-shaped actions, calm type, and a
white focus halo. Dark ("in-headset") is the default; light ("passthrough daylight") mirrors it.

`bun run dev:brand` from the repo root serves the live preview of every token, component and
pattern below.

## Where things live

The shared pieces live in `packages/ui` (`@questload/ui`) so every app can use them; this app
is the live preview and the logo exporter.

| Path | What |
|---|---|
| `packages/ui/src/theme.css` | Every token: semantic colors per mode, type scale, radius, depth, easing |
| `packages/ui/src/styles.css` | Tailwind entry, base layer, and the `environment`, `glass`, `lift`, `spawn` utilities. Apps import `@questload/ui/styles.css` |
| `packages/ui/src/components/` | shadcn/ui (base-nova, Base UI) restyled to the rules below, plus `logo.tsx` |
| `packages/ui/components.json` | shadcn config: style `base-nova`, Lucide icons, `@questload/ui/*` aliases |
| `src/patterns/` | QuestLoad compositions: device status, drop zone, installer, library |
| `src/sections/` | The preview page |
| `scripts/logo/` | `bun run logo`: exports every logo, icon and favicon file |

## Principles

1. **Panels float, the page doesn't.** Content sits on glass panels above the environment.
   Only section headings sit directly on the scene.
2. **Shape says what a thing is.** Pills act. Rounded rectangles hold or take input.
   Nothing else is a pill, so users can find every action at a glance.
3. **Pressables lift toward you.** Buttons and tiles scale to 103% on hover and 97% on press,
   like a ray-cast target in Horizon OS. Containers never move.
4. **Name the next physical step.** Copy tells people what to do with the headset or cable,
   not what the protocol is doing.

## Logo

The mark is the Quest 3 visor with its three front sensors, fading left to right (100, 65, 35%
white) like a load in progress. It is original: it references the hardware, never Meta's ∞ logo
or the Meta Quest wordmark. Geometry lives in `packages/ui/src/lib/logo.ts`; `bun run logo` regenerates every
file below from it (needs `rsvg-convert` and `magick` on PATH).

| File (in `public/`) | Use |
|---|---|
| `logo/questload-logo-on-dark.svg`, `-on-light.svg` | Default horizontal lockups |
| `logo/questload-logo-white.svg`, `-ink.svg` | Single color: white on Meta Blue or photos, Ink for print |
| `logo/questload-stacked-*.svg` | Square placements: avatars, splash screens |
| `logo/questload-mark*.svg` | The mark alone, in color, white or Ink |
| `logo/questload-app-icon.svg`, `.png` | 1024px app icon, mark over the Horizon environment |
| `logo/questload-social.png` | 1200 × 630 link preview |
| `favicon.svg`, `favicon.ico` | The tile: the visor seen up close, pixel-fitted to 16px |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Home screen and PWA icons |

- Clear space on every side equals one sensor's height. Lockup at least 20px tall, mark at least 24px.
- Below 48px use the tile; the visor's sensors blur together.
- Keep the fade left to right. Use the white mark on Meta Blue. Never pair it with Meta's logo.
- `LogoLoader` animates the sensors in sequence for waiting states and holds the static fade
  under `prefers-reduced-motion`.
- `apps/web/public` carries a copy of the favicon and home-screen set; re-copy it after `bun run logo`.

## Color

| Name | Hex | Role |
|---|---|---|
| Meta Blue | `#0866FF` | Primary actions, progress, logo. White text on it is 4.8:1. As text, light mode only |
| Beam | `#5AA0FF` | Links and blue text on dark glass (6.2:1 on Panel) |
| Horizon Night | `#0B1222` | Dark environment |
| Panel | `#1A1F2B` | Dark glass at 78%, `backdrop-filter: blur(40px)` |
| Ink | `#1C2B33` | Light-mode text, selected pills (13.2:1 on Wash) |
| Wash | `#F1F4F7` | Light environment; panels on it are white glass |
| Connected | `#31A24C` | Text tone `#4CC765` dark, `#237A3A` light |
| Waiting | `#F7B928` | Text tone `#F7B928` dark, `#8F6400` light |
| Fault | `#E41E3F` | Text tone `#FF6B7F` dark, `#E41E3F` light |

Components read semantic tokens only (`--primary`, `--card`, `--link`, `--selected`,
`--success`, `--warning`, `--destructive`, …). Every text pairing is WCAG AA or better.

## Type

Figtree Variable stands in for Meta's Optimistic. Geist Mono is only for things users might copy:
package names, paths, logs, fingerprints.

| Role | Size / leading | Weight | Tailwind |
|---|---|---|---|
| Display | 72/72, -4% | Bold | `text-7xl font-bold tracking-[-0.04em]` |
| Headline | 36/40, -2.5% | Bold | `text-4xl font-bold tracking-[-0.025em]` |
| Title | 24/30, -1% | Semibold | `text-2xl font-semibold tracking-tight` |
| Heading | 18/26 | Semibold | `text-lg font-semibold` |
| Body | 16/24 | Regular | `text-base` |
| Supporting | 14/20 | Regular, muted | `text-sm text-muted-foreground` |
| Code | 13/20 | Geist Mono | `font-mono text-[0.8125rem]` |

The scale is the classic 12, 14, 16, 18, 21, 24, 36, 48, 72, mapped onto Tailwind's
default size names (`text-xl` is 21px) so `cn()` merges them correctly. Bold only at 36px and up.

## Shape and depth

| Tier | Radius | Tailwind | Used for |
|---|---|---|---|
| Panel | 28px | `rounded-3xl` | Panels, dialogs |
| Tile | 20px | `rounded-xl` | Nested surfaces, covers, alerts, swatches |
| Control | 14px | `rounded-lg` | Inputs, select triggers |
| Pill | full | `rounded-full` | Buttons, badges, tabs, switches, tooltips |

| Depth | Surface | Shadow |
|---|---|---|
| Environment | `environment` utility | none |
| Panel | `glass` (or `bg-card`) | `shadow-xl` |
| Raised | `bg-popover` (menus, selects) | `shadow-lg` |
| Overlay | `bg-popover` over a 45% scrim (dialogs) | `shadow-2xl` |

Shadows carry a 1px inner top highlight, so glass reads as an edge-lit sheet. Tailwind's default
`shadow-*` and `rounded-*` names are reused on purpose, again so `cn()` can merge overrides.

## Interaction

- Targets are 44px by default (`h-11`), 36px at `sm`.
- Focus is a 2px solid `--ring` outline, offset 2px: white in dark mode, Meta Blue in light.
  Under Tailwind v4, `outline-none` sets the outline style to none, so a focus utility needs
  `focus-visible:outline-solid` alongside `focus-visible:outline-2`.
- Motion: `lift` is 160ms, `spawn` is 520ms, both on `cubic-bezier(.2, .8, .2, 1)`.
  `spawn` is reserved for a window opening. Both turn off under `prefers-reduced-motion`.

## Voice

Calm, specific, sentence case. No emoji, no exclamation marks.

| Write | Not |
|---|---|
| Connect Quest | Initialize ADB session |
| Put on your headset and select Allow | Awaiting RSA authorization |
| Open QuestLoad in Chrome or Edge to connect your Quest | Error: navigator.usb is undefined |
| Installed Into the Radius | Success! |

A button's verb carries through: **Install APK** → "Installing" → "Installed".

QuestLoad is not affiliated with Meta. Meta Quest and Horizon OS are trademarks of Meta Platforms, Inc.
