import { StyleSheet, Text, View } from "react-native";

import { featuredPlaces } from "@findy/shared/constants/mock-data";

import { AppScreen } from "../../src/components/app-screen";
import { PlacePreviewCard } from "../../src/components/place-preview-card";
import { palette } from "../../src/theme";

const seededFavorites = featuredPlaces.slice(0, 2);

export default function FavoritesScreen() {
  return (
    <AppScreen
      eyebrow="Favorites"
      title="Saved places shell"
      description="This screen is intentionally simple for now. It establishes the route and UI structure before auth-backed persistence is wired in."
    >
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Temporary state</Text>
        <Text style={styles.noticeBody}>
          Favorites are still mocked from shared data. The next product slice can replace this with real user state.
        </Text>
      </View>

      <View style={styles.list}>
        {seededFavorites.map((place) => (
          <PlacePreviewCard key={place.id} place={{ ...place, isFavorited: true }} />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: palette.brandSoft,
    borderRadius: 20,
    gap: 6,
    padding: 16
  },
  noticeTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700"
  },
  noticeBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  list: {
    gap: 12
  }
});
