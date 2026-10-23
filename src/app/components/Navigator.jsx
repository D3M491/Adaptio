import { createStaticNavigation } from "expo-router/build/react-navigation";
import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";
import ProfileScreen from "./Profile";
import { StyleSheet } from "react-native";
export default function Navigator() {
  const RootStack = createNativeStackNavigator({
    screens: {
      Profile: {
        screen: ProfileScreen,
      },
    },
  });

  const Navigation = createStaticNavigation(RootStack);
  return <Navigation style={styles.navigator}></Navigation>;
}

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: "red",
  },
});
