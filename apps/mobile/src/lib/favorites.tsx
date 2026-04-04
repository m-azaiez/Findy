import { createContext, type ReactNode, useContext, useState } from "react";

import { featuredPlaces } from "@findy/shared/constants/mock-data";

type FavoritesContextValue = {
  favoriteIds: string[];
  favoritePlaces: typeof featuredPlaces;
  hasFavorites: boolean;
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(featuredPlaces.filter((place) => place.isFavorited).map((place) => place.id));

  function toggleFavorite(placeId: string) {
    setFavoriteIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId]
    );
  }

  function isFavorite(placeId: string) {
    return favoriteIds.includes(placeId);
  }

  const favoritePlaces = featuredPlaces.filter((place) => favoriteIds.includes(place.id));

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoritePlaces,
        hasFavorites: favoritePlaces.length > 0,
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider.");
  }

  return context;
}
