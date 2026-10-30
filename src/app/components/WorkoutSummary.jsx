import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Trophy } from "lucide-react-native";
import { useColors, useStyles, glassCard } from "../../theme";
import { useT, useLanguage, parseNumber, formatNumber } from "../../i18n";
import { exerciseLabel } from "../../data/workouts";
import Confetti from "./Confetti";

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
  const t = useT();
  const { language } = useLanguage();
  const doneSets = sets.flat().filter((set) => set.done);
  //An exercise is completed when all of its sets are done
  const completedExercises = sets.filter((exerciseSets) =>
    exerciseSets.every((set) => set.done),
  ).length;
  //Volume is the sum of kg x reps of every completed set (kg can be typed with a comma or a point)
  const volume = doneSets.reduce(
    (total, set) =>
      total + (parseNumber(set.weight) || 0) * (Number(set.reps) || 0),
    0,
  );

  const stats = [
    { label: t("summary.duration"), value: duration },
    {
      label: t("summary.exercises"),
      value: `${completedExercises}/${workoutDay.exercises.length}`,
    },
    {
      label: t("summary.volume"),
      value: `${formatNumber(volume, language)} kg`,
    },
  ];

  return (
    <View style={styles.body}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Trophy size={48} color={colors.tertiary} style={styles.trophy} />
          <Text style={styles.title}>{t("summary.title")}</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.dayLabel}>
              {t("workout.dayLabel", { n: workoutDay.day })}
            </Text>{" "}
            ·{" "}
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

        <Text style={styles.sectionText}>{t("summary.exercises")}</Text>
        {workoutDay.exercises.map((exercise, exerciseIndex) => {
          const exerciseDone = sets[exerciseIndex].filter((set) => set.done);
          return (
            <View key={exercise.exerciseName} style={styles.exercise}>
              <Text style={styles.exerciseName}>
                {exerciseLabel(exercise, language)}
              </Text>
              {exerciseDone.length > 0 ? (
                <View style={styles.chips}>
                  {exerciseDone.map((set, i) => (
                    <Text key={i} style={styles.chip}>
                      {set.weight}kg x {set.reps}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.skipped}>{t("summary.notDone")}</Text>
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
        <Text style={styles.closeText}>{t("summary.close")}</Text>
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
      ...glassCard(colors),
      borderRadius: 18,
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
      ...glassCard(colors),
      borderRadius: 18,
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
