import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "../../src/components/app-screen";
import { PlacePreviewCard } from "../../src/components/place-preview-card";
import { useFavorites } from "../../src/lib/favorites";
import { getDiscoveryCollections, getFeaturedPlaces } from "../../src/lib/places";
import { palette } from "../../src/theme";

const featuredPlaces = getFeaturedPlaces(3);
const discoveryCollections = getDiscoveryCollections();

export default function HomeScreen() {
  const { favoritePlaces, isFavorite } = useFavorites();

  return (
    <AppScreen
      eyebrow="Findy mobile"
      title="Find a place that fits the plan you actually have"
      description="Start with a few curated directions, then open a place and save it for later. This is the first real mobile flow for the MVP."
    >
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Today’s shortcut</Text>
        <Text style={styles.welcomeBody}>
          Browse a few strong options, then use Favorites to keep the shortlist visible across the app.
        </Text>
        <Text style={styles.welcomeMeta}>
          {favoritePlaces.length} saved place{favoritePlaces.length === 1 ? "" : "s"} right now
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Curated discovery</Text>
        <Text style={styles.sectionDescription}>
          Quick entry points for common moods and lightweight trip plans.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.discoveryRail}
      >
        {discoveryCollections.map((collection) => (
          <Link
            key={collection.id}
            href={{
              pathname: "/search",
              params: {
                category: collection.category.slug
              }
            }}
            asChild
          >
            <Pressable style={({ pressed }) => [styles.discoveryCard, pressed ? styles.discoveryCardPressed : undefined]}>
              <Text style={styles.discoveryEyebrow}>{collection.category.name}</Text>
              <Text style={styles.discoveryTitle}>{collection.title}</Text>
              <Text style={styles.discoveryBody}>{collection.description}</Text>
              <Text style={styles.discoveryLink}>Explore {collection.place.name}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured places</Text>
        <Text style={styles.sectionDescription}>
          A small set of strong options to make the first session feel useful immediately.
        </Text>
      </View>

      <View style={styles.list}>
        {featuredPlaces.map((place) => (
          <PlacePreviewCard key={place.id} place={place} isFavorited={isFavorite(place.id)} />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: "#fff8ef",
    borderColor: palette.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    padding: 16
  },
  welcomeTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700"
  },
  welcomeBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  welcomeMeta: {
    color: palette.brand,
    fontSize: 13,
    fontWeight: "700"
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "700"
  },
  sectionDescription: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  discoveryRail: {
    gap: 12,
    paddingRight: 8
  },
  discoveryCard: {
    backgroundColor: "#fff1de",
    borderRadius: 22,
    gap: 8,
    padding: 18,
    width: 248
  },
  discoveryCardPressed: {
    opacity: 0.92
  },
  discoveryEyebrow: {
    color: palette.brand,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase"
  },
  discoveryTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700"
  },
  discoveryBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  discoveryLink: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700"
  },
  list: {
    gap: 12
  }
});
