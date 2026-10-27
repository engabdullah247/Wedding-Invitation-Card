# M & S — Wedding Invitation

An interactive wedding invitation for **Shamiya Hossain Shin** and **Moniruzzaman Rabbi**
(Friday, 11 December 2026, 12:30 PM – 3:30 PM, Amana Food Ville, SKS Tower, Mohakhali).

Built with Next.js (App Router), React and TypeScript. Fully static, no backend, no analytics,
no third-party requests (fonts are bundled locally via `@fontsource`).

## Routes

| Route         | What it is                                                     |
| ------------- | -------------------------------------------------------------- |
| `/`           | Envelope cover with the **Open Invitation** button             |
| `/invitation` | Full invitation (hero, details, directions, families, closing) |

`/invitation` can be opened, shared and refreshed directly.

## Editing the content

All names, dates, venue, family details and copy live in one file: **`src/config/wedding.ts`**.

## Music

`public/audio/romantic-wedding-instrumental.mp3` is an **original piano + violin instrumental
(~94 s, loops)** synthesized from scratch by `scripts/generate-music.py` — no samples or
third-party recordings, so it is royalty-free. To regenerate or tweak it:

```bash
pip install numpy scipy
python3 scripts/generate-music.py /tmp/wedding.wav
ffmpeg -y -i /tmp/wedding.wav -codec:a libmp3lame -qscale:a 5 -ar 44100 public/audio/romantic-wedding-instrumental.mp3
```

You can replace the MP3 with any licensed track (keep the file name, or change `MUSIC_SRC`
in `src/components/MusicProvider.tsx`).

Playback only starts after a click (the **Open Invitation** button or the music button),
because browsers block autoplay with sound. One `<audio>` element lives in the root layout,
so it is never duplicated between routes. A visitor's "music off" choice is remembered for the session.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm run start        # serve the production build
```

Manual checklist: open `/` and press **Open Invitation** (mouse, touch and keyboard); confirm the
music starts and the toggle works; reload `/invitation`; tap **Get Directions**; check widths
360 / 390 / 768 / 1024 / 1440 px; try with "reduce motion" enabled in your OS.

## Deploy to Vercel (free Hobby plan)

1. **GitHub:** create an empty repository, then in this folder run
   ```bash
   git init
   git add .
   git commit -m "M & S wedding invitation"
   git branch -M main
   git remote add origin https://github.com/<your-user>/<your-repo>.git
   git push -u origin main
   ```
2. Sign in at <https://vercel.com> with GitHub → **Add New… → Project** → import the repository.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`, no environment
   variables required. Click **Deploy**.
4. Open the `*.vercel.app` URL, then verify in a **private window** and on a **real phone**:
   cover → open → music → directions link → refresh `/invitation`.
5. *(Optional)* For correct link previews on a custom domain, set `NEXT_PUBLIC_SITE_URL`
   (e.g. `https://your-domain.com`) in Vercel → Settings → Environment Variables and redeploy.
6. **Updating later:** edit, commit, `git push` — Vercel redeploys automatically.

## Project layout

```
src/config/wedding.ts        all wedding content
src/app/                     routes, layout, global CSS, favicon (icon.svg), social image
src/components/              cover/envelope, music provider + button, hero, event, family, closing
public/audio/                background instrumental
scripts/generate-music.py    reproducible music generator
```
