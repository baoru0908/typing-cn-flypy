/** 运行环境标记：单文件版由 scripts/pack-single.js 注入 window.__SINGLE_FILE__ */
export const isSingleFile = (): boolean =>
    typeof window !== 'undefined' && (window as any).__SINGLE_FILE__ === true;

/**
 * 单文件版只内置思源黑体（霞鹜文楷全量分片会把 HTML 撑到 12MB），
 * 因此把未内置的字族归一化回默认值，避免设置里出现"选了却静默回落"的假选项。
 */
export const normalizeHanziFont = (font: string | undefined): string =>
    isSingleFile() && font === 'kai' ? 'sans' : font || 'sans';
