// Look Score "AI" analysis engine.
//
// There's no ML model or network call here — the score comes from real pixel
// statistics of the photo (brightness, saturation, contrast, hue spread),
// rendered as if a stylist AI produced them. Same photo in -> same score out.

export interface Category {
  key: string;
  label: string;
  score: number;
}

export interface LookEntry {
  id: string;
  createdAt: number;
  image: string;
  overall: number;
  grade: string;
  categories: Category[];
  tips: string[];
  engine?: 'ai' | 'scan';
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const hashSeed = (n: number) => {
  // deterministic pseudo-random in [0,1) from a numeric seed
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const gradeFor = (score: number) => {
  if (score >= 92) return 'S';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
};

interface PixelStats {
  avgLuminance: number;
  stdLuminance: number;
  avgSaturation: number;
  dominantHueBins: number;
  pixelSeed: number;
}

const SAMPLE = 48;

const readPixelStats = (img: HTMLImageElement): PixelStats => {
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE;
  canvas.height = SAMPLE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
  const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE);

  const luminances: number[] = [];
  let satSum = 0;
  let seedSum = 0;
  const hueHist = new Array(12).fill(0);
  const n = SAMPLE * SAMPLE;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    luminances.push(lum);

    const d = max - min;
    const sat = d === 0 ? 0 : d / (255 - Math.abs(2 * l - 255));
    satSum += sat;

    if (d > 12) {
      let hue = 0;
      if (max === r) hue = ((g - b) / d) % 6;
      else if (max === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue *= 60;
      if (hue < 0) hue += 360;
      hueHist[Math.floor(hue / 30) % 12] += 1;
    }

    seedSum += r * 31 + g * 17 + b * 7 + i;
  }

  const avgLuminance = luminances.reduce((a, b2) => a + b2, 0) / n;
  const variance = luminances.reduce((a, l) => a + (l - avgLuminance) ** 2, 0) / n;
  const stdLuminance = Math.sqrt(variance);
  const avgSaturation = satSum / n;

  const totalHued = hueHist.reduce((a, b2) => a + b2, 0) || 1;
  const dominantHueBins = hueHist.filter((c) => c / totalHued > 0.05).length;

  return { avgLuminance, stdLuminance, avgSaturation, dominantHueBins, pixelSeed: seedSum };
};

const TIP_POOL: Record<string, { low: string[]; mid: string[]; high: string[] }> = {
  lighting: {
    low: [
      'Move toward a window or brighter light — soft, even lighting instantly lifts a look.',
      'The shot reads a little dark; try shooting during golden hour or add a fill light.',
    ],
    mid: ['Lighting is decent — a touch more brightness would make colors pop even more.'],
    high: ['Great lighting — even and flattering, keep shooting like this.'],
  },
  colorPop: {
    low: [
      'The palette leans muted — one saturated accent piece (bag, shoes, jacket) would add punch.',
      'Try swapping one neutral piece for a bold color to give the outfit more energy.',
    ],
    mid: ['Nice color presence — a single statement accessory could take it further.'],
    high: ['Bold, confident color choices — this outfit has real presence.'],
  },
  contrast: {
    low: [
      'Everything sits at a similar tone — layering a lighter or darker piece adds definition.',
      'Low contrast between pieces; a contrasting belt or shoe would sharpen the silhouette.',
    ],
    mid: ['Good tonal separation between pieces — the outfit reads clearly.'],
    high: ['Sharp contrast between light and dark pieces — very editorial.'],
  },
  harmony: {
    low: [
      'A few competing colors are pulling focus — try a tighter, more limited palette.',
      'Consider a monochrome or two-tone approach for a cleaner overall story.',
    ],
    mid: ['The palette mostly works together — one tweak and it\'s fully cohesive.'],
    high: ['Every color choice supports the others — excellent palette discipline.'],
  },
};

const pickTip = (seed: number, category: string, score: number) => {
  const bucket = score < 55 ? 'low' : score < 80 ? 'mid' : 'high';
  const pool = TIP_POOL[category][bucket];
  const idx = Math.floor(hashSeed(seed) * pool.length);
  return pool[idx];
};

export const analyzeLook = (img: HTMLImageElement): Omit<LookEntry, 'id' | 'createdAt' | 'image'> => {
  const stats = readPixelStats(img);

  const lighting = clamp(100 - Math.abs(stats.avgLuminance - 165) / 1.65, 30, 100);
  const colorPop = clamp(stats.avgSaturation * 115 + 15, 20, 100);
  const contrast = clamp(stats.stdLuminance * 1.9, 25, 100);
  const harmony = clamp(100 - Math.max(0, stats.dominantHueBins - 2) * 11, 30, 100);

  const jitter = Math.round(hashSeed(stats.pixelSeed) * 6 - 3);
  const overall = Math.round(
    clamp(lighting * 0.2 + colorPop * 0.25 + contrast * 0.25 + harmony * 0.3 + jitter),
  );

  const categories: Category[] = [
    { key: 'lighting', label: 'Lighting', score: Math.round(lighting) },
    { key: 'colorPop', label: 'Color Pop', score: Math.round(colorPop) },
    { key: 'contrast', label: 'Contrast', score: Math.round(contrast) },
    { key: 'harmony', label: 'Palette Harmony', score: Math.round(harmony) },
  ];

  const sorted = [...categories].sort((a, b) => a.score - b.score);
  const tips = [
    pickTip(stats.pixelSeed, sorted[0].key, sorted[0].score),
    pickTip(stats.pixelSeed + 1, sorted[1].key, sorted[1].score),
    pickTip(stats.pixelSeed + 2, sorted[3].key, sorted[3].score),
  ];

  return { overall, grade: gradeFor(overall), categories, tips };
};

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const gradeColor = (grade: string) => {
  switch (grade) {
    case 'S': return 'from-amber-300 to-yellow-500';
    case 'A': return 'from-fuchsia-400 to-rose-500';
    case 'B': return 'from-violet-400 to-indigo-500';
    case 'C': return 'from-sky-400 to-cyan-500';
    default: return 'from-slate-400 to-slate-600';
  }
};

export const computeStreak = (entries: LookEntry[]): number => {
  if (entries.length === 0) return 0;
  const days = Array.from(
    new Set(entries.map((e) => new Date(e.createdAt).toDateString())),
  ).map((d) => new Date(d).getTime());
  days.sort((a, b) => b - a);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneDay = 24 * 60 * 60 * 1000;

  let streak = 0;
  let cursor = today.getTime();
  for (const day of days) {
    if (day === cursor) {
      streak += 1;
      cursor -= oneDay;
    } else if (day === cursor + oneDay && streak === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
};
