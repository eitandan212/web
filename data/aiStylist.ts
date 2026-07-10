// Real-AI scoring via NVIDIA NIM (build.nvidia.com free API).
//
// Calls an OpenAI-compatible vision model with the outfit photo and asks for
// a strict-JSON stylist review. Any failure (no key, network, CORS, quota,
// unparseable output) is thrown to the caller, which falls back to the local
// pixel-analysis engine — the app never gets stuck on the API.

import { Category, LookEntry, gradeFor, loadImage } from './scoring';

const ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'meta/llama-3.2-11b-vision-instruct';

export const NVIDIA_KEY_STORAGE = 'lookrate.nvidiaKey';

const CATEGORY_LABELS: Record<string, string> = {
  fit: 'Fit & Silhouette',
  color: 'Color Coordination',
  style: 'Style Cohesion',
  occasion: 'Occasion Versatility',
};

const PROMPT = `You are a professional fashion stylist reviewing an outfit photo.
Rate the look and reply with ONLY a JSON object, no markdown, no extra text:
{
  "overall": <0-100 integer>,
  "categories": {
    "fit": <0-100, how well the pieces fit and flatter the silhouette>,
    "color": <0-100, how well the colors work together>,
    "style": <0-100, how cohesive and intentional the styling is>,
    "occasion": <0-100, how versatile / appropriate the look is>
  },
  "tips": [<exactly 3 short, specific, actionable styling tips as strings>]
}
Be honest but encouraging. If the photo shows no clothing or person, judge whatever aesthetic qualities you can see and mention it in the tips.`;

// NIM inline images must stay small — downscale to a compact JPEG first
const downscaleForAI = async (dataUrl: string, maxSide = 512): Promise<string> => {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.75);
};

const clamp = (n: unknown): number => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 50;
};

const extractJson = (text: string): any => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON in model reply');
  return JSON.parse(text.slice(start, end + 1));
};

export const analyzeWithAI = async (
  imageDataUrl: string,
  apiKey: string,
): Promise<Omit<LookEntry, 'id' | 'createdAt' | 'image'>> => {
  const small = await downscaleForAI(imageDataUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        temperature: 0.4,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: PROMPT },
              { type: 'image_url', image_url: { url: small } },
            ],
          },
        ],
      }),
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) throw new Error(`NVIDIA API error ${res.status}`);

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';
  const parsed = extractJson(text);

  const categories: Category[] = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label,
    score: clamp(parsed?.categories?.[key]),
  }));
  const overall = clamp(parsed?.overall);
  const tips: string[] = Array.isArray(parsed?.tips)
    ? parsed.tips.slice(0, 3).map((t: unknown) => String(t))
    : [];
  if (tips.length === 0) throw new Error('Model reply missing tips');

  return { overall, grade: gradeFor(overall), categories, tips, engine: 'ai' };
};
