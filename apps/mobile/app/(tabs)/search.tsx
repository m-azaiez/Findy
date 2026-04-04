import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { featuredPlaces } from "@findy/shared/constants/mock-data";

import { AppScreen } from "../../src/components/app-screen";
import { PlacePreviewCard } from "../../src/components/place-preview-card";
import { palette } from "../../src/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPlaces = featuredPlaces.filter((place) => {
    if (!normalizedQuery) {
      return true;
    }

    return [place.name, place.city, place.shortDescription, ...place.tags].join(" ").toLowerCase().includes(normalizedQuery);
  });

  return (
    <AppScreen
      eyebrow="Search"
      title="Search structure for the mobile MVP"
      description="This is still local-data driven, but it already maps cleanly to the future shared filters and backend search flow."
    >
      <View style={styles.searchCard}>
        <Text style={styles.label}>Search places</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cafe, gallery, rooftop..."
          placeholderTextColor="#9a8d82"
          style={styles.input}
        />
        <Text style={styles.caption}>
          {filteredPlaces.length} result{filteredPlaces.length === 1 ? "" : "s"}
        </Text>
      </View>

      <View style={styles.list}>
        {filteredPlaces.map((place) => (
          <PlacePreviewCard key={place.id} place={place} />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: "#fff8ef",
    borderColor: palette.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    padding: 16
  },
  label: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700"
  },
  input: {
    backgroundColor: "#fffdf8",
    borderColor: palette.border,
    borderRadius: 14,
    borderWidth: 1,
    color: palette.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  caption: {
    color: palette.muted,
    fontSize: 13
  },
  list: {
    gap: 12
  }
});
