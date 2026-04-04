import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { AppScreen } from "../src/components/app-screen";
import { palette } from "../src/theme";

export default function NotFoundScreen() {
  return (
    <AppScreen title="Screen not found" description="This route is not wired into the mobile MVP yet.">
      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Back to home</Text>
        </Pressable>
      </Link>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: palette.text,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  buttonText: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "700"
  }
});
