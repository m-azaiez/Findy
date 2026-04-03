import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { getFeaturedPlaces } from "@/services/places.service";

export default async function AdminPlacesPage() {
  const places = await getFeaturedPlaces();

  return (
    <div className="grid gap-4">
      {places.map((place) => (
        <Card key={place.id} className="rounded-[1.5rem] border-foreground/10 bg-white/75">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="space-y-1">
              <CardTitle>{place.name}</CardTitle>
              <CardDescription>
                {place.city}, {place.country} · {place.reviewCount} reviews
              </CardDescription>
            </div>
            <p className="text-sm font-medium text-foreground/60">{place.isOpenNow ? "Open now" : "Closed now"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
