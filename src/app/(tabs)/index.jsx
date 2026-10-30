import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme";
import { useRef, useEffect } from "react";
import Week from "../components/Week";
import Workout from "../components/Workout";
import Progress from "../components/Progress";
import ProBadge from "../components/ProBadge";
import { useProfile } from "../../data/ProfileContext";

export default function Tab() {
  const scrollRef = useRef();
  //A plain View with the insets keeps the ScrollView bounded inside the tab pager
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();

  //Runs once when the component mounts
  useEffect(() => {
    //Scroll the week to the right
    scrollRef.current.scrollTo({ x: "50%", animated: false });
  }, []);

  return (
    <View style={[styles.body, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Bentornato ,{" "}
            <Text style={styles.name}>{profile.personal.name}</Text>
          </Text>
          <ProBadge></ProBadge>
        </View>
        <Week ref={scrollRef}></Week>
        <Workout type="preview"></Workout>
        <Progress></Progress>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
