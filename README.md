# typing-cn-flypy（小鹤双拼版）

基于 [barneyzhao/typing-cn](https://github.com/barneyzhao/typing-cn) 改造的打字练习，含中文小鹤双拼、英文、代码、自定义文本四种模式。

> 原项目：https://github.com/barneyzhao/typing-cn （Vite + React + Redux）

## 四种模式

| 模式     | 路由       | 说明                                                                 |
| -------- | ---------- | -------------------------------------------------------------------- |
| 中文双拼 | `/monkey`  | 小鹤双拼/全拼词拼练习，两键一字，打满自动上词                          |
| 英文     | `/english` | 常用英文短句，按短句/中句/长句分档                                      |
| 代码     | `/code`    | 各语言范例代码（JS/TS/Python/Java/C/Go/Rust/Shell/SQL/HTML），等宽字体  |
| 自定义   | `/custom`  | 任意文本，存 localStorage 刷新不丢                                      |

中文双拼继续沿用原有词拼逻辑；英文/代码/自定义共用新增的通用打字引擎 `src/components/typingArea/TypingArea.tsx`（逐字符判定、退格修正、换行与制表符支持、WPM/正确率/用时统计）。

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

- 正确按键：主色发光（text-shadow 自适应各主题）+ 弹跳动画
- 错误按键：红色发光 + 抖动动画
- 词组上词：整体弹跳 + 词标签发光
- 光标：移动动画更跟手（120ms ease-out），带主色光晕

### 5. 主题

- **毛玻璃**：蓝紫渐变底色 + 半透明面板（`backdrop-filter: blur + saturate`）
- **毛玻璃黑**：深黑渐变底（冷调微光）+ 玻璃面板，主色冷青 `#9bf0ff`，适合暗光环境
- **nothing / nothing dark**：按 Nothing 设计语言规范实现，色彩只用 Pure Black `#000000`、Window Grey `#B1B3B3`、N-Grey `#DCD7D2`、Pure White `#FFFFFF` 与 N-Red `#C8102E`；**禁渐变、禁投影**，主色仅用于强调（选中态、光标、正确字符）

共 25 个主题。顶栏、弹窗、文本域、词数按钮均做主题适配。

### 6. 单文件 HTML 构建

- `vite.config.single.ts` + `scripts/pack-single.js`：一键打包为单文件 HTML（JS/CSS/全部主题/favicon/按键音全部内联），双击即可离线使用
- 产物输出到仓库外：`../typing-cn-小鹤双拼.html`（不在版本控制内）

## 本地开发

```bash
npm install
npm run dev          # 开发服务器
npm run build        # 常规构建 → dist/
npm run lint         # eslint 检查

# 双拼编码测试
node --experimental-strip-types test-flypy-word.mjs

# 单文件构建
npx vite build --config vite.config.single.ts
node scripts/pack-single.js   # 产出 ../typing-cn-小鹤双拼.html
```

打开后默认即中文双拼练习，照着词块下方的编码敲键（两键一字），空格可上词（打满 4 键直接敲下一个词也会自动上词）。

## 工程说明

- `tsconfig.json` 开启 `skipLibCheck`：前端项目不需要校验第三方 `.d.ts`（`@types/node` 与 DOM lib 的 `AbortSignal` 声明冲突、`rc-tree` 的泛型约束问题均源于此），跳过可让 `npm run build` 的 `tsc` 步骤通过
- `@types/react-router-dom` 已移除：`react-router-dom@6` 自带类型定义，旧版 `@types/react-router-dom@5.3.3` 与 v6 API 冲突会让 tsc 报十几个错
