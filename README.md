# LookRate · AI Look Score 📸

A mobile-first app, built with React + Vite + Tailwind CSS, that rates your
outfit against an "AI" — snap a photo and get an instant style score,
right in the browser.

<div align="center">
  <em>Capture · Analyzing · Score · History · Profile</em>
</div>

## Features

- 📱 **Phone-shell layout** — centered device frame on desktop, full-screen on mobile
- 📷 **Real photo capture** — take a photo with your camera or pick one from the gallery
- 🧠 **On-device "AI" scoring** — no network call or model download. The score comes
  from real pixel statistics of your photo (brightness, contrast, saturation, hue
  spread), computed on a canvas and framed as stylist feedback
- 🎯 **Look Score breakdown** — Lighting, Color Pop, Contrast and Palette Harmony,
  each with its own 0–100 sub-score and a grade (S/A/B/C/D)
- 💡 **Stylist tips** — feedback text tailored to your weakest and strongest categories
- 🔥 **Streaks** — consecutive days you've rated a look
- 🗂️ **History** — every rated look saved locally, with a score trend sparkline
- 🏅 **Profile & badges** — average/best score and unlockable badges

> Everything runs client-side and persists to `localStorage` — no backend, no
> accounts, no photos leave your device.

## Run locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev      # start the dev server (http://localhost:3000)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project structure

```
App.tsx                  # navigation, capture -> analyze -> result flow, persistence
index.tsx                # entry point (mounts App, imports index.css)
index.css                # Tailwind layers + custom utilities (glass, scan animation)
data/scoring.ts           # canvas-based pixel analysis, scoring, grading, tips, streaks
components/
  Capture.tsx             # Home: camera/gallery capture, streak badge, last look
  Analyzing.tsx           # fake AI scanning animation
  Result.tsx              # score reveal + category breakdown + tips (fresh or read-only)
  HistoryView.tsx         # grid of past looks + score trend sparkline
  ProfileView.tsx         # stats (average/best/streak) + badges
  ScoreRing.tsx           # circular gauge for the Look Score
  icons.tsx               # inline SVG icon set
```
