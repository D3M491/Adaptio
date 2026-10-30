import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronUp, ChevronRight, Moon } from "lucide-react-native";
import { useColors, useStyles } from "../../theme";
import {
  getWorkouts,
  getWorkoutById,
  getWorkoutDayForWeekday,
} from "../../data/workouts";
import { useProfile } from "../../data/ProfileContext";
import ProBadge from "./ProBadge";
import SourceTag from "./SourceTag";

//Exercises shown in the preview when the panel is collapsed
const COLLAPSED_EXERCISES = 3;

//A workout in the list: name and where it comes from, with the number of days on the right.
//Tapping it opens the workout
function WorkoutCard({ workout, isCurrent, onPress }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.workoutPreview,
        styles.workoutCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardInfo}>
        {isCurrent && <Text style={styles.dayLabel}>ATTUALE</Text>}
        <Text style={styles.dayTitle}>{workout.name}</Text>
        <SourceTag source={workout.source} />
      </View>

      <View style={styles.daysBadge}>
        <Text style={styles.daysNumber}>{workout.days.length}</Text>
        <Text style={styles.daysLabel}>
          {workout.days.length === 1 ? "giorno" : "giorni"}
        </Text>
      </View>
      <ChevronRight size={22} color={colors.secondaryDark} />
    </Pressable>
  );
}

//selectedWeekday is the day selected in the week of the home (0 = Sunday ... 6 = Saturday)
export default function Workout({ type, selectedWeekday }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const [expanded, setExpanded] = useState(false);

  //Undefined until the user sets a workout in the Workout tab
  const currentWorkout = getWorkoutById(profile.currentWorkoutId);

  //The workout of the selected day follows the training days chosen by the user. Without
  //training days nothing is planned, so the first day of the workout is shown
  const weekdays = profile.training?.weekdays ?? [];
  const nextDay = !currentWorkout
    ? undefined
    : weekdays.length === 0
      ? currentWorkout.days[0]
      : getWorkoutDayForWeekday(currentWorkout, weekdays, selectedWeekday);

  //A workout is set but nothing is planned on the selected day
  const isRestDay = currentWorkout !== undefined && !nextDay;

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

  function openWorkout(id) {
    router.push({ pathname: "/workoutDetail", params: { id } });
  }

  //Without a workout the home asks to set one, in the Workout tab
  const setWorkoutButton = (
    <Pressable
      onPress={() => router.navigate("/workoutTab")}
      style={({ pressed }) => [
        styles.setButton,
        pressed && styles.setButtonPressed,
      ]}
    >
      <Text style={styles.setButtonText}>Imposta workout</Text>
    </Pressable>
  );

  const todayWorkout = (
    <View type={type}>
      <Text style={styles.sectionText}>WORKOUT</Text>
      {isRestDay ? (
        <View style={[styles.workoutPreview, styles.restCard]}>
          <Moon size={22} color={colors.secondaryDark} />
          <Text style={styles.restTitle}>Rest day</Text>
        </View>
      ) : nextDay ? (
        // Tapping the card expands it, only the Start button starts the workout
        <Pressable
          disabled={hiddenCount === 0}
          onPress={() => setExpanded(!expanded)}
          style={({ pressed }) => [
            styles.workoutPreview,
            pressed && styles.cardPressed,
          ]}
        >
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

          {previewExercises.map((exercise, index) => (
            <View
              key={`${exercise.exerciseName}-${index}`}
              style={styles.previewExercise}
            >
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
        </Pressable>
      ) : (
        setWorkoutButton
      )}
    </View>
  );

  //The current workout first, then the others to choose from
  const otherWorkouts = getWorkouts().filter(
    (workout) => workout.id !== currentWorkout?.id,
  );

  const workoutsList = (
    <>
      <View>
        <Text style={styles.sectionText}>WORKOUT ATTUALE</Text>
        {currentWorkout ? (
          <WorkoutCard
            workout={currentWorkout}
            isCurrent
            onPress={() => openWorkout(currentWorkout.id)}
          />
        ) : (
          <View style={styles.workoutPreview}>
            <Text style={styles.exerciseDetails}>
              Nessun workout impostato, scegline uno qui sotto
            </Text>
          </View>
        )}
      </View>

      {otherWorkouts.length > 0 && (
        <View>
          <Text style={styles.sectionText}>
            {currentWorkout ? "ALTRI WORKOUT" : "SCEGLI UN WORKOUT"}
          </Text>
          {otherWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={() => openWorkout(workout.id)}
            />
          ))}
        </View>
      )}
    </>
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
          <Text style={styles.pageTitle}>Workout</Text>
          <ProBadge></ProBadge>
        </View>
        {workoutsList}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
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
    workoutPreview: {
      padding: 20,
      marginBottom: 10,
      borderColor: colors.secondaryDark,
      borderWidth: 1,
      borderRadius: 14,
    },
    workoutCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    restCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    restTitle: {
      color: colors.secondary,
      fontSize: 18,
    },
    cardInfo: {
      flex: 1,
    },
    //Small badge in the top right corner of the card, the arrow stays in the middle
    daysBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "baseline",
      gap: 4,
      paddingVertical: 3,
      paddingHorizontal: 9,
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.tertiary,
      borderRadius: 10,
      backgroundColor: "#b92e342e",
    },
    daysNumber: {
      color: colors.secondary,
      fontSize: 14,
      fontWeight: "700",
    },
    daysLabel: {
      color: colors.secondary,
      fontSize: 11,
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
    setButton: {
      backgroundColor: colors.tertiary,
      borderRadius: 14,
      paddingVertical: 22,
      alignItems: "center",
    },
    setButtonPressed: {
      opacity: 0.85,
    },
    setButtonText: {
      color: colors.onTertiary,
      fontSize: 19,
      fontWeight: "700",
    },
    startButton: {
      backgroundColor: colors.tertiary,
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    startText: {
      color: colors.onTertiary,
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
    exerciseName: {
      color: colors.secondary,
    },
    exerciseDetails: {
      color: colors.secondaryDark,
    },
  });
