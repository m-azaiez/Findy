import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { sanitizeRedirectPath, withQuery } from "@/lib/utils/url";
import { getAuthContext } from "@/services/auth.service";
import { listRecentReviews } from "@/services/reviews.service";
import { type Review } from "@/types/domain";

export const dynamic = "force-dynamic";

export default async function DashboardReviewsPage() {
  const authContext = await getAuthContext();

  if (!authContext.user) {
    redirect(
      withQuery("/login", {
        error: "Sign in to continue.",
        next: sanitizeRedirectPath("/dashboard/reviews", "/dashboard")
      })
    );
  }

  let reviews: Review[] = [];
  let loadError: string | null = null;

  try {
    reviews = await listRecentReviews(authContext.user.id);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Reviews are temporarily unavailable.";
  }

  return (
    <div className="grid gap-4">
      {loadError ? <Notice tone="error">{loadError}</Notice> : null}
      {!loadError &&
        reviews.map((review) => (
          <Card key={review.id} className="rounded-[1.5rem] border-foreground/10 bg-white/75">
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{review.authorName}</p>
                <p className="text-sm text-foreground/60">{review.rating.toFixed(1)} / 5</p>
              </div>
              <p className="text-sm leading-6 text-foreground/75">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
