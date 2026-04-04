import { notFound } from "next/navigation";

import { FavoriteToggle } from "@/components/places/favorite-toggle";
import { ReviewComposer } from "@/components/reviews/review-composer";
import { ReviewDeleteButton } from "@/components/reviews/review-delete-button";
import { ReviewReportPlaceholder } from "@/components/reviews/review-report-placeholder";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { getAuthContext } from "@/services/auth.service";
import { attachFavoriteState } from "@/services/favorites.service";
import { getViewerReviewForPlace, listReviewsForPlace } from "@/services/reviews.service";
import { getPlaceBySlug } from "@/services/places.service";
import { type Place, type Review } from "@findy/shared/domain";

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
  let viewerReview: Review | null = null;
  let loadError: string | null = null;

  try {
    place = await getPlaceBySlug(slug);

    if (place) {
      [place] = await attachFavoriteState([place], authContext.user?.id);
      [reviews, viewerReview] = await Promise.all([listReviewsForPlace(place.id), getViewerReviewForPlace(place.id)]);
    }
  } catch (error) {
    loadError = error instanceof Error ? error.message : "This place could not be loaded right now.";
  }

  if (!loadError && !place) {
    notFound();
  }

  const returnTo = place ? `/places/${place.slug}` : "/places";
  const visibleReviews = viewerReview ? reviews.filter((review) => review.id !== viewerReview.id) : reviews;
  const canModerateReviews = authContext.profile?.role === "admin";
  const viewerReviewUiKey = viewerReview
    ? `${viewerReview.id}:${viewerReview.updatedAt}:${viewerReview.rating}`
    : "new-review";
  const displayedReviewCount = reviews.length;
  const displayedAverageRating =
    displayedReviewCount > 0
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / displayedReviewCount) * 10) / 10
      : 0;

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
                  <p className="text-2xl font-semibold">{displayedAverageRating.toFixed(1)}</p>
                  <p className="text-sm text-foreground/60">{displayedReviewCount} reviews</p>
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
        <section className="mt-12 space-y-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-[1.5rem] border-foreground/10 bg-white/70">
              <CardContent className="space-y-4 p-6">
                <ReviewComposer
                  key={viewerReviewUiKey}
                  initialReview={viewerReview}
                  isAuthenticated={Boolean(authContext.user)}
                  isConfigured={authContext.isConfigured}
                  placeId={place.id}
                  returnTo={returnTo}
                />
                {viewerReview ? (
                  <div className="border-t border-foreground/10 pt-4">
                    <ReviewDeleteButton key={`delete-${viewerReviewUiKey}`} reviewId={viewerReview.id} returnTo={returnTo} />
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="rounded-[1.5rem] border-foreground/10 bg-white/70">
              <CardContent className="space-y-3 p-6">
                <CardTitle>Review rules</CardTitle>
                <CardDescription>The MVP keeps review behavior intentionally small and predictable.</CardDescription>
                <ul className="space-y-2 text-sm leading-6 text-foreground/75">
                  <li>One review per signed-in user for this place.</li>
                  <li>You can edit or delete your own review later.</li>
                  <li>Admins can remove any review during moderation.</li>
                  <li>Review reporting is planned next, without owner-specific privileges yet.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

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
              {viewerReview ? (
                <Card className="rounded-[1.5rem] border-brand/10 bg-brand-soft/45">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">Your review</p>
                        <p className="text-sm text-foreground/60">
                          {new Date(viewerReview.createdAt).toLocaleDateString("en-CA")}
                        </p>
                      </div>
                      <Badge tone="accent">{viewerReview.rating.toFixed(1)} / 5</Badge>
                    </div>
                    <p className="text-sm leading-6 text-foreground/75">{viewerReview.comment}</p>
                  </CardContent>
                </Card>
              ) : null}
              {visibleReviews.map((review) => (
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
                    <div className="flex flex-wrap items-center gap-3">
                      {canModerateReviews ? <ReviewDeleteButton compact reviewId={review.id} returnTo={returnTo} /> : null}
                      {authContext.user && !canModerateReviews ? <ReviewReportPlaceholder /> : null}
                    </div>
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
