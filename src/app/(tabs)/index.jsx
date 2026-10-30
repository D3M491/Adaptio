import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "../../theme";
import { useRef, useEffect, useState } from "react";
import week from "../../utils";
import Week from "../components/Week";
import Workout from "../components/Workout";
import Progress from "../components/Progress";
import ProBadge from "../components/ProBadge";
import { useProfile } from "../../data/ProfileContext";

export default function Tab() {
  const styles = useStyles(createStyles);
  const scrollRef = useRef();
  //A plain View with the insets keeps the ScrollView bounded inside the tab pager
  const insets = useSafeAreaInsets();
  const { profile, justOnboarded } = useProfile();

  //The day selected in the week, today at the start: the workout shown depends on it
  const [selectedKey, setSelectedKey] = useState(() => week()[0].today);
  const selectedDay = week().find((day) => day.key === selectedKey);

  //Runs once when the component mounts
  useEffect(() => {
    //Scroll the week to the right
    scrollRef.current.scrollTo({ x: "50%", animated: false });
  }, []);

  return (
    <View style={[styles.body, { paddingTop: insets.top }]}>
      {/* "handled" lets the buttons of the edit dialog work on the first tap: the dialog is
          inside this ScrollView, which would otherwise use the tap only to close the keyboard */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {justOnboarded ? "Benvenuto" : "Bentornato"} ,{" "}
            <Text style={styles.name}>{profile.personal.name}</Text>
          </Text>
          <ProBadge></ProBadge>
        </View>
        <Week
          ref={scrollRef}
          activeDay={selectedKey}
          onSelect={setSelectedKey}
        ></Week>
        <Workout
          type="preview"
          selectedWeekday={selectedDay?.weekday}
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
      paddingBottom: 30,
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
