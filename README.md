# 鹤键 CraneType

中文全拼 / 小鹤双拼打字练习。四种模式、40 套主题、字体全部自托管，可打包成单个离线 HTML 文件。

**在线体验 → https://baoru0908.github.io/typing-cn-flypy/** · [English](README.en.md)

## 功能

| 模式         | 说明                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| **中文词拼** | 全拼 / 小鹤双拼，两键一字，打满自动上词，汉字随拼音逐字点亮                   |
| **英文**     | 33 条语料，短句 / 段落 / 长文三档，可「换一段」                              |
| **代码**     | 10 种语言共 30 段（JS/TS/Python/Java/C/Go/Rust/Shell/SQL/HTML），保留缩进     |
| **自定义**   | 任意文本，存在本地，刷新不丢                                                |

其他：

- **实时统计** — WPM、正确率、用时，打完出结果页
- **40 套主题** — 深浅成对，对比度全部达标；含 Nord、Gruvbox、Solarized、Catppuccin 等
- **两套汉字字体** — 思源黑体（默认）/ 霞鹜文楷，设置里一键切换
- **三档字号** — 标准 / 大 / 特大
- **全键盘可用** — 不唤起系统输入法，拼音 / 双拼输入法下也能正常练
- **离线可用** — 单文件版一个 HTML，双击即开

## 快速开始

```bash
npm install
npm run dev
```

| 命令                   | 说明                                    |
| ---------------------- | --------------------------------------- |
| `npm run build`        | 构建到 `dist/`（GitHub Pages 子路径）    |
| `npm run build-nobase` | 构建到 `dist/`（根域名）                 |
| `npm run build-single` | 打包单文件 HTML，产出在仓库外            |
| `npm run deploy`       | 构建并发布到 GitHub Pages                |
| `npm test`             | 双拼编码测试                            |
| `npm run lint`         | 代码检查                                |

## 部署

发布在 `gh-pages` 分支（单提交强制推送，分支永远只有一个 commit）。

> `vite.config.ts` 里的 `PAGES_REPO` 必须与仓库名一致；`public/` 下的 CSS 必须用相对路径 —— 这两处错了会白屏或字体静默回落。

## 技术要点

- `src/styles/tokens.less` 是字号、字距、颜色的唯一出处，组件不硬编码
- 中文词拼的**编码行与汉字行是两条独立的行**，各自等距，汉字间距不受拼音长短影响
- 汉字字体按 `unicode-range` 切成约 200 片，浏览器只下载页面实际出现的字
- 主题 CSS 不进主包，运行时切换 `<link>`

基于 [barneyzhao/typing-cn](https://github.com/barneyzhao/typing-cn) 改造。
