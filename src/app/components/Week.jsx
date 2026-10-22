import { View } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../theme";
import week from "../utils";

export default function Week() {
  const weeks = week().map((day) => {
    return (
      <Pressable key={day.key} style={styles.day}>
        <Text style={styles.text}>{day.dayNumber}</Text>
        <Text style={styles.text}>{day.dayName}</Text>
      </Pressable>
    );
  });

  //Map i giorni e crea per ogni giorno un component
  return <View style={styles.container}>{weeks}</View>;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
    gap: "20",
    marginLeft: "20",
    // marginHorizontal: "30",
  },

  day: {
    display: "flex",
    borderColor: colors.tertiary,
    borderWidth: "1",
    borderRadius: "10%",
    color: colors.secondary,
    width: "70",
    height: "70",
    textAlign: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: "16",
    color: colors.secondary,
  },
});
