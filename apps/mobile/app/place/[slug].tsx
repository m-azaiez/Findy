import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "../../src/components/app-screen";
import { getFeaturedPlaceBySlug } from "../../src/lib/places";
import { palette } from "../../src/theme";

export default function PlaceDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const place = getFeaturedPlaceBySlug(slug);

  if (!place) {
    return (
      <AppScreen title="Place not found" description="This place is not available in the current mobile mock dataset.">
        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Return home</Text>
          </Pressable>
        </Link>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      eyebrow={place.city}
      title={place.name}
      description={`${place.shortDescription} This detail route is now ready for real API-backed place loading in the next slice.`}
    >
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Quick summary</Text>
        <Text style={styles.panelText}>
          {place.averageRating.toFixed(1)} rating · {place.reviewCount} reviews · {place.priceTier}
        </Text>
        <Text style={styles.panelText}>
          {place.address}, {place.country}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Why it belongs in the MVP</Text>
        <Text style={styles.panelBody}>{place.description}</Text>
      </View>

      <View style={styles.tags}>
        {place.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: palette.text,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  backButtonText: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "700"
  },
  panel: {
    backgroundColor: "#fff8ef",
    borderColor: palette.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    padding: 16
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700"
  },
  panelText: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  panelBody: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 24
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  tag: {
    backgroundColor: "#fff1de",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  tagText: {
    color: palette.brand,
    fontSize: 13,
    fontWeight: "700"
  }
});
