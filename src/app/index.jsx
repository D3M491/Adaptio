import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import Week from "./components/Week";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./theme";
import { useRef } from "react";
import { useEffect } from "react";
import Header from "./components/Header";

export default function Index() {
  const scrollRef = useRef();

  //Eseguito una volta al montaggio del component
  useEffect(() => {
    //Scrolla la week a et
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
    paddingHorizontal: 12,
    display: "flex",
    gap: 20,
  },
});
