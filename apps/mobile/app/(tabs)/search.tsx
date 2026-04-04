import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen } from "../../src/components/app-screen";
import { PlacePreviewCard } from "../../src/components/place-preview-card";
import { useFavorites } from "../../src/lib/favorites";
import { filterPlaces, getCategoryFilters } from "../../src/lib/places";
import { palette } from "../../src/theme";

const categories = getCategoryFilters();

export default function SearchScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { favoriteIds } = useFavorites();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [openNowOnly, setOpenNowOnly] = useState(false);

  useEffect(() => {
    setSelectedCategory(typeof category === "string" ? category : "");
  }, [category]);

  const filteredPlaces = filterPlaces({
    categorySlug: selectedCategory || undefined,
    openNow: openNowOnly,
    query
  });
  const selectedCategoryLabel = categories.find((item) => item.slug === selectedCategory)?.name ?? "All categories";

  return (
    <AppScreen
      eyebrow="Search"
      title="Search places with a lightweight mobile filter flow"
      description="Query, trim the list by category, and keep the controls simple enough for a quick browse on the go."
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
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <Pressable
          onPress={() => setSelectedCategory("")}
          style={[styles.filterChip, !selectedCategory ? styles.filterChipActive : undefined]}
        >
          <Text style={[styles.filterText, !selectedCategory ? styles.filterTextActive : undefined]}>All</Text>
        </Pressable>
        {categories.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setSelectedCategory((current) => (current === item.slug ? "" : item.slug))}
            style={[styles.filterChip, selectedCategory === item.slug ? styles.filterChipActive : undefined]}
          >
            <Text style={[styles.filterText, selectedCategory === item.slug ? styles.filterTextActive : undefined]}>
              {item.name}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setOpenNowOnly((current) => !current)}
          style={[styles.filterChip, openNowOnly ? styles.filterChipActive : undefined]}
        >
          <Text style={[styles.filterText, openNowOnly ? styles.filterTextActive : undefined]}>Open now</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{filteredPlaces.length} places ready to browse</Text>
        <Text style={styles.summaryBody}>
          {selectedCategoryLabel}
          {openNowOnly ? " · Open now only" : ""}
          {query.trim() ? ` · Matching "${query.trim()}"` : ""}
        </Text>
      </View>

      <View style={styles.list}>
        {filteredPlaces.map((place) => (
          <PlacePreviewCard key={place.id} place={place} isFavorited={favoriteIds.includes(place.id)} />
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
  filters: {
    gap: 10,
    paddingRight: 8
  },
  filterChip: {
    alignItems: "center",
    backgroundColor: "#fff8ef",
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 14
  },
  filterChipActive: {
    backgroundColor: palette.text,
    borderColor: palette.text
  },
  filterText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "600"
  },
  filterTextActive: {
    color: "#fffdf8"
  },
  summaryCard: {
    backgroundColor: palette.brandSoft,
    borderRadius: 18,
    gap: 4,
    padding: 14
  },
  summaryTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700"
  },
  summaryBody: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  list: {
    gap: 12
  }
});
