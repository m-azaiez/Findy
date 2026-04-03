"use client";

import { featuredCategories } from "@/lib/constants/mock-data";
import { useSearchFilters } from "@/hooks/use-search-filters";
import { type SearchFiltersState } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type SearchFiltersProps = {
  initialFilters: SearchFiltersState;
};

export function SearchFilters({ initialFilters }: SearchFiltersProps) {
  const { filters, setField, toggleOpenNow } = useSearchFilters(initialFilters);

  const selectedCategory = featuredCategories.find((category) => category.slug === filters.category);

  return (
    <Card className="rounded-[1.75rem] border-foreground/10 bg-white/75">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <CardTitle>Refine search</CardTitle>
          <CardDescription>Query-string filters are already shaped for real backend search.</CardDescription>
        </div>

        <form action="/search" className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Keyword</label>
            <Input
              name="q"
              value={filters.query}
              onChange={(event) => setField("query", event.target.value)}
              placeholder="Coffee, rooftop, gallery..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              name="city"
              value={filters.city}
              onChange={(event) => setField("city", event.target.value)}
              placeholder="Montreal"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Category</p>
            <input type="hidden" name="category" value={filters.category} />
            <div className="flex flex-wrap gap-2">
              {featuredCategories.map((category) => {
                const active = filters.category === category.slug;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm transition",
                      active
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-foreground/10 bg-white text-foreground/70 hover:border-brand/30 hover:text-foreground"
                    )}
                    onClick={() => setField("category", active ? "" : category.slug)}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="minRating">
              Minimum rating
            </label>
            <select
              id="minRating"
              name="minRating"
              value={filters.minRating}
              onChange={(event) => setField("minRating", event.target.value)}
              className="flex h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-brand"
            >
              <option value="">Any</option>
              <option value="3.5">3.5+</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-muted/70 px-4 py-3">
            <span className="text-sm font-medium">Open now</span>
            <input
              type="checkbox"
              name="openNow"
              checked={filters.openNow}
              onChange={toggleOpenNow}
              className="h-4 w-4 rounded border-foreground/20 text-brand focus:ring-brand"
            />
          </label>

          <button type="submit" className={buttonVariants({ variant: "primary", className: "w-full" })}>
            Apply filters
          </button>
        </form>

        {selectedCategory ? (
          <Badge tone="accent">Category focus: {selectedCategory.name}</Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
