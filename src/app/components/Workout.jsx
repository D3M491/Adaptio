import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Pencil } from "lucide-react-native";
import { colors } from "../../theme";
import { getCurrentWorkout } from "../../data/workouts";
import ProBadge from "./ProBadge";

//Esercizi visibili nella preview quando il pannello e' chiuso
const COLLAPSED_EXERCISES = 3;

export default function Workout({ type }) {
  const [expanded, setExpanded] = useState(false);
  const currentWorkout = getCurrentWorkout();

  //Per ora il workout di oggi e' il primo giorno del workout corrente
  const nextDay = currentWorkout?.days[0];

  //Quanti sono gli esercizi nascosti?
  const hiddenCount = nextDay
    ? Math.max(nextDay.exercises.length - COLLAPSED_EXERCISES, 0)
    : 0;

  //Da chiuso mostra i primi esercizi, da aperto tutti
  const previewExercises = nextDay
    ? expanded
      ? nextDay.exercises
      : nextDay.exercises.slice(0, COLLAPSED_EXERCISES)
    : [];

  const todayWorkout = (
    <View type={type}>
      <Text style={styles.sectionText}>WORKOUT</Text>
      <View style={styles.workoutPreview}>
        {nextDay ? (
          <>
            <View style={styles.previewHeader}>
              <View>
                <Text style={styles.dayLabel}>DAY {nextDay.day}</Text>
                <Text style={styles.dayTitle}>{nextDay.name}</Text>
              </View>
              <Pressable style={styles.startButton}>
                <Text style={styles.startText}>Start</Text>
              </Pressable>
            </View>

            {previewExercises.map((exercise) => (
              <View key={exercise.exerciseName} style={styles.previewExercise}>
                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.sets} x {exercise.reps}
                </Text>
              </View>
            ))}

            {hiddenCount > 0 && (
              <Pressable onPress={() => setExpanded(!expanded)}>
                <Text style={styles.toggleText}>
                  {expanded ? "Mostra meno" : `Mostra tutto (+${hiddenCount})`}
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <Text style={styles.exerciseDetails}>Nessun workout</Text>
        )}
      </View>
    </View>
  );

  //Mostra il workout corrente, con i suoi giorni ed esercizi
  const workoutsList = currentWorkout && (
    <View>
      <Text style={styles.workoutTitle}>
        {currentWorkout.name.toUpperCase()}
      </Text>
      {currentWorkout.days.map((day) => (
        <View key={day.day} style={styles.workoutPreview}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.dayLabel}>DAY {day.day}</Text>
              <Text style={styles.dayTitle}>{day.name}</Text>
            </View>
            <Pressable hitSlop={10} style={styles.editButton}>
              <Pencil size={22} color={colors.tertiary} />
            </Pressable>
          </View>
          {day.exercises.map((exercise) => (
            <View key={exercise.exerciseName} style={styles.exercise}>
              <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
              <Text style={styles.exerciseDetails}>
                {exercise.sets} x {exercise.reps}
                {exercise.technique ? ` · ${exercise.technique}` : ""}
                {` · RPE ${exercise.RPE} · ${exercise.rest}s`}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  return type === "preview" ? (
    todayWorkout
  ) : (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Workout Attuale</Text>
          <ProBadge></ProBadge>
        </View>
        {workoutsList}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 20,
    padding: 20,
  },
  sectionText: {
    color: colors.secondaryDark,
    marginBottom: 10,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    color: colors.secondary,
    fontSize: 24,
  },
  workoutTitle: {
    color: colors.secondaryDark,
    fontSize: 18,
    marginBottom: 10,
  },
  workoutPreview: {
    padding: 20,
    marginBottom: 10,
    borderColor: colors.secondaryDark,
    borderWidth: 1,
    borderRadius: 14,
  },
  dayLabel: {
    color: colors.tertiary,
    marginBottom: 4,
  },
  dayTitle: {
    color: colors.secondary,
    fontSize: 18,
    marginBottom: 6,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    alignSelf: "flex-start",
  },
  startButton: {
    backgroundColor: colors.tertiary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startText: {
    color: colors.secondary,
  },
  previewExercise: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  toggleText: {
    color: colors.tertiary,
    marginTop: 14,
  },
  exercise: {
    marginTop: 8,
  },
  exerciseName: {
    color: colors.secondary,
  },
  exerciseDetails: {
    color: colors.secondaryDark,
  },
});
