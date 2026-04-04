import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { type Place } from "@findy/shared/domain";

import { getPlaceLocationLabel, getPlacePrimaryCategory } from "../lib/places";
import { palette } from "../theme";

type PlacePreviewCardProps = {
  isFavorited?: boolean;
  place: Place;
};

export function PlacePreviewCard({ place, isFavorited = false }: PlacePreviewCardProps) {
  const category = getPlacePrimaryCategory(place);

  return (
    <Link
      href={{
        pathname: "/place/[slug]",
        params: {
          slug: place.slug
        }
      }}
      asChild
    >
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : undefined]}>
        <Image source={{ uri: place.coverImageUrl }} style={styles.image} />

        <View style={styles.row}>
          <View style={styles.meta}>
            <View style={styles.badges}>
              {category ? (
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{category.name}</Text>
                </View>
              ) : null}
              {isFavorited ? (
                <View style={[styles.badgePill, styles.savedPill]}>
                  <Text style={[styles.badgePillText, styles.savedPillText]}>Saved</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.title}>{place.name}</Text>
            <Text style={styles.location}>{getPlaceLocationLabel(place)}</Text>
          </View>
          <Text style={styles.rating}>{place.averageRating.toFixed(1)}</Text>
        </View>

        <Text style={styles.description}>{place.shortDescription}</Text>

        <View style={styles.footer}>
          <Text style={styles.caption}>{place.reviewCount} reviews</Text>
          <Text style={styles.badge}>{place.isOpenNow ? "Open now" : "Closed now"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffdf8",
    borderColor: palette.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    overflow: "hidden",
    padding: 16
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }]
  },
  image: {
    borderRadius: 16,
    height: 184,
    width: "100%"
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  meta: {
    flex: 1,
    gap: 6
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  badgePill: {
    backgroundColor: "#fff1de",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  badgePillText: {
    color: palette.brand,
    fontSize: 12,
    fontWeight: "700"
  },
  savedPill: {
    backgroundColor: palette.text
  },
  savedPillText: {
    color: "#fffdf8"
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700"
  },
  location: {
    color: palette.brand,
    fontSize: 14,
    fontWeight: "600"
  },
  rating: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700"
  },
  description: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  badge: {
    color: palette.brand,
    fontSize: 13,
    fontWeight: "700"
  },
  caption: {
    color: palette.muted,
    fontSize: 13
  }
});
