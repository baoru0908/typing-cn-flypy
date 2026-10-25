# CraneType 鹤键

A Chinese typing trainer for full pinyin and Xiaohe double pinyin. Four modes, 40 themes, fully self-hosted fonts, and a single-file offline build.

**Live demo → https://baoru0908.github.io/typing-cn-flypy/** · [中文](README.md)

## Four modes

| Mode        | Route     | Description                                                                       |
| ----------- | --------- | --------------------------------------------------------------------------------- |
| **Chinese** | `/monkey`  | Full pinyin / Xiaohe double pinyin, two keys per character, auto-advance, character-by-character highlighting |
| **English** | `/english` | 33 passages (15 short / 10 medium / 8 long), with a "next passage" button          |
| **Code**    | `/code`    | 30 snippets across 10 languages, up to 37 lines, indentation and blank lines preserved |
| **Custom**  | `/custom`  | Paste any text; it persists in localStorage across reloads                         |

The Chinese mode keeps the original word-assembly logic: **the code line and the hanzi line are two independent rows**, each evenly spaced, so hanzi spacing never depends on pinyin length. English / code / custom share one engine (`src/components/typingArea/TypingArea.tsx`) with per-character judging, backspace correction, newline and tab support, live WPM / accuracy / elapsed time, and a result card when you finish.

## Also included

- **40 themes** — dark/light in pairs (`nord.css` ↔ `nord-light.css`), all passing contrast checks; includes Nord, Gruvbox, Solarized, Catppuccin, Tokyo Night, Rose Pine, One and more
- **Two hanzi typefaces** — Source Han Sans (default) / LXGW WenKai, switchable in settings; both are split by `unicode-range` so the browser only fetches the characters actually on screen, and the unused family issues zero requests
- **Three size steps** — default / large / x-large, coupled to the typeface (the kai variant gets a larger size and positive tracking automatically)
- **Never triggers the system IME** — the hidden input is `readOnly`, so any pinyin / double-pinyin IME keeps working without a candidate window
- **Offline** — the single-file build is one HTML you can double-click, with fonts trimmed to the real character set and inlined

## Getting started

```bash
npm install
npm run dev
```

| Command                | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Dev server                                                     |
| `npm run build`        | Build to `dist/` for a GitHub Pages sub-path                 |
| `npm run build-nobase` | Build to `dist/` for a root domain / OSS / Cloudflare        |
| `npm run build-single` | Bundle one standalone HTML file at `../typing-cn-小鹤双拼.html` |
| `npm run deploy`       | Build and publish to GitHub Pages                              |
| `npm test`             | Double-pinyin encoding sample test                             |
| `npm run lint`         | Lint                                                           |

## Deploying

Published on the `gh-pages` branch: `scripts/deploy.js` runs `git init` in a temp directory → one commit → force push, so the branch always holds exactly one commit (the `gh-pages` package is deliberately avoided — it would stack a ~14MB commit on every release).

Three things that must be right:

1. `PAGES_REPO` in `vite.config.ts` must match the repository name exactly, or `/assets` `/fonts` `/themes` all 404. Vite rewrites the absolute paths under `public/` to `<base>/fonts/...` too, so this one constant is enough.
2. The CSS under `public/` (`fonts/shs.css`, `fonts/lxgw.css`) **must use relative URLs** — absolute paths make fonts silently fall back under a sub-path deploy.
3. `deploy.js` ignores the global git config and forces SSH. A local `url.https://github.com/.insteadof` rule rewrites SSH to HTTPS, and 14MB of fonts over an HTTPS proxy returns 502.

## How it is built

- `src/styles/tokens.less` is the single source for font sizes, tracking and colours; components never hardcode them. Semantic variables derive from each theme's existing `--bg-color` / `--primary-color`, so all 40 themes adapt without per-theme edits
- Three font roles: Inter for UI and English prose, JetBrains Mono for code and pinyin codes, Source Han Sans / LXGW WenKai for hanzi
- The CJK fonts are split into 202 `unicode-range` slices fetched on demand; the single-file build trims them again using the real character set collected by `scripts/font-charset.js`
- Theme CSS stays out of the main bundle and is switched by swapping a `<link>` href; the single-file build embeds every theme in `window.__THEMES__` instead
- The single-file build inlines only Source Han Sans — all 97 LXGW WenKai slices are ~5.9MB as base64, and both families would push the HTML to 12MB; the settings panel hides the family that is not bundled, so no dead options

Built on top of [barneyzhao/typing-cn](https://github.com/barneyzhao/typing-cn).
