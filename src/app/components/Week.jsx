import { Pressable, Text, View, ScrollView, StyleSheet } from "react-native";
import { colors } from "../../theme";
import week from "../../utils";
import { useState } from "react";

export default function Week({ ref }) {
  const [activeDay, setActiveDay] = useState(() => week()[0].today);

  //Crea un button per ogni giorno della settimana
  const weeks = week().map((day) => {
    const isActiveDay = day.key === activeDay;

    const textStyles = [styles.text, isActiveDay && styles.activeText];

    return (
      <Pressable
        key={day.key}
        style={[styles.day, isActiveDay && styles.activeDay]}
        onPress={() => setActiveDay(day.key)}
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
    gap: 0,
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
