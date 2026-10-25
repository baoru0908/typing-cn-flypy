# 鹤键 CraneType

中文全拼 / 小鹤双拼打字练习。四种模式、40 套主题、字体全部自托管，可打包成单个离线 HTML 文件。

**在线体验 → https://baoru0908.github.io/typing-cn-flypy/** · [English](README.en.md) · [更新日志](CHANGELOG.md)

## 四种模式

| 模式         | 路由       | 说明                                                                       |
| ------------ | ---------- | -------------------------------------------------------------------------- |
| **中文词拼** | `/monkey`  | 全拼 / 小鹤双拼，两键一字，打满自动上词，汉字随拼音逐字点亮                   |
| **英文**     | `/english` | 33 条语料（短句 15 / 段落 10 / 长文 8），三档长度，可「换一段」              |
| **代码**     | `/code`    | 10 种语言 × 3 例共 30 段，最长 37 行，保留缩进与空行，可「换一题」           |
| **自定义**   | `/custom`  | 任意文本，存 localStorage，刷新不丢                                        |

中文模式沿用原版的词拼逻辑：**编码行与汉字行是两条独立的行**，各自等距排列，所以汉字间距不会被长短不一的拼音拉歪。英文 / 代码 / 自定义共用同一套打字引擎 `src/components/typingArea/TypingArea.tsx`，逐字符判定、支持退格修正、换行与制表符，实时刷新 WPM / 正确率 / 用时，打完出成绩卡。

## 其他能力

- **40 套主题** — 深浅成对（`nord.css` ↔ `nord-light.css`），对比度全部达标；含 Nord、Gruvbox、Solarized、Catppuccin、Tokyo Night、Rose Pine、One 等
- **两套汉字字体** — 思源黑体（默认）/ 霞鹜文楷，设置里一键切换；两套都按 `unicode-range` 分片，只下载页面实际出现的字，未选用的那套零请求
- **三档字号** — 标准 / 大 / 特大，与字族联动（楷体笔画细，自动配套更大的字号和正字距）
- **不唤起系统输入法** — 隐藏输入框是 `readOnly`，装了拼音 / 双拼输入法也能正常练，不会弹候选窗
- **离线可用** — 单文件版一个 HTML，双击即开，字体按实际字符集裁剪后内联

## 快速开始

```bash
npm install
npm run dev
```

| 命令                   | 说明                                                  |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | 开发服务器                                            |
| `npm run build`        | 构建到 `dist/`（GitHub Pages 子路径）                 |
| `npm run build-nobase` | 构建到 `dist/`（根域名 / OSS / Cloudflare）            |
| `npm run build-single` | 打包单文件 HTML，产出 `../typing-cn-小鹤双拼.html`     |
| `npm run deploy`       | 构建并发布到 GitHub Pages                             |
| `npm test`             | 双拼编码抽样测试                                      |
| `npm run lint`         | 代码检查                                              |

## 部署

发布在 `gh-pages` 分支：`scripts/deploy.js` 在临时目录 `git init` → 单次提交 → 强制推送，所以分支上永远只有一个 commit（不用 `gh-pages` 包，否则每次发布会叠一个 14MB 的提交）。

三个必须注意的点：

1. `vite.config.ts` 里的 `PAGES_REPO` 必须与仓库名逐字一致，否则 `/assets` `/fonts` `/themes` 全部 404。Vite 会把 `public/` 下的绝对路径一起改写成 `<base>/fonts/...`，所以改这一处就够。
2. `public/` 下的 CSS（`fonts/shs.css`、`fonts/lxgw.css`）**必须用相对路径**，写绝对路径在子路径部署下字体会静默回落。
3. `deploy.js` 会忽略全局 git 配置、强制走 SSH。本机配了 `url.https://github.com/.insteadof`，会把 SSH 地址改写成 HTTPS，14MB 字体走代理会 502。

## 技术要点

- `src/styles/tokens.less` 是字号、字距、颜色的**唯一出处**，组件不硬编码；语义变量从各主题已有的 `--bg-color` / `--primary-color` 推导，所以 40 套主题无需逐个适配
- 汉字字体分三族分工：Inter 管界面与英文正文，JetBrains Mono 管代码与拼音编码，思源黑体 / 霞鹜文楷管汉字
- 中文字库切成 202 个 `unicode-range` 分片，浏览器按页面实际用字下载；单文件版还会用 `scripts/font-charset.js` 收集真实字符集再裁一次
- 主题 CSS 不进主包，运行时通过替换 `<link>` 的 `href` 切换；单文件版则把全部主题内嵌在 `window.__THEMES__`
- 单文件版只内联思源黑体——霞鹜文楷 97 片全量 base64 后约 5.9MB，两套都塞会到 12MB；设置面板据此隐藏未内置的字族，不留假选项

基于 [barneyzhao/typing-cn](https://github.com/barneyzhao/typing-cn) 改造。
