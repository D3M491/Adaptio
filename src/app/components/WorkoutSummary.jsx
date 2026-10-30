import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Trophy } from "lucide-react-native";
import { useColors, useStyles } from "../../theme";
import Confetti from "./Confetti";

//Kg typed with the Italian keyboard use a comma as decimal separator
function parseWeight(weight) {
  return Number(weight.replace(",", ".")) || 0;
}

//Recap shown after finishing a workout
export default function WorkoutSummary({
  workoutDay,
  sets,
  notes,
  duration,
  onClose,
}) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const doneSets = sets.flat().filter((set) => set.done);
  //An exercise is completed when all of its sets are done
  const completedExercises = sets.filter((exerciseSets) =>
    exerciseSets.every((set) => set.done),
  ).length;
  //Volume is the sum of kg x reps of every completed set
  const volume = doneSets.reduce(
    (total, set) => total + parseWeight(set.weight) * (Number(set.reps) || 0),
    0,
  );

  const stats = [
    { label: "DURATA", value: duration },
    {
      label: "ESERCIZI",
      value: `${completedExercises}/${workoutDay.exercises.length}`,
    },
    { label: "VOLUME", value: `${volume.toLocaleString("it-IT")} kg` },
  ];

  return (
    <View style={styles.body}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Trophy size={48} color={colors.tertiary} style={styles.trophy} />
          <Text style={styles.title}>Workout completato</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.dayLabel}>DAY {workoutDay.day}</Text> ·{" "}
            {workoutDay.name}
          </Text>
        </View>

        <View style={styles.stats}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionText}>ESERCIZI</Text>
        {workoutDay.exercises.map((exercise, exerciseIndex) => {
          const exerciseDone = sets[exerciseIndex].filter((set) => set.done);
          return (
            <View key={exercise.exerciseName} style={styles.exercise}>
              <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
              {exerciseDone.length > 0 ? (
                <View style={styles.chips}>
                  {exerciseDone.map((set, i) => (
                    <Text key={i} style={styles.chip}>
                      {set.weight}kg x {set.reps}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.skipped}>Non completato</Text>
              )}
              {notes[exerciseIndex] ? (
                <Text style={styles.note}>{notes[exerciseIndex]}</Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={onClose}
        style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
      >
        <Text style={styles.closeText}>Chiudi</Text>
      </Pressable>

      <Confetti />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    body: {
      flex: 1,
    },

    content: {
      padding: 20,
      gap: 12,
    },

    hero: {
      alignItems: "center",
      gap: 6,
      marginVertical: 12,
    },

    trophy: {
      marginBottom: 6,
    },

    title: {
      color: colors.secondary,
      fontSize: 26,
      fontWeight: "700",
    },

    subtitle: {
      color: colors.secondary,
      fontSize: 16,
    },

    dayLabel: {
      color: colors.tertiary,
    },

    stats: {
      flexDirection: "row",
      gap: 10,
    },

    stat: {
      flex: 1,
      alignItems: "center",
      gap: 4,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      borderRadius: 14,
    },

    statValue: {
      color: colors.secondary,
      fontSize: 18,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    statLabel: {
      color: colors.secondaryDark,
      fontSize: 11,
    },

    sectionText: {
      color: colors.secondaryDark,
      marginTop: 12,
    },

    exercise: {
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      borderRadius: 14,
    },

    exerciseName: {
      color: colors.secondary,
      fontSize: 16,
    },

    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },

    chip: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 8,
      overflow: "hidden",
      color: colors.secondary,
      backgroundColor: colors.primaryLight,
    },

    skipped: {
      color: colors.secondaryDark,
    },

    note: {
      color: colors.secondaryDark,
      fontStyle: "italic",
    },

    closeButton: {
      alignItems: "center",
      paddingVertical: 16,
      marginHorizontal: 20,
      marginBottom: 10,
      borderRadius: 14,
      backgroundColor: colors.tertiary,
    },

    pressed: {
      opacity: 0.7,
    },

    closeText: {
      color: colors.onTertiary,
      fontSize: 16,
      fontWeight: "700",
    },
  });
