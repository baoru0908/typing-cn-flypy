import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
// import { visualizer } from 'rollup-plugin-visualizer';

import pkg from './package.json';

/**
 * GitHub Pages 的项目站点部署在 https://<user>.github.io/<repo>/ 下，
 * base 必须与**仓库名**逐字一致，否则 index.html 里由 base 拼出来的
 * /assets、/fonts、/themes 全部 404（Vite 会把 public 下的绝对路径一起改写成
 * <base>/fonts/...，所以改一处即可，不用逐个文件改）。
 *
 * 部署到根域名时（Cloudflare Pages / OSS / 自己的域名）用 `--mode nobase`，
 * mode 不是 production，base 退回 '/'，产物路径就是 /assets/...。
 */
const PAGES_REPO = 'typing-cn-flypy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    base: mode === 'production' ? `/${PAGES_REPO}/` : '/',
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
    plugins: [
        react(),
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),
        // visualizer({ open: true, brotliSize: true, filename: 'report.html' }),
    ],
    resolve: { alias: { '@': '/src' } },
    build: { target: 'es2015' },
}));
