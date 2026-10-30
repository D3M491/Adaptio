import { Stack } from "expo-router";
import { ProfileProvider } from "../data/ProfileContext";

export default function RootLayout() {
  return (
    <ProfileProvider>
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
        {/* Full screen and no swipe back, so a workout isn't closed by mistake */}
        <Stack.Screen
          name="workoutSession"
          options={{ presentation: "fullScreenModal", gestureEnabled: false }}
        ></Stack.Screen>
      </Stack>
    </ProfileProvider>
  );
}
