import { View, StyleSheet, Text } from "react-native";

import { featuredPlaces } from "@findy/shared/constants/mock-data";

import { AppScreen } from "../../src/components/app-screen";
import { PlacePreviewCard } from "../../src/components/place-preview-card";
import { palette } from "../../src/theme";

const productSignals = [
  { label: "Featured places", value: String(featuredPlaces.length) },
  { label: "Ready routes", value: "4" },
  { label: "Shared package", value: "Live" }
];

export default function HomeScreen() {
  return (
    <AppScreen
      eyebrow="Mobile MVP"
      title="Curated discovery built around real-world plans"
      description="This first mobile pass sets the navigation, route structure, and shared-data integration for the product-facing app."
    >
      <View style={styles.metrics}>
        {productSignals.map((signal) => (
          <View key={signal.label} style={styles.metricCard}>
            <Text style={styles.metricValue}>{signal.value}</Text>
            <Text style={styles.metricLabel}>{signal.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured now</Text>
        <Text style={styles.sectionDescription}>
          These cards are coming from the shared package and already link into a mobile place detail route.
        </Text>
      </View>

      <View style={styles.list}>
        {featuredPlaces.map((place) => (
          <PlacePreviewCard key={place.id} place={place} />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  metricCard: {
    backgroundColor: "#fff8ef",
    borderColor: palette.border,
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 104,
    paddingHorizontal: 14,
    paddingVertical: 14
  },
  metricValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "700"
  },
  metricLabel: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 4
  },
  section: {
    gap: 8,
    marginTop: 4
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
  list: {
    gap: 12
  }
});
