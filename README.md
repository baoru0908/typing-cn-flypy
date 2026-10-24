# 鹤键 CraneType（小鹤双拼版）

基于 [barneyzhao/typing-cn](https://github.com/barneyzhao/typing-cn) 改造的打字练习，含中文全拼 / 小鹤双拼、英文、代码、自定义文本四种模式，40 套主题，可打包成单个离线 HTML。

> 原项目：https://github.com/barneyzhao/typing-cn （Vite + React + Redux）

## 四种模式

| 模式     | 路由       | 说明                                                                 |
| -------- | ---------- | -------------------------------------------------------------------- |
| 中文双拼 | `/monkey`  | 全拼 / 小鹤双拼词拼练习，两键一字，打满自动上词                        |
| 英文     | `/english` | 33 条语料，短句/段落/长文三档，可「换一段」                            |
| 代码     | `/code`    | 10 种语言 × 3 例共 30 段（JS/TS/Python/Java/C/Go/Rust/Shell/SQL/HTML），等宽字体，可「换一题」 |
| 自定义   | `/custom`  | 任意文本，存 localStorage 刷新不丢                                      |

中文双拼继续沿用原有词拼逻辑；英文/代码/自定义共用新增的通用打字引擎 `src/components/typingArea/TypingArea.tsx`（逐字符判定、退格修正、换行与制表符支持、WPM/正确率/用时统计）。

## 排版

所有字号、字距、表面色只有一个出处：`src/styles/tokens.less`。组件里不硬编码字号与颜色。

### 字号档位

由「设置 → 字号」写入 `<html data-scale>`，三档：

| 档位          | `s` 标准 | `m` 大 | `l` 特大 |
| ------------- | -------- | ------ | -------- |
| 英文散文 prose | 22px     | 24px   | 26px     |
| 代码 code      | 16px     | 17.5px | 19px     |
| 汉字 hanzi     | 20px     | 22px   | 24px     |
| 拼音字母       | 13px     | 14px   | 15px     |

行距：散文 1.9、代码 1.75、汉字 1.5。

### 字距按字体光学特性分别设定

一套字距值套所有字体必然出事，所以字距跟字体绑定：

- **Inter** 22px 视觉偏松 → 负字距 `-0.011em`，字号越大负得越多（`m` -0.014em、`l` -0.017em）
- **思源黑体** 按固定字身框设计、边距已内置 → `0`，再加字距会「散架」
- **霞鹜文楷** 笔画细、字面窄 → 正字距 `+0.04em` 才透气
- **JetBrains Mono** 本身有节奏 → `0`，靠固定字宽对齐
- 大写小标签 → `+0.12em`

### 中文词拼的排版模型

**编码行与汉字行解耦**，各自严格等距，词作为整体居中：

```
zhon zheng   zhou mo   tao jian
   战  争      周  末     套  件
└── 8px/字母 ──┘ 2px 音节间隔
└──────────── 20px 词间隔 ────────────┘
```

- 编码行：JetBrains Mono 自然步进（0.6em，13px → 7.8px ≈ 8px），音节之间恒定 2px
- 汉字行：每字恒 22px 步进，与拼音长短无关
- 三级间距：字内 2px · 词间 20px · 行间 16px（词间 ≈ 字内的 10 倍，词才不会被看散）
- 词组是不可拆分单元（`flex: 0 0 auto` + `break-inside: avoid`），当前词高亮用伪元素绝对定位，不占布局、不引起行内跳动

> 旧模型是「一字一列、列宽 = 该字拼音长度」，结果同样两字词 嘴/巴 相隔 25px、徽/章 相隔 34px，码长直接绑架了汉字间距。现在两者互不影响。

### 汉字字族

由「设置 → 汉字」写入 `<html data-hanzi>`，两套自托管字体：

| 值     | 字体                                    | 说明                                             |
| ------ | --------------------------------------- | ------------------------------------------------ |
| `sans` | 思源黑体 Source Han Sans SC（默认）      | 与 Inter 同属新怪诞/人文黑体，中英混排不跳，400+500 两档字重 |
| `kai`  | 霞鹜文楷 LXGW WenKai                    | 楷体，笔画舒展，适合长时间阅读，仅 400 一档       |

两套字面大小不同，字号与字距必须分别给：黑体 20px / 字距 0，楷体 21px / 字距 +0.04em（楷体字面小、笔画细，同 px 看着更小）。

## 改动说明

### 1. 小鹤双拼输入方案

- 新增 `src/utils/flypy.ts`：全拼 → 小鹤双拼编码转换，规则严格对照 [rime 官方 double_pinyin_flypy 方案](https://github.com/rime/rime-double-pinyin)（含零声母 aa/oo/ee、ai/en/ou 保留全拼、ang=ah、yi/wu 保留、wai=wd、wei=ww 等全部特例）
- 词组编码用 pinyin-pro 按词组语境逐字取拼音后转两码，多音字判定与真实输入法一致
- 头部「输入方案」可切换 全拼 / 小鹤双拼，设置持久化到 localStorage

### 2. 修复：打字插入显示区的 bug

原版逻辑：词组编码打满后继续输入字母，会把字母作为「多余字母」追加到当前词的显示区。
小鹤双拼每个词固定 4 键，这个问题几乎必现。现已修复：**词组编码打满后，下一个字母自动上词（等同空格）并进入下一个词**，空格上词仍然可用。同时补了结果弹出后的按键越界保护。

### 3. 修复：输入框不再唤起系统输入法

打字用隐藏输入框改为 `readOnly`——不可编辑的输入框不会触发系统输入法（IME）组词，拼音/双拼输入法不会再拦截按键或弹出候选窗，keydown 事件照常触发。

### 4. 输入动画与发光效果

- 正确按键：`--ui-correct` 发光 + 弹跳动画
- 错误按键：红色发光 + 抖动动画
- 词组上词：整体弹跳 + 词标签发光
- 光标：移动动画更跟手（120ms ease-out），带主色光晕

### 5. 颜色语义：正确 / 错误 / 光标必须互相可辨

三个反馈色是独立令牌，**不要拿强调色直接表示「打对」**：

- `--ui-correct` 打对 · `--ui-error` 打错 · `--typing-caret-color` 光标
- 但 `nothing` / `nothing dark` 两个主题的强调色与错误色是同一个红（`#c8102e` / `#e0243e`），红色因此彻底失去语义，错误看不出来
- 处理方式：`src/utils/color.ts` 把两个颜色转 CIELAB 算 ΔE（CIE76），阈值 25，运行时写入 `<html data-accent-clash="1">`
- 撞色时**红色专用于错误**，「正确」退回亮度表达（文本色满亮）；光标保留主题红，因为它是位置指示而非状态
- 撞色下当前词不能再提亮未输入的字，否则「已正确」与「未输入」同亮度，逐字反馈就消失了
- 40 套主题全部实测，只有上述两个触发（nothing ΔE 0.0，rose pine dawn 29.5 未触发，再上一档 40.2）

### 6. 主题

共 **40 个主题**，深浅成对，全部通过 WCAG 对比度检查：

| 组         | 主题                                                       |
| ---------- | ---------------------------------------------------------- |
| 原创       | default / 毛玻璃 / 毛玻璃黑 / nothing / nothing dark        |
| Nord       | nord / nord light                                          |
| Gruvbox    | gruvbox / gruvbox light                                    |
| Solarized  | solarized dark / solarized light                           |
| Catppuccin | catppuccin mocha / catppuccin latte                        |
| Tokyo Night| tokyo night / tokyo night light                            |
| Rose Pine  | rose pine / rose pine dawn                                 |
| One        | one dark / one light                                       |
| 经典单色   | oblivion / carbon / 2600 / olivia / 9009 / godspeed / …    |

- **nothing / nothing dark** 按 Nothing 设计语言规范实现，色彩只用 Pure Black `#000000`、Window Grey `#B1B3B3`、N-Grey `#DCD7D2`、Pure White `#FFFFFF` 与 N-Red `#C8102E`；**禁渐变、禁投影**，主色仅用于强调

打字区所有颜色走主题语义变量（`--typing-text-color` / `--typing-correct-color` / `--typing-error-color` / `--typing-caret-color` / `--typing-panel-bg-color` 等），不硬编码，因此每个主题的深浅色表现一致。

### 7. 字体全部自托管

| 用途             | 字体                  | 位置                  | 分片                     |
| ---------------- | --------------------- | --------------------- | ------------------------ |
| 界面 / 英文正文  | Inter 400/500/600      | `src/assets/fonts/`   | 拉丁单文件（共 66KB）   |
| 代码 / 拼音编码  | JetBrains Mono 400/500 | `src/assets/fonts/`   | 拉丁单文件（共 42KB）   |
| 汉字（默认）     | 思源黑体 400/500       | `public/fonts/shs/`   | 202 片（9.0MB）         |
| 汉字（可选）     | 霞鹜文楷 400           | `public/fonts/files/` | 97 片（4.6MB）          |

- 中文字体按 `unicode-range` 切成上百片，浏览器**只下载页面实际出现的字所在的分片**，没出现的字不产生请求
- 两套汉字字体都只在 `index.html` 里声明 `@font-face`，未选用的那套不会产生任何请求
- 不依赖任何 CDN，`file://` 下也能正常工作

### 8. 单文件 HTML 构建

`npm run build-single` 一键产出可双击离线使用的单文件 HTML，产物写到**仓库外**的 `../typing-cn-小鹤双拼.html`（不在版本控制内）。

`scripts/pack-single.js` 内联了 JS / CSS / 全部 40 套主题 / favicon / 字体，其中字体做了裁剪：

- `scripts/font-charset.js` 扫描 `src/` + `words.json` 里的全部汉字（979 个码位），再按 `unicode-range` 命中情况挑分片
- 思源黑体 202 片 → 只保留命中的 62 片（8.58MB → 3.20MB），转 `data:font/woff2;base64` 内联（约 4.3MB）
- 霞鹜文楷 97 片全部命中、没有可裁的余地（4.42MB → base64 5.92MB），两套都塞进去 HTML 会到 12MB，因此单文件版**不带楷体**：打包时注入 `window.__SINGLE_FILE__=true`，设置面板隐藏楷体卡片，并把历史设置里的 `kai` 归一到 `sans`
- 被裁掉的码位自动回落系统字体（苹方/微软雅黑），不会出现豆腐块

## 本地开发

```bash
npm install
npm run dev          # 开发服务器
npm run build        # 常规构建 → dist/（base 为 /typing-cn-flypy/）
npm run build-nobase # 根域名构建（base 为 /）
npm run build-single # 单文件构建 → ../typing-cn-小鹤双拼.html
npm run deploy       # 构建并发布到 GitHub Pages
npm run lint         # eslint 检查

# 双拼编码测试
node --experimental-strip-types test-flypy-word.mjs

# 主题维护
node scripts/patch-theme-vars.js    # 给全部主题补打字区语义变量（幂等）
node scripts/generate-themes.js     # 生成新增主题 CSS 并打印 config.ts 条目
node scripts/fix-contrast.js        # 自动把对比度不达标的颜色调到 WCAG 达标

# 字体维护
node scripts/font-charset.js        # 打印语料里的汉字码位与分片命中数
node scripts/analyze-font-slices.js # 打印分片命中数与 base64 体积估算
```

打开后默认即中文双拼练习，照着词块下方的编码敲键（两键一字），空格可上词（打满 4 键直接敲下一个词也会自动上词）。

## 部署

线上地址：**https://baoru0908.github.io/typing-cn-flypy/**

用的是 GitHub Pages 的项目站点，产物发布在 `gh-pages` 分支（单提交、强制推送，分支上永远只有一个 commit，不会因为反复发布而堆历史）。

```bash
npm run deploy       # build → 推送到 gh-pages
```

### 三条必须注意的规则

**1. `base` 必须与仓库名逐字一致。** `vite.config.ts` 里的 `PAGES_REPO` 写的是 `typing-cn-flypy`。改了仓库名而忘了改它，`/assets`、`/fonts`、`/themes` 会全部 404，页面白屏。

**2. `public/` 下的 CSS 必须用相对路径。** `public/` 是原样拷贝，Vite **不会**改写里面的 URL —— 只有 `index.html` 里的绝对路径会被加上 base 前缀。所以 `public/fonts/shs.css` 里写成 `url('./shs/x.woff2')`，不能写 `url('/fonts/shs/x.woff2')`，否则子路径部署时字体全部 404、静默回落到系统字体（页面看着没坏，但用的不是思源黑体）。

**3. 部署到根域名要换 base。** 挂到 Cloudflare Pages / 对象存储 / 自己的域名时用 `npm run build-nobase`，mode 不是 `production`，base 退回 `/`，产物路径变成 `/assets/...`。

> 首次部署后需要在仓库 Settings → Pages 把 Source 设为 `gh-pages` 分支 / `(root)`。本仓库已配好。
> 目录里的 `public/.nojekyll` 是为了让 Pages 跳过 Jekyll 处理，不要删。

## 工程说明

- `tsconfig.json` 开启 `skipLibCheck`：前端项目不需要校验第三方 `.d.ts`（`@types/node` 与 DOM lib 的 `AbortSignal` 声明冲突、`rc-tree` 的泛型约束问题均源于此），跳过可让 `npm run build` 的 `tsc` 步骤通过
- `@types/react-router-dom` 已移除：`react-router-dom@6` 自带类型定义，旧版 `@types/react-router-dom@5.3.3` 与 v6 API 冲突会让 tsc 报十几个错
- 代码语料里 shell 例子的 `${1:-.}` 等必须写成 `\${1:-.}`，否则会被模板字符串当作插值解析导致语法错误
- 主题名里可以有空格（`nothing dark`），只在拼 CSS 文件名时转成连字符
- `<html>` 上三个运行时属性由 `src/App.tsx` 的 bridge 组件写入：`data-scale`（字号）、`data-hanzi`（汉字字族）、`data-accent-clash`（撞色降级）。单文件版主题是替换 `<style>` 而非 `<link>`，不会触发 `load` 事件，所以撞色检测另加了 `requestAnimationFrame` + 120ms 兜底
