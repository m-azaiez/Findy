import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/services/auth.service";
import { listRecentReviews } from "@/services/reviews.service";

export default async function DashboardReviewsPage() {
  await requireUser("/dashboard/reviews");
  const reviews = await listRecentReviews();

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
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
