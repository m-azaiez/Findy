import Link from "next/link";

import { CreatePlaceForm } from "@/components/admin/create-place-form";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { listCategories } from "@/services/categories.service";
import { getFeaturedPlaces } from "@/services/places.service";

export default async function AdminPlacesPage() {
  const [categories, places] = await Promise.all([listCategories(), getFeaturedPlaces()]);

  return (
    <div className="space-y-8">
      {categories.length > 0 ? (
        <CreatePlaceForm categories={categories} />
      ) : (
        <Notice tone="error">
          Add at least one category before creating places. The MVP create flow depends on existing categories.
        </Notice>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl">Current places</h2>
            <p className="text-sm text-foreground/60">
              Existing records stay visible here so you can quickly open the latest created place.
            </p>
          </div>
          <Link href="/search" className={cn(buttonVariants({ variant: "ghost" }), "border border-foreground/10 bg-white")}>
            Browse public search
          </Link>
        </div>

        <div className="grid gap-4">
          {places.map((place) => (
            <Card key={place.id} className="rounded-[1.5rem] border-foreground/10 bg-white/75">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="space-y-1">
                  <CardTitle>{place.name}</CardTitle>
                  <CardDescription>
                    {place.city}, {place.country} · {place.categories.map((category) => category.name).join(", ")}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-foreground/60">{place.isOpenNow ? "Open now" : "Closed now"}</p>
                  <Link
                    href={`/places/${place.slug}`}
                    className={cn(buttonVariants({ variant: "ghost" }), "border border-foreground/10 bg-white")}
                  >
                    Open
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
