import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";
import { useRef, useEffect } from "react";
import Week from "../components/Week";
import Workout from "../components/Workout";
import Progress from "../components/Progress";

export default function Tab() {
  const scrollRef = useRef();

  //Eseguito una volta al montaggio del component
  useEffect(() => {
    //Scrolla la week a destra
    scrollRef.current.scrollTo({ x: "50%", animated: false });
  }, []);

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.title}>
        Bentornato , <Text style={styles.name}>Manuel</Text>
      </Text>
      <Week ref={scrollRef}></Week>
      <Workout type="preview"></Workout>
      <Progress></Progress>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 12,
  },

  title: {
    color: colors.secondaryDark,
    fontSize: 24,
  },

  name: {
    color: colors.secondary,
  },
});
