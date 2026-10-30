import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useState, useEffect } from "react";
import { ProfileProvider, useProfile } from "../data/ProfileContext";
import { RatingsProvider } from "../data/RatingsContext";
import { ThemeProvider, useScheme } from "../theme";
import { LanguageProvider, useT, useLanguage } from "../i18n";
import { syncReminders } from "../notifications";
import Intro, { IntroContext } from "./components/Intro";

//Keeps the native splash until the intro is ready
SplashScreen.preventAutoHideAsync();

//Light icons in the status bar on the dark theme, dark icons on the light one
function ThemedStatusBar() {
  const scheme = useScheme();
  return <StatusBar style={scheme === "dark" ? "light" : "dark"} />;
}

//Needs to be inside ProfileProvider to read if the first-launch form is done
function RootStack() {
  const { profile } = useProfile();
  const t = useT();
  const { language } = useLanguage();

  //Keeps the weekly reminders in line with the settings and the training days
  const { reminderEnabled, reminderHour, reminderMinute } = profile.settings;
  const weekdays = profile.training.weekdays ?? [];
  const weekdaysKey = weekdays.join(",");

  useEffect(() => {
    syncReminders({
      enabled: reminderEnabled && profile.onboarded,
      hour: reminderHour,
      minute: reminderMinute,
      weekdays,
      title: t("notifications.reminderTitle"),
      body: t("notifications.reminderBody"),
    }).catch(() => {});
  }, [
    reminderEnabled,
    reminderHour,
    reminderMinute,
    weekdaysKey,
    profile.onboarded,
    language,
  ]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      {/* The app is available only after the first-launch form */}
      <Stack.Protected guard={profile.onboarded}>
        <Stack.Screen name="(tabs)"></Stack.Screen>
        <Stack.Screen name="workoutDetail"></Stack.Screen>
        <Stack.Screen
          name="pro"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        ></Stack.Screen>
        {/* Full screen and no swipe back, so a workout isn't closed by mistake */}
        <Stack.Screen
          name="workoutSession"
          options={{ presentation: "fullScreenModal", gestureEnabled: false }}
        ></Stack.Screen>
      </Stack.Protected>
      <Stack.Protected guard={!profile.onboarded}>
        <Stack.Screen
          name="onboarding"
          options={{ animation: "fade", gestureEnabled: false }}
        ></Stack.Screen>
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <ProfileProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ThemedStatusBar />
          <RatingsProvider>
            <IntroContext.Provider value={introDone}>
              <RootStack />
            </IntroContext.Provider>
          </RatingsProvider>
          {/* The intro is always dark, like the splash screen it continues */}
          {!introDone && <Intro onFinish={() => setIntroDone(true)} />}
        </LanguageProvider>
      </ThemeProvider>
    </ProfileProvider>
  );
}
