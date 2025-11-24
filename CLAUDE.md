# Gemini Image Studio

Next.js webapp for AI image generation using Google Gemini API.

## Architecture

- **Frontend**: Next.js 16, React, TypeScript, Tailwind v4
- **API**: Next.js API routes (`/app/api/generate`)
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Vercel

## Key Files

- `app/page.tsx` - Main UI with image generation form
- `app/api/generate/route.ts` - Gemini API integration
- `app/globals.css` - Custom animations and design system
- `app/layout.tsx` - Fonts: Syne + Instrument Serif

## Features

- Text-to-image generation
- Image editing mode (upload + transform)
- Client-side API key input (no env vars needed)
- Glass morphism UI with gold/orange accents
- Floating animations, shimmer effects
- Download generated images
- Iterative refinement ("Refine This")

## Environment

API key handled client-side. No `.env` required for deployment.

## Development

```bash
npm install
npm run dev
```

## Type Safety Note

Gemini SDK types incomplete - using `as any` for `generateContent` config.
SDK supports `responseModalities` but TypeScript types missing it.

## Design System

- Colors: White bg, gold (#fbbf24), amber (#f59e0b), orange (#fb923c), rose (#fb7185)
- Animations: float, shimmer, pulse-glow, fade-in-up
- Glass panels: backdrop-blur + gold borders
