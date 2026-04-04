import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { type Place } from "@findy/shared/domain";

import { palette } from "../theme";

type PlacePreviewCardProps = {
  place: Place;
};

export function PlacePreviewCard({ place }: PlacePreviewCardProps) {
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
        <View style={styles.row}>
          <View style={styles.meta}>
            <Text style={styles.title}>{place.name}</Text>
            <Text style={styles.location}>
              {place.city}, {place.country}
            </Text>
          </View>
          <Text style={styles.rating}>{place.averageRating.toFixed(1)}</Text>
        </View>

        <Text style={styles.description}>{place.shortDescription}</Text>

        <View style={styles.footer}>
          <Text style={styles.badge}>{place.priceTier}</Text>
          <Text style={styles.caption}>{place.isOpenNow ? "Open now" : "Closed now"}</Text>
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
    padding: 16
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }]
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  meta: {
    flex: 1,
    gap: 4
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
    fontWeight: "700",
    textTransform: "capitalize"
  },
  caption: {
    color: palette.muted,
    fontSize: 13
  }
});
