import { Text, View } from "react-native";
import Workout from "./components/Workout";
import { StyleSheet } from "react-native";
import Week from "./components/Week";

export default function Index() {
  return (
    <View style={styles.body}>
      <Text>
        <Workout>Test</Workout>
        <Week></Week>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#150909",
    height: "100vh",
  },
});
