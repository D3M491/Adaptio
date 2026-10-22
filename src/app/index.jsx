import { Text, View } from "react-native";
import Workout from "./components/Workout";
import { StyleSheet } from "react-native";
import Week from "./components/Week";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./theme";

export default function Index() {
  return (
    <SafeAreaView style={styles.body}>
      <Text>
        <Workout>Test</Workout>
        <Week></Week>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.primary,
    height: "100%",
  },
});
