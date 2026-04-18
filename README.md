# Oracle of Cybertron

A Transformers-themed Magic 8-Ball set in a dark, atmospheric cave. Click the
sphere to shake it and reveal a prophecy from the AllSpark.

## Stack

- **Vite + React + TypeScript** — frontend scaffold
- **@react-three/fiber + drei** — 3D scene (cave, torches, sphere)
- **GSAP** — shake and reveal animations
- **three.js** — underlying WebGL renderer

No backend. Phrases live in `src/data/phrases.ts` — edit the array to change
the prophecy pool.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Project layout

```
src/
  App.tsx                  entry
  data/phrases.ts          Transformers-themed response pool
  components/
    Oracle.tsx             top-level Canvas + shake state
    CaveScene.tsx          fog, torches, walls
    Magic8Ball.tsx         sphere, LED window, GSAP shake
```

## Roadmap

- Replace torch spheres with real flame shaders / sprites
- Model the relic pedestal in Blender, import as glTF
- Swap the phrase window for a custom RenderTexture
- Add ambient cave audio (low drone + crackle)
