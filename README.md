# Findy

Findy is a mobile-first place discovery platform focused on search, favorites, reviews, and lightweight admin operations. It is inspired by standard discovery applications but scoped down strictly to core value and speed for its MVP.

This repository contains the full Next.js application, database schemas, and documentation.

## 🚀 Features & Current Status

The development is guided by our Technical Specifications and MVP Roadmap. Here is the current progress of the project core system:

### ✅ Completed (Foundation & Core Features)
- **Full-Stack Foundation**: Next.js App Router (React), Tailwind CSS, shadcn/ui components, and React Query data fetching.
- **Supabase Backend**: Complete initial schema setup including tables for Profiles, Categories, Places, place metrics, Reviews, and Favorites. Includes advanced PostgreSQL triggers (e.g., auto-aggregated rating average updates) and comprehensive Row Level Security (RLS) policies.
- **Authentication**: SSR-compatible Supabase Sessions with Sign-up, Login, Logout, Forgot Password, and Reset Password workflows fully built.
- **Browse & Search (Read layer)**: 
  - Dynamic discovery and live SQL querying against places.
  - Detailed place cards rendering live address, stats, tags, descriptions, and current opening hours. 
- **Favorites System**: End-to-end functionality allowing authenticated users to bookmark places, toggle states from the search UI or place details, and fetch them in their personal dashboard.
- **Security & Hygiene**: Latest forward migrations mapping `set search_path` bounds and profile escalation bounds are actively applied out of the box.

### 🚧 In Progress / Pending MVP Features
- **Review Writes**: While the place detail page can successfully read list views of generated reviews, the authenticated flow to create, edit, and delete personal reviews is currently pending.
- **Real Dashboard Connectivity**: Personal dashboard layout is built, but currently shows mocked statistics instead of querying a user's actual saved metrics.
- **Admin CRUD Operations**: Adding new places and categories currently relies on direct database seeds or SQL insertion. Lightweight Admin UI screens are planned to replace this.
- **Image Content Storage**: Image uploading integration with Supabase Storage for Place details.

## 🛠 Tech Stack

- **Frontend**: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui
- **State & Data Fetching**: React Query, Zod (Validations)
- **Backend & Database**: Supabase (Auth, PostgreSQL DB, Edge Functions mapped via RPC)
- **Deployment Strategy**: Vercel (Frontend) + Supabase Cloud (Backend)

## 💻 Workspace Commands

From the repository root, install dependencies:

```bash
npm install
```

Launch the development server:

```bash
npm run dev
```

Additional verification commands available:
```bash
npm run build
npm run lint
npm run typecheck
```

## ⚙️ Environment Variables

Create the `apps/web/.env.local` file by copying the provided example:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Required values for `apps/web/.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (Used for auth redirects in local and deployed environments)

*Note:* If Supabase credentials are not provided, the UI falls back to rendering local mock data, and auth-sensitive areas display configuration notices without breaking the application logic.

## 🗄 Database Setup

The database schema and policies are maintained through Supabase migrations. You can push the initial definitions to your active Supabase environment using the CLI or by running SQL directly from the project tracking.

- **Initial schema location**: `supabase/migrations/20260401133000_initial_schema.sql`
- **Initial sample data**: `supabase/seed.sql` 

## 🗺 Documentation

For detailed information on the project lifecycle, refer to the documentation:
1. [MVP Roadmap (`docs/mvp-roadmap.md`)](docs/mvp-roadmap.md) — Tracks completed features, pending items, and priority sequence.
2. [Technical Specifications (`Findy Technical Specifications.md`)](./Findy%20Technical%20Specifications.md) — Holds the initial technical requirements, product scope, and architecture guidelines.

---
*Built incrementally following a solo developer framework sequence.*
