<div align="center">

# QuestLoad

**QuestLoad** is a browser‑based sideloader for Meta Quest headsets. It lets you install custom APKs on the Meta Quest directly from your web browser. Developer mode must be enabled on your headset.

This fork is maintained by Toàn. QuestLoad was created by [Frizzle](https://github.com/FrizzleM/QuestLoad).

<br/>
  <a href="https://questload.nerdcoder.dev">
    <img alt="Launch QuestLoad" src="https://img.shields.io/badge/Launch-Open%20App-6cb6ff?style=for-the-badge">
  </a>
  
  <a href="https://github.com/nerd-coder/QuestLoad/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/nerd-coder/QuestLoad?style=for-the-badge&color=ef4444">
  </a>

</div>

<img width="1030" alt="QuestLoad installing a game bundle on a connected Quest 3" src="docs/screenshot.png" />

## Requirements

- Meta Quest headset (2, 3, 3s, Pro)
- Developer mode enabled on your headset
- Browser with WebUSB support (Chrome, Edge, ect.)

## Quick Start

Follow these steps to sideload an app:

### 1. Launch QuestLoad
Open [questload.nerdcoder.dev](https://questload.nerdcoder.dev).

### 2. Connect your Quest
Plug your Quest into the computer and click **Connect Quest**. Pick the headset in your browser's device list, then put on the headset and select **Allow** on the USB debugging prompt. QuestLoad shows the headset model once it's connected.

### 3. Choose what to install
Under **Choose what to install**, pick one. You can do this before or after connecting.
- **APK**: drop an `.apk` file on the **Drop an APK here** tile, or click the tile to choose one.
- **Bundle folder**: for games with OBB files, click **Choose a bundle folder** and select a folder with one APK at its top level and an OBB folder named after the package. QuestLoad checks the layout as soon as you pick it:

  ```text
  bundle/
  ├── com.CMGames.IntoTheRadius.apk
  └── com.CMGames.IntoTheRadius/
      ├── main.161562.com.CMGames.IntoTheRadius.obb
      └── patch.161562.com.CMGames.IntoTheRadius.obb
  ```

### 4. Install
Click **Install APK** or **Install bundle**. The progress bar and the **Activity** log show each step.

### 5. Launch the app on your Quest
After the install finishes, go to **Apps → Unknown Sources** on your headset and launch the app. When you're done, click **Disconnect** in QuestLoad.

## Future updates
- Ability to export games from the headset

## Games source

QuestLoad loads its games list from a source with this shape:

```json
{
  "url": "https://example.com/api/games",
  "password": "replace-this-password"
}
```

It requests `url` with the password in the `x-api-password` header.

In the app, click **Games source** in the top bar and paste either the config JSON or a link to a
JSON file holding it. QuestLoad checks the source by loading its games, then saves it in the
browser's local storage for later visits. **Remove** forgets it.

With nothing saved, the app uses `apps/web/public/games-source.json`, the site's default. A link
or `url` must use `https://`, and the server must allow requests from the QuestLoad site (CORS).

## For offline usage

The web installer is built with **Vite + React**, using Bun, TanStack Query, and TanStack Store. To run it locally:

```bash
git clone https://github.com/nerd-coder/QuestLoad.git
cd QuestLoad
bun install
bun run dev
bun run build
bun run preview
```

`bun run dev:brand` serves the design system preview (`apps/brand`). The shared tokens and components live in `packages/ui`.

## Cloudflare Workers deployment

Pushes to `main` deploy `apps/web` as Cloudflare Worker static assets at
[questload.nerdcoder.dev](https://questload.nerdcoder.dev), through `.github/workflows/deploy.yml`.
The `nerdcoder.dev` zone must be on the same Cloudflare account as the Worker; Cloudflare creates
the DNS record and certificate on the first deploy.

The workflow needs two GitHub Actions secrets, `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`.
Set them with:

```bash
bun run credentials
```

It reads your `gh` and `wrangler` logins, explains what the token must be allowed to do, links to a
pre-filled token form, checks the token against Cloudflare, and stores both secrets on this repository.
