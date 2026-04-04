import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { featuredPlaces } from "@findy/shared/constants/mock-data";
import { type Place } from "@findy/shared/domain";

function PlaceCard({ place }: { place: Place }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{place.name}</Text>
      <Text style={styles.cardMeta}>
        {place.city}, {place.country}
      </Text>
      <Text style={styles.cardBody}>{place.shortDescription}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Findy Mobile</Text>
        <Text style={styles.title}>User-facing mobile product</Text>
        <Text style={styles.description}>
          This Expo app is the new mobile workspace. The existing Next.js app remains the admin and backoffice
          surface in apps/web.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared package smoke test</Text>
          <Text style={styles.description}>
            The cards below are rendered from @findy/shared constants and domain types.
          </Text>
        </View>

        <View style={styles.list}>
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4efe7"
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 16
  },
  eyebrow: {
    color: "#8a5c2a",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    color: "#1c1917",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38
  },
  description: {
    color: "#57534e",
    fontSize: 16,
    lineHeight: 24
  },
  section: {
    marginTop: 8,
    gap: 8
  },
  sectionTitle: {
    color: "#1c1917",
    fontSize: 18,
    fontWeight: "700"
  },
  list: {
    gap: 12
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e7d8c7",
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 16
  },
  cardTitle: {
    color: "#1c1917",
    fontSize: 18,
    fontWeight: "700"
  },
  cardMeta: {
    color: "#8a5c2a",
    fontSize: 14,
    fontWeight: "600"
  },
  cardBody: {
    color: "#44403c",
    fontSize: 15,
    lineHeight: 22
  }
});
