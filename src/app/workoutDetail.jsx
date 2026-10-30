import { useRef, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Pencil, Star } from "lucide-react-native";
import { useColors, useStyles, glassCard, glassChip } from "../theme";
import { getWorkoutById, exerciseLabel } from "../data/workouts";
import { useProfile } from "../data/ProfileContext";
import { useRatings } from "../data/RatingsContext";
import SourceTag from "./components/SourceTag";
import RatingInput from "./components/RatingInput";
import RatingSummary from "./components/RatingSummary";
import GlassBackground from "./components/GlassBackground";
import { useT, useLanguage } from "../i18n";

//A workout with all its days and exercises, from here it can be set as the current one
export default function WorkoutDetail() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile, selectWorkout } = useProfile();
  const t = useT();
  const { language } = useLanguage();
  const { available, myVotes } = useRatings();
  //The vote is at the bottom: the button at the top scrolls to it
  const scrollRef = useRef(null);
  const [ratingY, setRatingY] = useState(0);

  const workout = getWorkoutById(id);
  const isCurrent = profile.currentWorkoutId === id;

  function select() {
    selectWorkout(id);
    router.back();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <GlassBackground />
      <Pressable
        onPress={() => router.back()}
        hitSlop={10}
        style={styles.back}
      >
        <ChevronLeft size={20} color={colors.secondaryDark} />
        <Text style={styles.backText}>{t("common.back")}</Text>
      </Pressable>

      {workout ? (
        <>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <Text style={styles.title}>{workout.name}</Text>
                <SourceTag source={workout.source} />
                <RatingSummary workoutId={workout.id} />
              </View>

              {/* Scrolls down to the stars, at the end of the workout */}
              {available && (
                <Pressable
                  onPress={() => scrollRef.current?.scrollTo({ y: ratingY, animated: true })}
                  style={({ pressed }) => [styles.reviewButton, pressed && styles.reviewPressed]}
                >
                  <Star size={16} color={colors.star} />
                  <Text style={styles.reviewText}>
                    {t(myVotes[workout.id] ? "ratings.reviewed" : "ratings.review")}
                  </Text>
                </Pressable>
              )}
            </View>

            {workout.days.map((day) => (
              <View key={day.day} style={styles.day}>
                <View style={styles.dayHeader}>
                  <View>
                    <Text style={styles.dayLabel}>
                      {t("workout.dayLabel", { n: day.day })}
                    </Text>
                    <Text style={styles.dayTitle}>{day.name}</Text>
                  </View>
                  <Pressable hitSlop={10} style={styles.editButton}>
                    <Pencil size={22} color={colors.tertiary} />
                  </Pressable>
                </View>

                {day.exercises.map((exercise, index) => (
                  <View key={`${exercise.exerciseName}-${index}`} style={styles.exercise}>
                    <Text style={styles.exerciseName}>
                      {exerciseLabel(exercise, language)}
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

            <View onLayout={(event) => setRatingY(event.nativeEvent.layout.y)}>
              <RatingInput workoutId={workout.id} />
            </View>
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
                {t(isCurrent ? "workout.selected" : "workout.select")}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text style={styles.missing}>{t("workout.notFound")}</Text>
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
      ...glassCard(colors),
      padding: 20,
      borderRadius: 18,
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

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },

    headerInfo: {
      flex: 1,
    },

    reviewButton: {
      ...glassChip(colors),
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderColor: colors.star,
      borderTopColor: colors.star,
    },

    reviewPressed: {
      opacity: 0.7,
    },

    reviewText: {
      color: colors.secondary,
      fontWeight: "600",
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
