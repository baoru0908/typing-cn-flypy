/** 判断颜色是否为浅色，用于主题分组 */
export function isLightColor(color: string): boolean {
    const c = (color || '').trim();
    let r = 0;
    let g = 0;
    let b = 0;
    if (c.startsWith('#')) {
        let hex = c.slice(1);
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((x) => x + x)
                .join('');
        }
        r = parseInt(hex.slice(0, 2), 16) || 0;
        g = parseInt(hex.slice(2, 4), 16) || 0;
        b = parseInt(hex.slice(4, 6), 16) || 0;
    } else {
        const m = c.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
        if (m) {
            r = Number(m[1]);
            g = Number(m[2]);
            b = Number(m[3]);
        }
    }
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return lum > 0.6;
}

/**
 * 把任意 CSS 颜色解析成 [r, g, b]。
 * 借浏览器解析，因此 red / rgb() / hsl() / 变量算出的值都能吃。
 */
function toRgb(color: string): [number, number, number] | null {
    if (typeof document === 'undefined' || !color) return null;
    const el = document.createElement('span');
    el.style.display = 'none';
    el.style.color = color;
    // 非法颜色不会被写入，据此判空
    if (!el.style.color) return null;
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    el.remove();
    const m = rgb.match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return null;
    return [Number(m[0]), Number(m[1]), Number(m[2])];
}

const srgbToLinear = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

/** sRGB → CIELAB（D65），用于算感知色差 */
function toLab([r, g, b]: [number, number, number]): [number, number, number] {
    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);
    const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047;
    const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    const Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
    const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fx = f(X);
    const fy = f(Y);
    const fz = f(Z);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIE76 色差：0 为完全同色，数值越大越容易区分 */
export function deltaE(a: string, b: string): number {
    const ca = toRgb(a);
    const cb = toRgb(b);
    if (!ca || !cb) return 100;
    const la = toLab(ca);
    const lb = toLab(cb);
    return Math.hypot(la[0] - lb[0], la[1] - lb[1], la[2] - lb[2]);
}

/** WCAG 相对亮度；解析不了返回 null */
function luminance(color: string): number | null {
    const rgb = toRgb(color);
    if (!rgb) return null;
    const [r, g, b] = rgb.map(srgbToLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * WCAG 对比度（1~21）。小字（<18px）读得清至少要 4.5，
 * 主题卡上的名字是次要信息，低于 3 就该换兜底色。
 */
export function contrastRatio(a: string, b: string): number | null {
    const la = luminance(a);
    const lb = luminance(b);
    if (la === null || lb === null) return null;
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * 强调色与错误色是否近到无法区分。
 * 实测全部 40 套主题的 ΔE：nothing / nothing-dark = 0，
 * 次低是 rose-pine-dawn 的 29.5，再往下直接跳到 40 以上。
 * 阈值取 25（略高于小色块的可觉差 JND≈20，远低于 13px 小字所需），
 * 因此只命中真正同色的主题，不会误伤只是相近的配色。
 */
export const isColorClash = (a: string, b: string, threshold = 25): boolean =>
    !!a && !!b && deltaE(a, b) < threshold;

/**
 * 任意颜色合成「带透明度的同色」，用于在色板上叠半透明层。
 * alpha 缺省 0.16；解析不了就退回 rgba(128,128,128,.16) 灰色，不会让色板掉块。
 */
export function withAlpha(color: string, alpha = 0.16): string {
    const rgb = color.startsWith('#') ? hexToRgb(color) : null;
    if (!rgb) {
        const m = (color || '').match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
        if (!m) return `rgba(128,128,128,${alpha})`;
        return `rgba(${Number(m[1])},${Number(m[2])},${Number(m[3])},${alpha})`;
    }
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

function hexToRgb(hex: string): [number, number, number] | null {
    let h = hex.slice(1);
    if (h.length === 3) {
        h = h
            .split('')
            .map((x) => x + x)
            .join('');
    }
    if (h.length < 6) return null;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return [r, g, b];
}
