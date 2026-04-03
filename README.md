# Findy

Findy is a mobile-first place discovery platform focused on search, favorites, reviews, and lightweight admin operations.

This repository now contains the first implementation slice:

- `apps/web`: Next.js application for the MVP
- `supabase`: SQL migration and seed data for the backend
- `docs`: project notes and delivery framing

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Zod
- React Query

## Workspace Commands

From the repository root:

```bash
npm install
npm run dev
```

Additional commands:

```bash
npm run build
npm run lint
npm run typecheck
```

## Environment

Create `apps/web/.env.local` from `apps/web/.env.example`.

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Use `NEXT_PUBLIC_SITE_URL` for auth redirects in local and deployed environments.

Without Supabase credentials, the UI still renders from local mock data and auth-sensitive areas show configuration notices instead of failing hard.

## Database

The initial schema lives in [supabase/migrations/20260401133000_initial_schema.sql](/Users/mehdiazaiez/Documents/Poly/Genie Informatique /Codex/Findy/supabase/migrations/20260401133000_initial_schema.sql).

It includes:

- profiles
- categories
- places
- place categories
- reviews
- favorites
- row level security policies
- rating aggregation triggers

Seed data lives in [supabase/seed.sql](/Users/mehdiazaiez/Documents/Poly/Genie Informatique /Codex/Findy/supabase/seed.sql).

## Authentication

The web app now includes:

- cookie-backed Supabase SSR sessions
- sign in, sign up, sign out, forgot password, and reset password flows
- auth callback handling at `/auth/callback`
- protected dashboard routes
- admin role checks against the `profiles.role` column

## Current State

The repository is ready for the next implementation slices:

1. replace mock search and place detail data with live Supabase queries
2. wire review and favorite mutations for authenticated users
3. connect dashboard metrics to real user data
4. add admin CRUD forms for places and categories
