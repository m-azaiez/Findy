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
- review writes are implemented on the place detail page:
  - create one review per user per place
  - edit own review
  - delete own review
  - admin delete path in the service and action layer
  - place detail summary now derives from real `reviews` rows for correct MVP behavior
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
- admin place creation MVP is implemented:
  - admin-only `/admin/places` create form
  - validation and category assignment
  - success link to the newly created place
  - input preservation on validation errors
  - slug helper text and auto-derived slug until manual edit
- basic empty states and error notices are working
- the project has been verified with:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

### What Is Still Missing In The Core Product Loop

- dashboard data that reflects the current signed-in user
- category management from the admin UI
- place editing from the admin UI
- review moderation/reporting workflows beyond basic author and admin mutation paths
- denormalized place stats cleanup so `places.average_rating` and `places.review_count` become trustworthy again everywhere
- deployment and operational setup for repeatable releases

## Priority Order

### 1. Real Dashboard Data

Reason:
- the user loop already exists, but the dashboard still under-delivers after sign-in
- favorites and review writes already exist, so the missing work is mostly read wiring and presentation
- this is the smallest next slice with strong user-visible value

### 2. Admin Category Management

Reason:
- the new create-place form depends on existing categories
- category management removes another SQL dependency for routine content work
- it is a smaller and safer admin slice than full place editing

### 3. Admin Place Editing

Reason:
- place creation exists, so editing is the next practical step
- core fields, categories, and status should be editable without manual SQL
- full delete/gallery/opening-hours can still wait

### 4. Review Moderation Basics

Reason:
- review writes now exist, so moderation becomes a real product need
- the first version can stay intentionally small:
  - list reviews
  - remove abusive content
  - capture standard user reports as a future-ready moderation input

### 5. Denormalized Stats Repair And Cleanup

Reason:
- the place detail page already bypasses the stale denormalized summary values
- the data model should still be reconciled so search, cards, and future ranking can safely use place stats
- this is infrastructure cleanup, not a blocker for current MVP UX

### 6. Image Upload And Storage

Reason:
- useful, but not required to validate the core discovery loop
- it adds storage, upload, and admin workflow complexity
- it should come after the core admin content flows are stable

## Dependencies

- auth must be working before favorites and review writes can be trusted
- the app shell and server actions must stay runtime-stable before adding new write features
- review writes depended on:
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
- admin place creation depends on existing categories, so category management is now a direct dependency for smoother content operations
- review moderation depends on:
  - review writes being implemented
  - admin role enforcement
  - a clear report or delete workflow
- denormalized stats cleanup depends on:
  - confirmed aggregate rules for ratings and counts
  - a reliable recomputation strategy or a decision to compute more summaries from `reviews`
- image upload depends on:
  - admin place editing
  - a stable storage strategy
- monitoring and deployment should wait until the main user loop is stable enough to release repeatedly

## Phase 1: MVP Completion

Short description:
Finish the user loop with a useful dashboard and enough admin tooling to add and adjust content without routine SQL edits.

### Product Tasks

- show real favorites and review history inside the dashboard
- replace placeholder dashboard stats with live user-specific values
- add admin category creation so the place create flow is self-sufficient
- add basic place editing for the same core fields exposed in the create form
- keep current empty and error states clean as more write flows are added

### Technical Tasks

- keep dashboard queries scoped to the signed-in user
- add admin category server actions and validation
- add admin place update server actions and validation
- revalidate public and admin pages after content changes
- reconcile or isolate stale denormalized place stats so public summaries stay trustworthy
- add basic end-to-end smoke coverage for:
  - auth
  - favorites
  - review writes
  - admin place creation

### Exit Criteria

- a signed-in user can save a place
- a signed-in user can create, edit, and delete their own review
- the dashboard shows live favorites and review history for the signed-in user
- an admin can create places and categories from the UI
- an admin can edit a place's core fields from the UI
- dashboard favorites and review sections show live user data

## Phase 2: V1 Content Operations

Short description:
Make the product manageable by one operator without manual SQL for normal content work.

### Product Tasks

- extend place management from create/edit into fuller CRUD where justified
- extend category management from create into edit flows
- make admin review management usable for lightweight moderation
- improve admin feedback for validation, save success, and failure states
- add basic user review reporting intake for moderation follow-up

### Technical Tasks

- build the remaining server actions and forms for admin edit flows
- validate slugs, category relations, and place payloads consistently
- revalidate public pages after admin updates
- harden admin-only access checks around every mutation
- add a lightweight content fixture strategy for local testing
- clean up denormalized place stats or formalize where aggregate values are computed from live reviews

### Exit Criteria

- an admin can manage places without SQL for normal content maintenance
- an admin can manage categories without SQL
- an admin can review and remove problematic reviews without SQL
- standard user reports can be captured for later moderation action

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

1. wire the dashboard to real user data because the user loop already exists and this is the highest-value remaining MVP gap
2. add admin category management because it directly supports the new place creation flow
3. add admin place editing so content updates stop depending on SQL after creation
4. add review moderation and lightweight reporting once the operator tools are usable
5. clean up denormalized stats and then delay storage uploads, deployment polish, and advanced search until the MVP loop is clearly stable

## Notes

- admin access depends on `profiles.role = 'admin'`
- the product still renders without Supabase credentials, but real auth and protected behavior only activate once env vars are configured
- the place detail summary intentionally uses live `reviews` rows as the MVP source of truth instead of trusting denormalized place stats
