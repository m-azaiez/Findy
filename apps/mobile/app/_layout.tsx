import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FavoritesProvider } from "../src/lib/favorites";
import { palette } from "../src/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: palette.background
            },
            headerTintColor: palette.text,
            headerTitleStyle: {
              color: palette.text,
              fontWeight: "700"
            },
            contentStyle: {
              backgroundColor: palette.background
            }
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="place/[slug]" options={{ title: "Place Details" }} />
        </Stack>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
