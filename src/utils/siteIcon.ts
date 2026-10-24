export default {
    setSiteIcon(backColor: string, fontColor: string) {
        const canvas = document.createElement('canvas');
        canvas.height = 64;
        canvas.width = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 底色
        ctx.fillStyle = backColor;
        ctx.fillRect(0, 0, 64, 64);

        // 键帽轮廓 + 折线（与顶栏标志同一形状）
        ctx.strokeStyle = fontColor;
        ctx.lineWidth = 3.4;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const x = 9.5;
        const y = 19.5;
        const w = 45;
        const h = 29;
        const r = 8;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(20.5, 39.5);
        ctx.lineTo(32, 26.5);
        ctx.lineTo(43.5, 39.5);
        ctx.stroke();

        const base64Url = canvas.toDataURL('image/png');
        document.getElementById('site-icon')?.setAttribute('href', base64Url);
    },
};
