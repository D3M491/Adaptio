import { Stack } from "expo-router";
export default function RootLayout() {
  console.log("root layout");
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)"></Stack.Screen>
    </Stack>
  );
}
