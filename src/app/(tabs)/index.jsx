import { StyleSheet, Text, View, ScrollView, AppState } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "../../theme";
import { useRef, useEffect, useState } from "react";
import week from "../../utils";
import Week from "../components/Week";
import Workout from "../components/Workout";
import Progress from "../components/Progress";
import ProBadge from "../components/ProBadge";
import GlassBackground from "../components/GlassBackground";
import { TAB_BAR_SPACE } from "../components/GlassTabBar";
import { useProfile } from "../../data/ProfileContext";
import { useT, useLanguage } from "../../i18n";

export default function Tab() {
  const styles = useStyles(createStyles);
  const t = useT();
  const { locale } = useLanguage();
  const scrollRef = useRef();
  //A plain View with the insets keeps the ScrollView bounded inside the tab pager
  const insets = useSafeAreaInsets();
  const { profile, justOnboarded } = useProfile();

  //The day the user picked in the week, null until then: the workout shown depends on it
  const [pickedKey, setPickedKey] = useState(null);
  //Counts the returns to the app, so the home is drawn again (and follows a new day) after the
  //phone was left with the app open overnight
  const [, setReturns] = useState(0);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setReturns((count) => count + 1);
    });
    return () => subscription.remove();
  }, []);

  //Without a pick, or when the picked day is gone from the week, the day is today
  const days = week(locale);
  const selectedDay =
    days.find((day) => day.key === pickedKey) ??
    days.find((day) => day.key === day.today);
  const selectedKey = selectedDay.key;

  //Runs once when the component mounts
  useEffect(() => {
    //Scroll the week to the right
    scrollRef.current.scrollTo({ x: "50%", animated: false });
  }, []);

  return (
    <View style={[styles.body, { paddingTop: insets.top }]}>
      <GlassBackground />
      {/* "handled" lets the buttons of the edit dialog work on the first tap: the dialog is
          inside this ScrollView, which would otherwise use the tap only to close the keyboard */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {t(justOnboarded ? "home.greetingFirst" : "home.greetingReturn")}{" "}
            <Text style={styles.name}>{profile.personal.name}</Text>
          </Text>
          <ProBadge></ProBadge>
        </View>
        <Week
          ref={scrollRef}
          activeDay={selectedKey}
          onSelect={setPickedKey}
        ></Week>
        <Workout
          type="preview"
          selectedDate={selectedDay?.date}
        ></Workout>
        <Progress></Progress>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: colors.primary,
    },

    content: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: TAB_BAR_SPACE,
      gap: 12,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      color: colors.secondaryDark,
      fontSize: 24,
    },

    name: {
      color: colors.secondary,
    },
  });
