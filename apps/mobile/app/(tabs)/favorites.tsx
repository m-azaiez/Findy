import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "../../src/components/app-screen";
import { PlacePreviewCard } from "../../src/components/place-preview-card";
import { useFavorites } from "../../src/lib/favorites";
import { palette } from "../../src/theme";

export default function FavoritesScreen() {
  const { favoritePlaces, hasFavorites } = useFavorites();

  return (
    <AppScreen
      eyebrow="Favorites"
      title="Saved places for the next step in the day"
      description="Favorites are local to the app for now. That keeps the MVP flow believable without waiting on auth or backend persistence."
    >
      {!hasFavorites ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No saved places yet</Text>
          <Text style={styles.emptyBody}>
            Open a place and tap Save to build a shortlist. Once a place is saved, it appears here immediately.
          </Text>
          <View style={styles.actions}>
            <Link href="/" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Browse home</Text>
              </Pressable>
            </Link>
            <Link href="/search" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Open search</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      ) : null}

      {hasFavorites ? (
        <>
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>{favoritePlaces.length} place{favoritePlaces.length === 1 ? "" : "s"} saved</Text>
            <Text style={styles.noticeBody}>Tap a saved place to reopen the detail view and keep refining the shortlist.</Text>
          </View>

          <View style={styles.list}>
            {favoritePlaces.map((place) => (
              <PlacePreviewCard key={place.id} place={place} isFavorited />
            ))}
          </View>
        </>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    backgroundColor: "#fff8ef",
    borderColor: palette.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 18
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "700"
  },
  emptyBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4
  },
  primaryButton: {
    backgroundColor: palette.text,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: "#fffdf8",
    fontSize: 14,
    fontWeight: "700"
  },
  secondaryButton: {
    backgroundColor: "#fffdf8",
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700"
  },
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
