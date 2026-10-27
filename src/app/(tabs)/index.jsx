import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";
import { useRef, useEffect } from "react";
import Week from "../components/Week";
import Header from "../components/Header";

export default function Tab() {
  const scrollRef = useRef();

  //Eseguito una volta al montaggio del component
  useEffect(() => {
    //Scrolla la week a destra
    scrollRef.current.scrollTo({ x: "50%", animated: false });
  }, []);

  return (
    <SafeAreaView style={styles.body}>
      <Header></Header>
      <Week ref={scrollRef}></Week>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.primary,
    height: "100%",
    paddingTop: 20,
    gap: 20,
  },
});
