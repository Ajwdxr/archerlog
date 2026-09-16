# 🏹 ARROWLOG

> **Shoot. Score. Share.**
> A mobile-first Progressive Web App (PWA) designed for archery communities to score sessions, view live leaderboards, track individual shooting history, and generate shareable result posters.

---

## ✨ Features

- **🏹 Multi-Bow Support**: Traditional Bow, Horse Bow, Recurve, Longbow, Compound.
- **⚡ Fast Mobile Scorepad**: Large touch-target keypad (52-64px) with `10`, `9-0`, and `X` inputs, arrow progress dots, and instant undo.
- **📶 Offline Resilient Scoring**: If cellular reception drops at the shooting range, arrow scores are cached locally and synchronized automatically upon reconnection.
- **📊 Realtime Leaderboard**: Live ranking updates with medal badges (🥇, 🥈, 🥉), end completion status, and tiebreakers (Score → X count → 10 count → 9 count).
- **🎨 Shareable Result Posters & Cards**:
  - 1080×1080 canvas-rendered Instagram & WhatsApp square cards.
  - Full session podium & leaderboard posters.
  - Native Web Share API + WhatsApp formatted summary text generator.
- **📱 PWA Ready**: Installable on iOS and Android home screens with offline app shell caching and custom brand icons.
- **🎯 Archer Dashboard**: Track personal bests, total arrows shot, points per arrow average, and past session breakdown.
- **👥 Organizer Controls**: Create sessions, project full-screen scannable QR codes, monitor participants, and lock final results.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend & Database**: Supabase (PostgreSQL, Realtime, Auth, Row Level Security)
- **Icons**: Lucide React + Custom SVG Archery Vector Suite
- **PWA**: Service Worker with offline fallback & webmanifest

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Ajwdxr/archerlog.git
cd archerlog
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Execute the SQL migration located in [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) in your Supabase SQL Editor.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your browser or mobile device.

---

## 📦 Project Structure

```
archerlog/
├── app/                      # Next.js App Router
│   ├── auth/                 # Login & Signup flows
│   ├── dashboard/            # Organizer session hub
│   ├── join/                 # QR / Join code entry
│   ├── me/                   # Archer shooting stats & personal records
│   ├── offline/              # PWA offline fallback page
│   ├── profile/              # User settings & bow preferences
│   ├── results/[id]/         # Podium, standings, & poster export
│   ├── session/[id]/         # Session control panel
│   │   ├── leaderboard/      # Live real-time leaderboard
│   │   ├── qr/               # Fullscreen QR projector mode
│   │   ├── score/            # Touch keypad score entry
│   │   └── score-summary/    # End-by-end breakdown & individual card
│   ├── sessions/             # Community sessions list & create form
│   ├── icon.tsx              # Dynamic favicon generator
│   └── apple-icon.tsx        # Dynamic Apple touch icon generator
├── components/               # UI & Feature components
│   ├── result-card/          # Canvas poster & individual card generators
│   └── ui/                   # Button, Card, Badge, Input, Select, Toast, BottomNav, Logo
├── lib/                      # Core logic & services
│   ├── poster/               # Canvas rendering & Web Share API helpers
│   ├── ranking/              # Tiebreaker & medal service
│   ├── scoring/              # Score calculations & offline queue
│   ├── sessions/             # Session management actions
│   └── supabase/             # Browser, server, & middleware clients
├── public/                   # Static assets & PWA manifest
│   ├── icons/                # 192x192, 512x512, apple-touch-icon, and SVG
│   ├── logo.svg              # Official vector logo
│   ├── manifest.webmanifest  # PWA configuration
│   └── sw.js                 # Service worker
└── supabase/migrations/      # PostgreSQL database schema & RLS policies
```

---

## 📄 License

MIT License © 2026 ARROWLOG.
