# typing-cn-flypy（小鹤双拼版）

基于 [barneyzhao/typing-cn](https://github.com/barneyzhao/typing-cn) 改造的小鹤双拼打字练习，**仅保留模式2（计时打字）** 功能。

> 原项目：https://github.com/barneyzhao/typing-cn （Vite + React + Redux）

## 改动说明

### 1. 小鹤双拼输入方案

- 新增 `src/utils/flypy.ts`：全拼 → 小鹤双拼编码转换，规则严格对照 [rime 官方 double_pinyin_flypy 方案](https://github.com/rime/rime-double-pinyin)（含零声母 aa/oo/ee、ai/en/ou 保留全拼、ang=ah、yi/wu 保留、wai=wd、wei=ww 等全部特例）
- 词组编码用 pinyin-pro 按词组语境逐字取拼音后转两码，多音字判定与真实输入法一致
- 头部「输入方案」可切换 全拼 / 小鹤双拼，设置持久化到 localStorage

### 2. 修复：打字插入显示区的 bug

原版逻辑：词组编码打满后继续输入字母，会把字母作为「多余字母」追加到当前词的显示区。
小鹤双拼每个词固定 4 键，这个问题几乎必现。现已修复：**词组编码打满后，下一个字母自动上词（等同空格）并进入下一个词**，空格上词仍然可用。同时补了结果弹出后的按键越界保护。

### 3. 单文件 HTML 构建

- `vite.config.single.ts` + `scripts/pack-single.js`：一键打包为单文件 HTML（JS/CSS/全部 22 个主题/favicon/按键音全部内联），双击即可离线使用
- 仓库内附带构建产物 `typing-cn-小鹤双拼.html`

## 本地开发

```bash
npm install
npm run dev          # 开发服务器
npm run build        # 常规构建 → dist/

# 单文件构建
npx vite build --config vite.config.single.ts
node scripts/pack-single.js   # 产出 typing-cn-小鹤双拼.html
```

打开后默认即模式2打字练习，在头部选择「小鹤双拼」即可开始：照着词块下方的编码敲键（两键一字），空格可上词（打满 4 键直接敲下一个词也会自动上词）。
