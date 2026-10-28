import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";
import { useRef, useEffect } from "react";
import Week from "../components/Week";
import Workout from "../components/Workout";

export default function Tab() {
  const scrollRef = useRef();

  //Eseguito una volta al montaggio del component
  useEffect(() => {
    //Scrolla la week a destra
    scrollRef.current.scrollTo({ x: "50%", animated: false });
  }, []);

  return (
    <SafeAreaView style={styles.body}>
      <Week ref={scrollRef}></Week>
      <Text style={styles.title}>Bentornato , Manuel</Text>
      <Workout></Workout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 20,
  },

  title: {
    color: colors.secondary,
    fontSize: 24,
  },
});
