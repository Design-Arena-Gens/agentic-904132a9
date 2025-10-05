# Lumina Chess

Lumina Chess is a polished browser-based chess experience built with Next.js, Tailwind, and chess.js. It features a responsive board, move history, captured piece tracking, and handy utilities like board flipping, undo, and a "Play random move" helper for casual practice.

## Features

- Interactive chessboard with legal-move highlights, last-move tracing, and coordinate overlays
- Human vs. human play with automatic queen promotion and undo support
- Captured piece tracker for both sides and a scrolling move history viewer
- Board orientation toggle plus an optional random-move assistant
- Modern glassmorphism-inspired interface that looks great on desktop and mobile

## Local Development

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) to play.

## Production Build

```bash
npm run build
npm start
```

Deployments are Vercel-ready out of the box.
