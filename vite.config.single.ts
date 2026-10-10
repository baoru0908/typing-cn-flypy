// 单文件 HTML 构建配置：所有 JS/CSS/图片/音频内联进一个 index.html
// 用法: vite build --config vite.config.single.ts
// 产物: dist-single/index.html （双击即可打开，配合 #/monkey 等哈希路由）
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import pkg from './package.json';

export default defineConfig({
    base: './',
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
    plugins: [react()],
    resolve: { alias: { '@': '/src' } },
    build: {
        target: 'es2015',
        outDir: 'dist-single',
        emptyOutDir: true,
        assetsInlineLimit: 100000000, // mp3/图片全部转 base64 内联
        cssCodeSplit: false, // CSS 合并为单份内联
        rollupOptions: {
            output: {
                inlineDynamicImports: true, // 关闭代码分割（React.lazy 的动态导入合并进主包）
            },
        },
    },
});
