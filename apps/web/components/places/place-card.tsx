import Link from "next/link";

import { FavoriteToggle } from "@/components/places/favorite-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { type Place } from "@/types/domain";

type PlaceCardFavoriteState = {
  isConfigured: boolean;
  isAuthenticated: boolean;
  returnTo: string;
};

type PlaceCardProps = {
  place: Place;
  compact?: boolean;
  favoriteState?: PlaceCardFavoriteState;
};

export function PlaceCard({ place, compact = false, favoriteState }: PlaceCardProps) {
  return (
    <Card className="group relative h-full overflow-hidden rounded-[1.75rem] border-foreground/10 bg-white/80 transition hover:-translate-y-1 hover:shadow-halo">
      {favoriteState ? (
        <div className="absolute right-4 top-4 z-10">
          <FavoriteToggle
            key={`${place.id}-${place.isFavorited}`}
            placeId={place.id}
            returnTo={favoriteState.returnTo}
            initialIsFavorited={place.isFavorited}
            isConfigured={favoriteState.isConfigured}
            isAuthenticated={favoriteState.isAuthenticated}
            compact={compact}
          />
        </div>
      ) : null}
      <Link href={`/places/${place.slug}`} className="block h-full">
        <div
          className={compact ? "h-44 bg-cover bg-center" : "h-56 bg-cover bg-center"}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(16, 36, 32, 0.08), rgba(16, 36, 32, 0.35)), url(${place.coverImageUrl})` }}
        />
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>{place.name}</CardTitle>
              <CardDescription>
                {place.city}, {place.country}
              </CardDescription>
            </div>
            <Badge tone="accent">{place.averageRating.toFixed(1)}</Badge>
          </div>
          <p className="text-sm leading-6 text-foreground/75">{place.shortDescription}</p>
          <div className="flex flex-wrap gap-2">
            {place.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
