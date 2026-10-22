import { Stack } from "expo-router";
import { colors } from "./theme";
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.secondary,
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index"></Stack.Screen>
      <Stack.Screen name="workout"></Stack.Screen>
    </Stack>
  );
}
