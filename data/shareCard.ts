// Renders a look as a 1080x1350 (4:5) share image on a canvas —
// the kind of score card people post to stories.

import { LookEntry, loadImage } from './scoring';

const W = 1080;
const H = 1350;

const GRADE_COLORS: Record<string, [string, string]> = {
  S: ['#fcd34d', '#eab308'],
  A: ['#e879f9', '#f43f5e'],
  B: ['#a78bfa', '#6366f1'],
  C: ['#38bdf8', '#06b6d4'],
  D: ['#94a3b8', '#475569'],
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const drawCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
) => {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
};

const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';

export const renderShareCard = async (look: LookEntry): Promise<Blob> => {
  const img = await loadImage(look.image);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ground
  ctx.fillStyle = '#080810';
  ctx.fillRect(0, 0, W, H);

  // ambient glows
  const glow1 = ctx.createRadialGradient(W * 0.2, 0, 0, W * 0.2, 0, 700);
  glow1.addColorStop(0, 'rgba(217, 70, 239, 0.22)');
  glow1.addColorStop(1, 'rgba(217, 70, 239, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);
  const glow2 = ctx.createRadialGradient(W, H, 0, W, H, 800);
  glow2.addColorStop(0, 'rgba(251, 191, 36, 0.14)');
  glow2.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // header
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `700 34px ${FONT}`;
  ctx.textBaseline = 'alphabetic';
  ctx.save();
  // letterspaced wordmark
  let cx = 72;
  for (const ch of 'LOOKRATE') {
    ctx.fillText(ch, cx, 108);
    cx += ctx.measureText(ch).width + 10;
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = `500 30px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(
    new Date(look.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    W - 72, 108,
  );
  ctx.textAlign = 'left';

  // photo
  const px = 72, py = 156, pw = W - 144, ph = 700;
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 48);
  ctx.clip();
  drawCover(ctx, img, px, py, pw, ph);
  const fade = ctx.createLinearGradient(0, py + ph - 220, 0, py + ph);
  fade.addColorStop(0, 'rgba(8,8,16,0)');
  fade.addColorStop(1, 'rgba(8,8,16,0.55)');
  ctx.fillStyle = fade;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  roundRect(ctx, px + 1, py + 1, pw - 2, ph - 2, 47);
  ctx.stroke();

  // grade chip
  const [g1, g2] = GRADE_COLORS[look.grade] ?? GRADE_COLORS.D;
  const chipR = 56;
  const chipX = px + pw - 84;
  const chipY = py + 84;
  const chipGrad = ctx.createLinearGradient(chipX - chipR, chipY - chipR, chipX + chipR, chipY + chipR);
  chipGrad.addColorStop(0, g1);
  chipGrad.addColorStop(1, g2);
  ctx.fillStyle = chipGrad;
  ctx.beginPath();
  ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#080810';
  ctx.font = `900 58px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(look.grade, chipX, chipY + 4);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  // score block: ring + number
  const ringCx = 220, ringCy = py + ph + 170, ringR = 108;
  ctx.lineWidth = 22;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, ringR, 0, Math.PI * 2);
  ctx.stroke();
  const ringGrad = ctx.createLinearGradient(ringCx - ringR, ringCy - ringR, ringCx + ringR, ringCy + ringR);
  ringGrad.addColorStop(0, '#fb7185');
  ringGrad.addColorStop(1, '#f59e0b');
  ctx.strokeStyle = ringGrad;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, ringR, -Math.PI / 2, -Math.PI / 2 + (look.overall / 100) * Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 84px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(look.overall), ringCx, ringCy - 8);
  ctx.font = `600 24px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('LOOK SCORE', ringCx, ringCy + 52);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  // category bars
  const bx = 400, bw = W - 400 - 72;
  let by = py + ph + 92;
  for (const c of look.categories) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `600 30px ${FONT}`;
    ctx.fillText(c.label, bx, by);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 30px ${FONT}`;
    ctx.fillText(String(c.score), bx + bw, by);
    ctx.textAlign = 'left';
    roundRect(ctx, bx, by + 14, bw, 14, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fill();
    const barGrad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    barGrad.addColorStop(0, '#e879f9');
    barGrad.addColorStop(1, '#fcd34d');
    roundRect(ctx, bx, by + 14, Math.max(14, bw * (c.score / 100)), 14, 7);
    ctx.fillStyle = barGrad;
    ctx.fill();
    by += 92;
  }

  // footer
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `500 26px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('Rated with LookRate · AI Style Score', W / 2, H - 56);
  ctx.textAlign = 'left';

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
  });
};

export const shareLook = async (look: LookEntry) => {
  const blob = await renderShareCard(look);
  const file = new File([blob], `lookrate-${look.overall}.png`, { type: 'image/png' });

  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `My Look Score: ${look.overall}` });
      return;
    } catch {
      // user cancelled or share failed — fall through to download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};
