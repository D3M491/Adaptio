import { View } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../theme";
import week from "../utils";

export default function Week() {
  const weeks = week().map((day) => {
    return (
      <View style={styles.day} key={day.key}>
        <Pressable style={styles.day__name}>
          <Text>{day.day}</Text>
        </Pressable>
      </View>
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
  },

  day: {
    border: `1px solid ${colors.tertiary}`,
    borderRadius: ".5rem",
    color: colors.secondary,
  },

  day__name: {
    display: "flex",
    flexDirection: "column",
    width: "3rem",
    height: "3rem",
  },
});
