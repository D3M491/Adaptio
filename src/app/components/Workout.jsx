import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Pencil, ChevronDown, ChevronUp } from "lucide-react-native";
import { colors } from "../../theme";
import { getCurrentWorkout } from "../../data/workouts";
import ProBadge from "./ProBadge";

//Exercises shown in the preview when the panel is collapsed
const COLLAPSED_EXERCISES = 3;

export default function Workout({ type }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const currentWorkout = getCurrentWorkout();

  //For now today's workout is the first day of the current workout
  const nextDay = currentWorkout?.days[0];

  //How many exercises are hidden?
  const hiddenCount = nextDay
    ? Math.max(nextDay.exercises.length - COLLAPSED_EXERCISES, 0)
    : 0;

  //Collapsed shows the first exercises, expanded shows all
  const previewExercises = nextDay
    ? expanded
      ? nextDay.exercises
      : nextDay.exercises.slice(0, COLLAPSED_EXERCISES)
    : [];

  const todayWorkout = (
    <View type={type}>
      <Text style={styles.sectionText}>WORKOUT</Text>
      {/* Tapping the card expands it, only the Start button starts the workout */}
      <Pressable
        disabled={hiddenCount === 0}
        onPress={() => setExpanded(!expanded)}
        style={({ pressed }) => [
          styles.workoutPreview,
          pressed && styles.cardPressed,
        ]}
      >
        {nextDay ? (
          <>
            <View style={styles.previewHeader}>
              <View>
                <Text style={styles.dayLabel}>DAY {nextDay.day}</Text>
                <Text style={styles.dayTitle}>{nextDay.name}</Text>
              </View>
              <Pressable
                style={styles.startButton}
                onPress={() =>
                  router.push({
                    pathname: "/workoutSession",
                    params: { workoutId: currentWorkout.id, day: nextDay.day },
                  })
                }
              >
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
              <View style={styles.toggle}>
                {expanded ? (
                  <ChevronUp size={20} color={colors.secondaryDark} />
                ) : (
                  <>
                    <Text style={styles.toggleText}>+{hiddenCount}</Text>
                    <ChevronDown size={20} color={colors.secondaryDark} />
                  </>
                )}
              </View>
            )}
          </>
        ) : (
          <Text style={styles.exerciseDetails}>Nessun workout</Text>
        )}
      </Pressable>
    </View>
  );

  //Shows the current workout, with its days and exercises
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
                {exercise.technique && (
                  <Text>
                    {" · "}
                    <Text style={styles.technique}>{exercise.technique}</Text>
                  </Text>
                )}
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
    //A plain View with the insets keeps the ScrollView bounded inside the tab pager
    <View style={[styles.page, { paddingTop: insets.top }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
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
    borderRadius: 8,
  },
  startText: {
    color: colors.secondary,
  },
  previewExercise: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  toggleText: {
    color: colors.secondaryDark,
  },
  cardPressed: {
    backgroundColor: colors.primaryLight,
  },
  exercise: {
    marginTop: 8,
  },
  exerciseName: {
    color: colors.secondary,
  },
  technique: {
    color: colors.tertiary,
  },
  exerciseDetails: {
    color: colors.secondaryDark,
  },
});
