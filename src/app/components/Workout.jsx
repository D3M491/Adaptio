import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../../theme";
import { useState } from "react";

export default function Workout({ type }) {
  const [todayWorkout, setTodayWorkout] = useState();

  const workouts = [
    {
      day: 1,
      exercises: [
        {
          exerciseName: "Dumbbell Horizontal Bench Press",
          sets: 3,
          reps: 8,
          RPE: 1,
          rest: 90,
        },
        {
          exerciseName: "Pectoral Machine",
          sets: 3,
          reps: 12,
          tecnhique: "dropset",
          RPE: 1,
          rest: 90,
        },
        {
          exerciseName: "45° Chest press",
          sets: 3,
          reps: 10,
          RPE: 1,
          rest: 90,
        },
      ],
    },
    {
      day: 2,
      exercises: [
        {
          exerciseName: "Barbbell Row",
          sets: 4,
          reps: 10,
          RPE: 1,
          rest: 120,
        },
        {
          exerciseName: "Lat Machine",
          sets: 3,
          reps: 10,
          tecnhique: "dropset",
          RPE: 1,
          rest: 90,
        },
        {
          exerciseName: "Pulldown Rope",
          sets: 3,
          reps: 15,
          RPE: 1,
          rest: 90,
        },
      ],
    },
    {
      day: 3,
      exercises: [
        {
          exerciseName: "Dumbbell Horizontal Bench Press",
          sets: 3,
          reps: 8,
          RPE: 1,
          rest: 90,
        },
        {
          exerciseName: "Pectoral Machine",
          sets: 3,
          reps: 12,
          tecnhique: "dropset",
          RPE: 1,
          rest: 90,
        },
        {
          exerciseName: "45° Chest press",
          sets: 3,
          reps: 10,
          RPE: 1,
          rest: 90,
        },
      ],
    },
  ];

  return type === "preview" ? (
    <View type={type}>
      <Text style={styles.sectionText}>WORKOUT</Text>
      <View style={styles.workoutPreview}></View>
    </View>
  ) : (
    <View type={type}>
      <Text style={styles.sectionText}>porcodiio</Text>
      <View style={styles.workoutPreview}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionText: {
    color: colors.secondaryDark,
    marginBottom: 10,
  },
  workoutPreview: {
    padding: 20,
    borderColor: colors.secondaryDark,
    borderWidth: 1,
    borderRadius: 14,
  },
});
