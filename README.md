# CafePulse Web (`cafepulse_web`)

> **Find Your Pulse. Coffee & Coworking.**
> High-fidelity, work-friendly cafe directory adapted from the neo-brutalist editorial aesthetic of **landonorris.com** and translated into a rich, roasted coffee design system.

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **UI & State:** React 19, `@tanstack/react-query` v5
- **Styling:** Tailwind CSS v4 with bespoke Dark Roast & Caramel Crema tokens
- **Typography:** Display headlines in **Syne** (Google Fonts ultra-bold condensed), metric telemetry in **JetBrains Mono**, body in **Inter**
- **Icons & Components:** Lucide React, CSS keyframe running marquee ticker
- **Backend API:** Connects to `https://api.cafepulse.izerworks.my.id` (Fallback: `https://cafepulse-api.vercel.app`)

---

## 🎨 Design System & Palette (Lando Norris × CafePulse)

| Token Name | Hex Code | Visual Application |
| :--- | :--- | :--- |
| **Dark Roast (Primary Background)** | `#0F0D0C` / `#161311` | Deep roasted bean background tint |
| **Card / Surface** | `#1C1816` | Geometric cards with thin `#2F2723` borders |
| **Caramel Crema (Primary Accent)** | `#E08E45` / `#F59E0B` | Replaces fluo-yellow racing accents with rich espresso crema |
| **Terracotta Roast (Secondary Accent)** | `#C86237` | Location pins & active state trims |
| **Oatmilk Cream (Text Primary)** | `#F7F3EE` | High contrast display headings & body |
| **Warm Sand (Text Muted)** | `#9C9289` | Secondary captions, micro-labels & metrics |
| **Crowd LOW Beacon** | `#10B981` | Emerald green pulse beacon (ideal for deep work) |
| **Crowd MODERATE Beacon** | `#F59E0B` | Amber pulse beacon |
| **Wi-Fi Speed Verified** | `#3B82F6` | Electric blue throughput badges |

---

## 🚀 Key Features

1. **System Status Pill (Navbar):**
   - Live polling to `/db-check` displaying Supabase PostgreSQL connectivity and verified active space counts.
2. **Hero Section (Lando Norris Style):**
   - High-impact condensed headlines (`FIND YOUR PULSE. COFFEE & COWORKING.`).
   - Micro-badges (`[LATENCY-FREE]`, `[CURATED ROASTS]`, `[PLENTY SOCKETS]`).
   - Four-column telemetry summary (Benchmark Speed, Power Density, Audited Nodes, Crowd Radar).
3. **Running Marquee Ticker:**
   - Seamless infinite scroll ticker highlighting verified metrics.
4. **Interactive Space Filter Bar:**
   - Real-time search query across cafe names and street addresses.
   - Filter chips for crowd density (`LOW`, `MODERATE`), Wi-Fi speeds (`> 50 Mbps`, `> 80 Mbps`), power outlets (`PLENTY ONLY`), acoustics (`QUIET ONLY`), and amenities (AC, Outdoor, Mushola).
5. **Brutalist Cafe Cards:**
   - Real-time live pulse dot for crowd density.
   - Triple metric spec gauge: Wi-Fi speed & stability, socket availability, and acoustic noise level.
   - Quick action triggers to explore space details or edit specs.
6. **Detailed Verification Modal / Drawer:**
   - In-depth hardware telemetry and facility checklist.
   - Community reviews feed with verified speeds and crowd ratings.
   - Direct launch into Google Maps using real coordinates.
7. **Submit & Edit Modals:**
   - Quick Add workspace modal hooked to `POST /api/cafes`.
   - Edit space specs modal hooked to `PUT /api/cafes/:id`.
   - Automatic TanStack Query cache invalidation for instant reactivity.

---

## 🛠️ Getting Started

### 1. Installation

```bash
cd cafepulse_web
pnpm install
```

### 2. Environment Setup

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

File content:
```env
NEXT_PUBLIC_API_URL=https://api.cafepulse.izerworks.my.id
```

### 3. Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

```bash
pnpm build
pnpm start
```

---

## 🌐 Deploy to Vercel

To deploy to Vercel and assign the domain `cafepulse.izerworks.my.id`:

```bash
# Using Vercel CLI
pnpm dlx vercel --prod
```

Or connect the repository on [vercel.com](https://vercel.com) and configure:
- **Root Directory:** `cafepulse_web` (if deployed from root repo) or `.`
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: `https://api.cafepulse.izerworks.my.id`
- **Custom Domain:** Add `cafepulse.izerworks.my.id` in Vercel project settings.
