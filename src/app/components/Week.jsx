import { View } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../theme";
import week from "../utils";

export default function Week() {
  const weeks = week().map((day) => {
    return (
      <View key={day.key}>
        <Pressable style={styles.day}>
          <Text>{day.day}</Text>
        </Pressable>
      </View>
    );
  });

  //Map i giorni e crea per ogni giorno un component
  return <View>{weeks}</View>;
}

const styles = StyleSheet.create({
  day: {
    border: `1px solid ${colors.tertiary}`,
  },
});
