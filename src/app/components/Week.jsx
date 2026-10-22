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
    justifyContent: "space-around",
    overflow: "scroll",
    gap: "1px",
    marginHorizontal: "1px",
  },

  day: {
    display: "flex",
    border: `1px solid ${colors.tertiary}`,
    borderRadius: "1px",
    color: colors.secondary,
    width: "5px",
    height: "5px",
    textAlign: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: "1.2rem",
  },
});
