import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "../../src/components/app-screen";
import { useFavorites } from "../../src/lib/favorites";
import { palette } from "../../src/theme";

export default function ProfileScreen() {
  const { favoritePlaces } = useFavorites();

  return (
    <AppScreen
      eyebrow="Profile"
      title="Account and personal activity will live here"
      description="This route is still a placeholder, but it already points at the future home for auth, review history, and personal preferences."
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>F</Text>
        </View>
        <View style={styles.profileMeta}>
          <Text style={styles.profileTitle}>Guest profile</Text>
          <Text style={styles.profileBody}>Sign-in, saved activity sync, and review history can land here in the next product slices.</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{favoritePlaces.length}</Text>
          <Text style={styles.statLabel}>Saved places</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>MVP</Text>
          <Text style={styles.statLabel}>Stage</Text>
        </View>
      </View>

      <View style={styles.roadmapCard}>
        <Text style={styles.roadmapTitle}>Planned here later</Text>
        <Text style={styles.roadmapItem}>Sign in and account creation</Text>
        <Text style={styles.roadmapItem}>Review history and drafts</Text>
        <Text style={styles.roadmapItem}>Notification and preference settings</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 18
  },
  avatar: {
    alignItems: "center",
    backgroundColor: palette.text,
    borderRadius: 999,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  avatarText: {
    color: "#fffdf8",
    fontSize: 20,
    fontWeight: "700"
  },
  profileMeta: {
    flex: 1,
    gap: 4
  },
  profileTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700"
  },
  profileBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  statsRow: {
    flexDirection: "row",
    gap: 12
  },
  statCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    padding: 16
  },
  statValue: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "700"
  },
  statLabel: {
    color: palette.muted,
    fontSize: 13
  },
  roadmapCard: {
    backgroundColor: palette.brandSoft,
    borderRadius: 22,
    gap: 8,
    padding: 18
  },
  roadmapTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700"
  },
  roadmapItem: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  }
});
