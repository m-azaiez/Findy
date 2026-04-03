import { notFound } from "next/navigation";

import { FavoriteToggle } from "@/components/places/favorite-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { getAuthContext } from "@/services/auth.service";
import { attachFavoriteState } from "@/services/favorites.service";
import { listReviewsForPlace } from "@/services/reviews.service";
import { getPlaceBySlug } from "@/services/places.service";
import { type Place, type Review } from "@/types/domain";

type PlaceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { slug } = await params;
  const authContext = await getAuthContext();
  let place: Place | null = null;
  let reviews: Review[] = [];
  let loadError: string | null = null;

  try {
    place = await getPlaceBySlug(slug);

    if (place) {
      [place] = await attachFavoriteState([place], authContext.user?.id);
      reviews = await listReviewsForPlace(place.id);
    }
  } catch (error) {
    loadError = error instanceof Error ? error.message : "This place could not be loaded right now.";
  }

  if (!loadError && !place) {
    notFound();
  }

  return (
    <div className="shell pb-20 pt-10">
      {loadError ? <Notice tone="error">{loadError}</Notice> : null}
      {!place ? null : (
      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.75fr]">
        <Card className="overflow-hidden rounded-[2rem] border-foreground/10 bg-white/75">
          <div
            className="h-72 bg-cover bg-center sm:h-80"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(16, 36, 32, 0.18), rgba(16, 36, 32, 0.45)), url(${place.coverImageUrl})` }}
          />
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {place.categories.map((category) => (
                    <Badge key={category.id}>{category.name}</Badge>
                  ))}
                </div>
                <div>
                  <h1 className="text-4xl leading-tight">{place.name}</h1>
                  <p className="mt-2 text-sm text-foreground/60">
                    {place.address} · {place.city}, {place.country}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:items-end">
                <FavoriteToggle
                  key={`${place.id}-${place.isFavorited}`}
                  placeId={place.id}
                  returnTo={`/places/${place.slug}`}
                  initialIsFavorited={place.isFavorited}
                  isConfigured={authContext.isConfigured}
                  isAuthenticated={Boolean(authContext.user)}
                />
                <div className="rounded-2xl border border-brand/10 bg-brand-soft px-4 py-3 text-right">
                  <p className="text-2xl font-semibold">{place.averageRating.toFixed(1)}</p>
                  <p className="text-sm text-foreground/60">{place.reviewCount} reviews</p>
                </div>
              </div>
            </div>
            <p className="max-w-3xl leading-7 text-foreground/80">{place.description}</p>
            <div className="flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <Badge key={tag} tone="accent">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[1.75rem] border-foreground/10 bg-white/75">
            <CardContent className="space-y-3 p-6">
              <CardTitle>Opening snapshot</CardTitle>
              <CardDescription>
                {place.isOpenNow ? "Open now" : "Currently closed"} · {place.priceTier}
              </CardDescription>
              <div className="space-y-2 text-sm text-foreground/70">
                {Object.entries(place.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between gap-4">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[1.75rem] border-foreground/10 bg-white/75">
            <CardContent className="space-y-3 p-6">
              <CardTitle>Build status</CardTitle>
              <CardDescription>
                This detail page now reads the place record and related reviews from Supabase.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
      )}

      {place ? (
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl">Recent reviews</h2>
          {reviews.length === 0 ? (
            <Card className="rounded-[1.5rem] border-foreground/10 bg-white/70">
              <CardContent className="space-y-3 p-6">
                <CardTitle>No reviews yet</CardTitle>
                <CardDescription>This place is live, but no user reviews have been published for it yet.</CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {reviews.map((review) => (
                <Card key={review.id} className="rounded-[1.5rem] border-foreground/10 bg-white/70">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{review.authorName}</p>
                        <p className="text-sm text-foreground/60">
                          {new Date(review.createdAt).toLocaleDateString("en-CA")}
                        </p>
                      </div>
                      <Badge tone="accent">{review.rating.toFixed(1)} / 5</Badge>
                    </div>
                    <p className="text-sm leading-6 text-foreground/75">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
