import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)"></Stack.Screen>
      <Stack.Screen
        name="pro"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      ></Stack.Screen>
    </Stack>
  );
}
