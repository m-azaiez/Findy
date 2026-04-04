import { Link, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "../../src/components/app-screen";
import { FavoriteButton } from "../../src/components/favorite-button";
import { useFavorites } from "../../src/lib/favorites";
import {
  formatPriceTier,
  getFeaturedPlaceBySlug,
  getPlaceLocationLabel,
  getPlacePrimaryCategory,
  listPlaceReviews
} from "../../src/lib/places";
import { palette } from "../../src/theme";

export default function PlaceDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const place = getFeaturedPlaceBySlug(slug);
  const { isFavorite } = useFavorites();

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

  const category = getPlacePrimaryCategory(place);
  const reviews = listPlaceReviews(place.id);
  const featuredReview = reviews[0];

  return (
    <AppScreen
      eyebrow={category?.name ?? place.city}
      title={place.name}
      description={place.shortDescription}
    >
      <Image source={{ uri: place.coverImageUrl }} style={styles.heroImage} />

      <View style={styles.heroMeta}>
        {category ? (
          <View style={styles.heroChip}>
            <Text style={styles.heroChipText}>{category.name}</Text>
          </View>
        ) : null}
        <View style={styles.heroChip}>
          <Text style={styles.heroChipText}>{place.city}</Text>
        </View>
        <View style={styles.heroChip}>
          <Text style={styles.heroChipText}>{place.isOpenNow ? "Open now" : "Closed now"}</Text>
        </View>
      </View>

      <Text style={styles.locationLead}>{getPlaceLocationLabel(place)}</Text>

      <View style={styles.actions}>
        <FavoriteButton placeId={place.id} isFavorited={isFavorite(place.id)} />
        <Pressable style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Reviews soon</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>At a glance</Text>
        <Text style={styles.panelText}>
          {place.averageRating.toFixed(1)} rating · {place.reviewCount} reviews · {formatPriceTier(place.priceTier)}
        </Text>
        <Text style={styles.panelText}>{getPlaceLocationLabel(place)}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>About this place</Text>
        <Text style={styles.panelBody}>{place.description}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Opening hours</Text>
        <View style={styles.hoursList}>
          {Object.entries(place.openingHours).map(([day, hours]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{day}</Text>
              <Text style={styles.hoursValue}>{hours}</Text>
            </View>
          ))}
        </View>
      </View>

      {featuredReview ? (
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Recent community note</Text>
          <Text style={styles.reviewMeta}>
            {featuredReview.authorName} · {featuredReview.rating.toFixed(1)} / 5
          </Text>
          <Text style={styles.panelBody}>{featuredReview.comment}</Text>
        </View>
      ) : null}

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
  heroImage: {
    borderRadius: 24,
    height: 240,
    width: "100%"
  },
  heroMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  heroChip: {
    backgroundColor: "#fff1de",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  heroChipText: {
    color: palette.brand,
    fontSize: 13,
    fontWeight: "700"
  },
  locationLead: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: "#fffdf8",
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 16
  },
  secondaryActionText: {
    color: palette.text,
    fontSize: 14,
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
  hoursList: {
    gap: 8
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  hoursDay: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  hoursValue: {
    color: palette.muted,
    flexShrink: 1,
    fontSize: 14,
    textAlign: "right"
  },
  reviewMeta: {
    color: palette.brand,
    fontSize: 14,
    fontWeight: "700"
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
