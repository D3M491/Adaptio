import { View } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../theme";
import { ScrollView } from "react-native";
import week from "../utils";

export default function Week({ ref }) {
  //Crea un button per ogni giorno della settimana
  const weeks = week().map((day) => {
    //Todo Make only one condition
    const isActiveDay = day.key === day.today ? styles.activeDay : undefined;
    const isActiveText = day.key === day.today ? styles.activeText : undefined;

    return (
      <Pressable key={day.key} style={[styles.day, isActiveDay]}>
        <Text style={[styles.text, isActiveText]}>{day.dayNumber}</Text>
        <Text style={[styles.text, isActiveText]}>{day.dayName}</Text>
      </Pressable>
    );
  });

  //Map i giorni e crea per ogni giorno un component
  return (
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.weeksContainer}>{weeks}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  weeksContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },

  day: {
    display: "flex",
    width: 60,
    height: 80,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  activeDay: {
    borderColor: colors.tertiary,
    borderWidth: 1,
    borderRadius: 20,
  },

  title: {
    fontSize: 24,
    color: colors.secondary,
  },

  text: {
    fontSize: 18,
    color: `${colors.secondary}45`,
  },

  activeText: {
    color: colors.secondary,
  },
});
