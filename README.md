# Pulse · Music Player 🎧

A sleek, **mobile-first music player** built with React + Vite + Tailwind CSS.
Designed to look and feel like a native phone app right in the browser.

<div align="center">
  <em>Home · Now Playing · Liked Songs</em>
</div>

## Features

- 📱 **Phone-shell layout** — centered device frame on desktop, full-screen on mobile
- 🎵 **Real audio playback** via the HTML5 Audio API (play / pause / next / prev / seek / volume)
- 🔀 **Shuffle & repeat** modes
- 💿 **Now Playing** screen with album art, ambient color background and live progress
- 🔎 **Search** across songs, artists and albums
- ❤️ **Liked Songs** library
- 🎚️ **Mini player** with progress hairline that expands to the full player
- 🔒 **OS / lock-screen controls** via the Media Session API
- 🎨 **Generated album covers** — gradients + glyphs, so there are no image assets to ship

> Demo tracks stream from [SoundHelix](https://www.soundhelix.com/) (royalty-free).
> Swap the `src` fields in [`data/tracks.ts`](data/tracks.ts) to use your own.

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
App.tsx              # player state, audio wiring, navigation
index.tsx            # entry point (mounts App, imports index.css)
index.css            # Tailwind layers + custom utilities (glass, scrollbars)
data/tracks.ts       # track list + helpers (gradients, time formatting)
components/
  Browse.tsx         # Home: greeting, search, carousel, track list
  NowPlaying.tsx     # full-screen player
  MiniPlayer.tsx     # floating mini player
  AlbumCover.tsx     # generated gradient cover
  icons.tsx          # inline SVG icon set
```
