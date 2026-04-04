import { type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, spacing } from "../theme";

type AppScreenProps = {
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
};

export function AppScreen({ children, description, eyebrow, title }: AppScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  content: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.screenVertical
  },
  hero: {
    gap: 8
  },
  eyebrow: {
    color: palette.brand,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  title: {
    color: palette.text,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38
  },
  description: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 24
  }
});
