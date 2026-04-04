import Link from "next/link";

import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PlaceCard } from "@/components/places/place-card";
import { cn } from "@/lib/utils/cn";
import { getAuthContext } from "@/services/auth.service";
import { listCategories } from "@/services/categories.service";
import { attachFavoriteState } from "@/services/favorites.service";
import { getFeaturedPlaces } from "@/services/places.service";

const launchPillars = [
  {
    title: "Search first",
    description: "Keyword, city, and category flows are already framed to become live search endpoints."
  },
  {
    title: "Save and review",
    description: "Favorites and reviews have data models, validation, and route placeholders ready for wiring."
  },
  {
    title: "Admin light",
    description: "The admin area is present from day one so content operations are not bolted on later."
  }
];

export default async function HomePage() {
  const [authContext, featuredPlaces, categories] = await Promise.all([
    getAuthContext(),
    getFeaturedPlaces(),
    listCategories()
  ]);
  let places = featuredPlaces;
  let favoriteLoadError: string | null = null;

  try {
    places = await attachFavoriteState(featuredPlaces, authContext.user?.id);
  } catch (error) {
    favoriteLoadError = error instanceof Error ? error.message : "Favorite state is temporarily unavailable.";
  }

  return (
    <div className="pb-20 pt-10 sm:pb-24 sm:pt-14">
      <section className="shell">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
          <div className="absolute right-6 top-8 hidden h-36 w-36 rounded-full bg-accent/20 blur-3xl sm:block" />
          <div className="absolute bottom-8 left-8 hidden h-28 w-28 rounded-full bg-brand-soft blur-2xl sm:block" />
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <Badge tone="accent">MVP foundation in progress</Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  A discovery product that feels curated, not crowded.
                </h1>
                <p className="section-copy">
                  Findy is being shaped around fast search, visual place pages, favorites, and honest reviews.
                  This first build slice establishes the app shell, route structure, and backend contract.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/search" className={buttonVariants({ variant: "primary", size: "lg" })}>
                  Explore the search surface
                </Link>
                <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "lg" })}>
                  View member dashboard
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-white/60 bg-white/70">
                  <CardContent className="space-y-1 p-4">
                    <p className="text-2xl font-semibold">3</p>
                    <p className="text-sm text-foreground/70">core journeys scaffolded</p>
                  </CardContent>
                </Card>
                <Card className="border-white/60 bg-white/70">
                  <CardContent className="space-y-1 p-4">
                    <p className="text-2xl font-semibold">6</p>
                    <p className="text-sm text-foreground/70">primary routes ready</p>
                  </CardContent>
                </Card>
                <Card className="border-white/60 bg-white/70">
                  <CardContent className="space-y-1 p-4">
                    <p className="text-2xl font-semibold">1</p>
                    <p className="text-sm text-foreground/70">Supabase schema defined</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="glass-panel animate-drift rounded-[1.75rem] border-brand/20 bg-gradient-to-br from-brand-soft to-white">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/60">Launch categories</span>
                  <Link
                    href="/search"
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground/60 transition hover:text-foreground"
                  >
                    browse all
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <Link key={category.id} href={`/search?category=${encodeURIComponent(category.slug)}`}>
                      <Badge
                        tone="default"
                        className="cursor-pointer transition hover:bg-accent hover:text-accent-foreground"
                      >
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <div className="space-y-3 rounded-2xl border border-brand/10 bg-white/80 p-4">
                  <p className="text-sm font-medium text-foreground/60">Quick start</p>
                  <p className="text-sm text-foreground/80">
                    Pick a category to open search with a real filter applied, or jump into the full search surface.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="shell mt-16 space-y-6">
        <SectionHeading
          eyebrow="Featured places"
          title="The UI already has a believable content shape."
          description="Mock data is intentional here: it lets the product shell mature before live backend integration is turned on."
        />
        {favoriteLoadError ? <Notice tone="error">{favoriteLoadError}</Notice> : null}
        <div className="grid gap-5 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              favoriteState={{
                isConfigured: authContext.isConfigured,
                isAuthenticated: Boolean(authContext.user),
                returnTo: "/"
              }}
            />
          ))}
        </div>
      </section>

      <section className="shell mt-16 grid gap-5 lg:grid-cols-3">
        {launchPillars.map((pillar, index) => (
          <Card
            key={pillar.title}
            className={cn(
              "rounded-[1.5rem] border-foreground/10 bg-white/70",
              index === 1 && "bg-gradient-to-br from-white to-brand-soft/50"
            )}
          >
            <CardContent className="space-y-3 p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-foreground/50">0{index + 1}</p>
              <CardTitle>{pillar.title}</CardTitle>
              <CardDescription>{pillar.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
