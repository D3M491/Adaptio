import { Pressable, Text, View, ScrollView, StyleSheet } from "react-native";
import { Dumbbell } from "lucide-react-native";
import { useColors, useStyles } from "../../theme";
import week from "../../utils";
import { useProfile } from "../../data/ProfileContext";

//The selected day (activeDay, the key of the day) is kept by the home, onSelect changes it
export default function Week({ ref, activeDay, onSelect }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const { profile } = useProfile();

  //Days of the week chosen for training (profiles saved before this choice don't have them)
  const trainingWeekdays = profile.training?.weekdays ?? [];

  //Creates a button for each day of the week
  const weeks = week().map((day) => {
    const isActiveDay = day.key === activeDay;
    const isToday = day.key === day.today;
    const isTrainingDay = trainingWeekdays.includes(day.weekday);

    //Today has the red background, the selected day only gets the red border
    const textStyles = [
      styles.text,
      isActiveDay && styles.activeText,
      isToday && styles.todayText,
    ];

    return (
      <Pressable
        key={day.key}
        style={[
          styles.day,
          isToday && styles.today,
          isActiveDay && styles.activeDay,
        ]}
        onPress={() => onSelect(day.key)}
      >
        <Text style={textStyles}>{day.dayNumber}</Text>
        <Text style={textStyles}>{day.dayName}</Text>
        {/* A dumbbell on the training days, a dash on the others */}
        <View style={styles.iconSlot}>
          {isTrainingDay ? (
            <Dumbbell
              size={16}
              color={isToday ? colors.onTertiary : colors.tertiary}
            />
          ) : (
            <Text style={[styles.restDash, isToday && styles.todayText]}>
              —
            </Text>
          )}
        </View>
      </Pressable>
    );
  });

  //Maps the days and creates a component for each day
  return (
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.weeksContainer}>{weeks}</View>
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    weeksContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 0,
    },

    day: {
      display: "flex",
      width: 54,
      height: 86,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      //A transparent border, so the selected day doesn't change size
      borderWidth: 1,
      borderColor: "transparent",
      borderRadius: 20,
    },

    today: {
      backgroundColor: colors.tertiaryDark,
    },

    activeDay: {
      borderColor: colors.tertiary,
      borderWidth: 1,
      borderRadius: 20,
    },

    iconSlot: {
      height: 16,
      marginTop: 4,
    },

    restDash: {
      color: colors.secondaryDark,
      fontSize: 14,
      lineHeight: 16,
    },

    title: {
      fontSize: 24,
      color: colors.secondary,
    },

    text: {
      fontSize: 16,
      color: colors.secondaryDark,
    },

    activeText: {
      color: colors.secondary,
    },

    //Text on the red background of today, light in both themes
    todayText: {
      color: colors.onTertiary,
    },
  });
