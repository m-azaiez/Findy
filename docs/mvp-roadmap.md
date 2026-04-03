# MVP Roadmap

## Current Status

### Completed Foundation

- monorepo workspace and root scripts are in place
- the Next.js web app foundation exists in `apps/web`
- the main route structure is live:
  - home
  - search
  - place detail
  - login
  - register
  - forgot password
  - reset password
  - dashboard
  - admin
- reusable UI, layout shell, validation schemas, and service layers are in place
- Supabase is connected and the initial schema has been applied
- seed data exists for places and categories
- Supabase SSR auth is wired:
  - sign in
  - sign up
  - sign out
  - password reset request
  - password update
  - auth callback
  - protected dashboard routes
  - admin role checks
- live read features are complete:
  - search reads from `places`
  - place detail reads from `places`, `place_categories`, `categories`, and `reviews`
- favorites are implemented:
  - read state on home, search, place detail, and dashboard
  - authenticated toggle action
  - unauthenticated, loading, and error states
  - authenticated end-to-end toggle validation completed
- the Next.js runtime issue caused by importing `next/headers` through shared URL helpers has been fixed by splitting client-safe and server-only URL utilities
- a fresh dev-server smoke test is passing again for:
  - `/`
  - `/search`
  - `/places/canal-house`
  - `/dashboard` redirect behavior
  - `/dashboard/favorites` redirect behavior
- profiles role escalation has been patched in a forward migration for both:
  - profile insert
  - profile update
- Supabase Security Advisor hygiene has been improved with a forward migration that adds `set search_path = public` to `public.set_updated_at`
- basic empty states and error notices are working
- the project has been verified with:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

### What Is Still Missing In The Core Product Loop

- authenticated review creation, editing, and deletion
- dashboard data that reflects the current signed-in user
- admin CRUD screens that replace direct SQL edits for content work
- deployment and operational setup for repeatable releases

## Priority Order

### 1. Review Writes

Reason:
- this is now the biggest missing user action after search and favorites
- the schema, triggers, and read layer already exist, so this is the highest-value next slice
- it completes the basic user loop: discover, save, review

### 2. Real Dashboard Data

Reason:
- the dashboard already exists structurally, so wiring it to real data is a low-risk follow-up
- it makes authentication feel useful instead of just protective
- it depends naturally on favorites and review writes

### 3. Admin CRUD For Places And Categories

Reason:
- a solo developer should stop depending on SQL edits as soon as the user loop is stable
- lightweight admin tools are enough at this stage; full back-office complexity can wait
- this unlocks faster content iteration without touching migrations or seed files

### 4. Review Moderation Basics

Reason:
- once review writes exist, moderation becomes a real product need
- the first version can stay intentionally small:
  - list reviews
  - remove abusive content
  - optionally flag low-quality content

### 5. Image Upload And Storage

Reason:
- useful, but not required to validate the core discovery loop
- it adds storage, upload, and admin workflow complexity
- it should come after admin CRUD for places is stable

## Dependencies

- auth must be working before favorites and review writes can be trusted
- the app shell and server actions must stay runtime-stable before adding new write features
- review writes depend on:
  - auth
  - `profiles`
  - `places`
  - existing review RLS and rating triggers
- real dashboard data depends on:
  - favorites being implemented
  - review writes being implemented
- admin CRUD depends on:
  - admin role security
  - protected admin routes
  - stable place and category schemas
- image upload depends on:
  - admin place editing
  - a stable storage strategy
- monitoring and deployment should wait until the main user loop is stable enough to release repeatedly

## Phase 1: MVP Completion

Short description:
Close the core user loop so a signed-in user can search, save places, write reviews, and see their own activity.

### Product Tasks

- add review create flow on place detail pages
- add review edit and delete flow for the author
- show real favorites and review history inside the dashboard
- replace placeholder dashboard stats with live user-specific values
- keep current empty and error states clean as write flows are added

### Technical Tasks

- add review server actions and validation
- wire review permissions for author and admin paths
- verify RLS behavior for review insert, update, and delete
- add basic end-to-end smoke coverage for:
  - auth
  - favorites
  - review writes

### Exit Criteria

- a signed-in user can save a place
- a signed-in user can create, edit, and delete their own review
- place ratings update correctly after review changes
- dashboard favorites and review sections show live user data

## Phase 2: V1 Content Operations

Short description:
Make the product manageable by one operator without manual SQL for normal content work.

### Product Tasks

- add admin CRUD for places
- add admin CRUD for categories
- make admin review management usable for lightweight moderation
- improve admin feedback for validation, save success, and failure states

### Technical Tasks

- build server actions and forms for admin create and edit flows
- validate slugs, category relations, and place payloads consistently
- revalidate public pages after admin updates
- harden admin-only access checks around every mutation
- add a lightweight content fixture strategy for local testing

### Exit Criteria

- an admin can add and edit places from the UI
- an admin can add and edit categories from the UI
- an admin can review and remove problematic reviews without SQL

## Phase 3: V1 Release Readiness

Short description:
Stabilize the app so it can be used beyond local testing and one-off demos.

### Product Tasks

- add image upload and gallery management for places
- improve profile editing
- improve search quality with better ranking and filtering behavior
- refine review moderation UX once real reviews exist

### Technical Tasks

- add Supabase Storage integration
- set up deployment environments and environment management
- add basic monitoring and error reporting
- review caching and performance on search and place detail pages
- add stronger regression checks for core flows

### Exit Criteria

- content can be updated without manual asset URL management
- the app can be deployed repeatedly with confidence
- the main user and admin flows are observable and supportable

## Later Improvements

Short description:
Invest in retention, discovery quality, and operating efficiency after the core product is stable.

### Product Ideas

- richer search ranking and discovery personalization
- saved collections beyond single favorites
- map-based exploration
- notifications or activity feeds
- richer onboarding and profile depth

### Technical Ideas

- full-text search improvements
- background jobs and async workflows
- analytics instrumentation
- rate limiting and abuse controls
- moderation tooling beyond simple remove actions

## Recommended Solo Developer Sequence

1. finish review writes because they complete the core user loop with the smallest surface-area increase
2. wire the dashboard to real user data because the UI shell already exists and the dependency graph is simple
3. build admin CRUD for places and categories so content updates stop depending on SQL
4. add moderation basics only after real review traffic exists
5. delay storage uploads, deployment polish, and advanced search until the MVP loop is clearly stable

## Notes

- admin access depends on `profiles.role = 'admin'`
- the product still renders without Supabase credentials, but real auth and protected behavior only activate once env vars are configured
