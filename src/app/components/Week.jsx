import { View } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../../theme";
import { ScrollView } from "react-native";
import week from "../../utils";

export default function Week({ ref }) {
  //Crea un button per ogni giorno della settimana
  const weeks = week().map((day) => {
    const isActiveDay = day.key === day.today;

    const textStyles = [styles.text, isActiveDay && styles.activeText];

    return (
      <Pressable
        key={day.key}
        style={[styles.day, isActiveDay && styles.activeDay]}
      >
        <Text style={textStyles}>{day.dayNumber}</Text>
        <Text style={textStyles}>{day.dayName}</Text>
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
    gap: 5,
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
    color: colors.secondaryDark,
  },

  activeText: {
    color: colors.secondary,
  },
});
