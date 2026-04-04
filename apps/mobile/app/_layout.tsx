import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { palette } from "../src/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
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
    </>
  );
}
