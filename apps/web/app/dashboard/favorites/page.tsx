import { PlaceCard } from "@/components/places/place-card";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { requireUser } from "@/services/auth.service";
import { listFavoritePlaces } from "@/services/favorites.service";
import { type Place } from "@/types/domain";

export default async function FavoritesPage() {
  const authContext = await requireUser("/dashboard/favorites");
  let favorites: Place[] = [];
  let loadError: string | null = null;

  try {
    favorites = await listFavoritePlaces(authContext.user?.id);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Favorites are temporarily unavailable.";
  }

  return (
    <>
      {loadError ? <Notice tone="error">{loadError}</Notice> : null}
      {!loadError && favorites.length === 0 ? (
        <Card className="rounded-[1.75rem] border-foreground/10 bg-white/75">
          <CardContent className="space-y-3 p-6">
            <CardTitle>No saved places yet</CardTitle>
            <CardDescription>Use the Save button on a place card or detail page to build your favorites list.</CardDescription>
          </CardContent>
        </Card>
      ) : null}
      {!loadError && favorites.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {favorites.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              compact
              favoriteState={{
                isConfigured: authContext.isConfigured,
                isAuthenticated: Boolean(authContext.user),
                returnTo: "/dashboard/favorites"
              }}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
