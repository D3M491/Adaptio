import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Pencil } from "lucide-react-native";
import { useColors, useStyles } from "../theme";
import { getWorkoutById } from "../data/workouts";
import { useProfile } from "../data/ProfileContext";
import SourceTag from "./components/SourceTag";

//A workout with all its days and exercises, from here it can be set as the current one
export default function WorkoutDetail() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile, selectWorkout } = useProfile();

  const workout = getWorkoutById(id);
  const isCurrent = profile.currentWorkoutId === id;

  function select() {
    selectWorkout(id);
    router.back();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={10}
        style={styles.back}
      >
        <ChevronLeft size={20} color={colors.secondaryDark} />
        <Text style={styles.backText}>Indietro</Text>
      </Pressable>

      {workout ? (
        <>
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={styles.title}>{workout.name}</Text>
              <SourceTag source={workout.source} />
            </View>

            {workout.days.map((day) => (
              <View key={day.day} style={styles.day}>
                <View style={styles.dayHeader}>
                  <View>
                    <Text style={styles.dayLabel}>DAY {day.day}</Text>
                    <Text style={styles.dayTitle}>{day.name}</Text>
                  </View>
                  <Pressable hitSlop={10} style={styles.editButton}>
                    <Pencil size={22} color={colors.tertiary} />
                  </Pressable>
                </View>

                {day.exercises.map((exercise, index) => (
                  <View key={`${exercise.exerciseName}-${index}`} style={styles.exercise}>
                    <Text style={styles.exerciseName}>
                      {exercise.exerciseName}
                    </Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.sets} x {exercise.reps}
                      {exercise.technique && (
                        <Text>
                          {" · "}
                          <Text style={styles.technique}>
                            {exercise.technique}
                          </Text>
                        </Text>
                      )}
                      {exercise.RPE !== null && ` · RPE ${exercise.RPE}`}
                      {` · ${exercise.rest}s`}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={select}
              disabled={isCurrent}
              style={({ pressed }) => [
                styles.selectButton,
                isCurrent && styles.selectButtonOff,
                pressed && styles.selectButtonPressed,
              ]}
            >
              <Text style={styles.selectText}>
                {isCurrent ? "Workout attuale" : "Seleziona questo workout"}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text style={styles.missing}>Workout non trovato</Text>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.primary,
    },

    back: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 14,
      paddingTop: 16,
    },

    backText: {
      color: colors.secondaryDark,
      fontSize: 16,
    },

    list: {
      gap: 14,
      padding: 20,
    },

    title: {
      color: colors.secondary,
      fontSize: 24,
      marginBottom: 8,
    },

    day: {
      padding: 20,
      borderColor: colors.secondaryDark,
      borderWidth: 1,
      borderRadius: 14,
    },

    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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

    editButton: {
      alignSelf: "flex-start",
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

    technique: {
      color: colors.tertiary,
    },

    footer: {
      paddingHorizontal: 20,
      paddingBottom: 14,
      paddingTop: 8,
    },

    selectButton: {
      backgroundColor: colors.tertiary,
      borderRadius: 26,
      paddingVertical: 15,
      alignItems: "center",
    },

    selectButtonOff: {
      opacity: 0.35,
    },

    selectButtonPressed: {
      opacity: 0.85,
    },

    selectText: {
      color: colors.onTertiary,
      fontSize: 16,
      fontWeight: "600",
    },

    missing: {
      color: colors.secondaryDark,
      padding: 20,
    },
  });
