# CraneType 鹤键

A Chinese typing trainer for full pinyin and Xiaohe double pinyin. Four modes, 40 themes, fully self-hosted fonts, and a single-file offline build.

**Live demo → https://baoru0908.github.io/typing-cn-flypy/** · [中文](README.md)

## What it does

| Mode           | Description                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| **Chinese**    | Full pinyin / Xiaohe double pinyin, two keys per character, auto-advance, character-by-character highlighting |
| **English**    | 33 passages across short / medium / long, with a "next passage" button                    |
| **Code**       | 30 snippets in 10 languages (JS/TS/Python/Java/C/Go/Rust/Shell/SQL/HTML), indentation preserved |
| **Custom**     | Paste any text; it persists locally across reloads                                        |

Also:

- **Live stats** — WPM, accuracy, elapsed time, plus a result screen when you finish
- **40 themes** — dark/light in pairs, all passing contrast checks; includes Nord, Gruvbox, Solarized, Catppuccin and more
- **Two hanzi typefaces** — Source Han Sans (default) / LXGW WenKai, switchable in settings
- **Three size steps** — default / large / x-large
- **Works with any IME installed** — the hidden input is `readOnly`, so the system IME never intercepts keys
- **Offline** — the single-file build is one HTML you can double-click

## Getting started

```bash
npm install
npm run dev
```

| Command                | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run build`        | Build to `dist/` for a GitHub Pages sub-path       |
| `npm run build-nobase` | Build to `dist/` for a root domain                 |
| `npm run build-single` | Bundle one standalone HTML file (written outside the repo) |
| `npm run deploy`       | Build and publish to GitHub Pages                  |
| `npm test`             | Double-pinyin encoding test                        |
| `npm run lint`         | Lint                                               |

## Deploy

Published on the `gh-pages` branch (single commit, force-pushed, so the branch always holds exactly one commit).

> `PAGES_REPO` in `vite.config.ts` must match the repository name, and CSS under `public/` must use relative URLs. Getting either wrong yields a blank page or silently fallen-back fonts.

## How it is built

- `src/styles/tokens.less` is the single source for font sizes, tracking and colours; components never hardcode them
- In the Chinese mode the **code line and the hanzi line are two independent rows**, each evenly spaced, so hanzi spacing never depends on pinyin length
- CJK fonts are split into ~200 slices via `unicode-range`; the browser only downloads slices for characters actually on screen
- Theme CSS stays out of the main bundle and is loaded by swapping a `<link>`

Built on top of [barneyzhao/typing-cn](https://github.com/barneyzhao/typing-cn).
