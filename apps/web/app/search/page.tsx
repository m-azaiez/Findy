import { SearchFilters } from "@/components/filters/search-filters";
import { SectionHeading } from "@/components/layout/section-heading";
import { PlaceCard } from "@/components/places/place-card";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { getAuthContext } from "@/services/auth.service";
import { attachFavoriteState } from "@/services/favorites.service";
import { searchPlaces } from "@/services/places.service";
import { type Place } from "@findy/shared/domain";
import { searchFiltersSchema } from "@findy/shared/validations/search";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    city?: string | string[];
    category?: string | string[];
    minRating?: string | string[];
    openNow?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const authContext = await getAuthContext();

  const getValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] ?? "" : value ?? "");

  const filters = searchFiltersSchema.parse({
    query: getValue(resolvedSearchParams?.q),
    city: getValue(resolvedSearchParams?.city),
    category: getValue(resolvedSearchParams?.category),
    minRating: getValue(resolvedSearchParams?.minRating),
    openNow: getValue(resolvedSearchParams?.openNow) === "on"
  });

  let results: Place[] = [];
  let loadError: string | null = null;

  try {
    results = await attachFavoriteState(await searchPlaces(filters), authContext.user?.id);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Search is temporarily unavailable.";
  }

  const currentSearchParams = new URLSearchParams();

  if (filters.query) {
    currentSearchParams.set("q", filters.query);
  }

  if (filters.city) {
    currentSearchParams.set("city", filters.city);
  }

  if (filters.category) {
    currentSearchParams.set("category", filters.category);
  }

  if (filters.minRating) {
    currentSearchParams.set("minRating", filters.minRating);
  }

  if (filters.openNow) {
    currentSearchParams.set("openNow", "on");
  }

  const returnTo = currentSearchParams.size > 0 ? `/search?${currentSearchParams.toString()}` : "/search";

  return (
    <div className="shell pb-20 pt-10">
      <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SearchFilters initialFilters={filters} />
        </aside>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Search"
            title="A search surface backed by live data."
            description="Search now reads from Supabase using the current query-string filters and returns real places from the database."
          />
          <p className="text-sm text-foreground/60">{results.length} places matched the current filters.</p>
          {loadError ? <Notice tone="error">{loadError}</Notice> : null}
          {!loadError && results.length === 0 ? (
            <Card className="rounded-[1.75rem] border-foreground/10 bg-white/75">
              <CardContent className="space-y-3 p-6">
                <CardTitle>No places match the current filters.</CardTitle>
                <CardDescription>
                  Try widening the city, category, or minimum rating filters to see more results.
                </CardDescription>
              </CardContent>
            </Card>
          ) : null}
          {!loadError && results.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  compact
                  favoriteState={{
                    isConfigured: authContext.isConfigured,
                    isAuthenticated: Boolean(authContext.user),
                    returnTo
                  }}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
