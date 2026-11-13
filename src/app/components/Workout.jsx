import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronUp, ChevronRight, Moon, CircleCheck } from "lucide-react-native";
import { useColors, useStyles, glassCard, glassChip } from "../../theme";
import {
  getWorkouts,
  getWorkoutById,
  getWorkoutDayForDate,
  dateKey,
  exerciseLabel,
} from "../../data/workouts";
import { useProfile } from "../../data/ProfileContext";
import ProBadge from "./ProBadge";
import { useT, useLanguage, formatNumber } from "../../i18n";
import SourceTag from "./SourceTag";
import ConfirmDialog from "./ConfirmDialog";
import RatingSummary from "./RatingSummary";
import { useRatings } from "../../data/RatingsContext";
import GlassBackground from "./GlassBackground";
import { TAB_BAR_SPACE } from "./GlassTabBar";

//Exercises shown in the preview when the panel is collapsed
const COLLAPSED_EXERCISES = 3;

//A workout in the list: name and where it comes from, with the number of days on the right.
//Tapping it opens the workout
function WorkoutCard({ workout, isCurrent, onPress }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
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
        {isCurrent && <Text style={styles.dayLabel}>{t("workout.current")}</Text>}
        <Text style={styles.dayTitle}>{workout.name}</Text>
        <SourceTag source={workout.source} />
        <RatingSummary workoutId={workout.id} />
      </View>

      <View style={styles.daysBadge}>
        <Text style={styles.daysNumber}>{workout.days.length}</Text>
        <Text style={styles.daysLabel}>
          {t("common.days", { count: workout.days.length })}
        </Text>
      </View>
      <ChevronRight size={22} color={colors.secondaryDark} />
    </Pressable>
  );
}

//selectedDate is the day selected in the week of the home
export default function Workout({ type, selectedDate }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
  const { language } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const [expanded, setExpanded] = useState(false);
  //Ordered by the votes of everybody (on) or as they come (off)
  const [sortBest, setSortBest] = useState(true);
  //Only the workouts of Adaptio, not the ones of the community
  const [adaptioOnly, setAdaptioOnly] = useState(false);
  //Only the workouts with this number of days, null for all of them
  const [daysFilter, setDaysFilter] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  //The dialog to train on a rest day, with the day of the workout chosen in it
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedDay, setPickedDay] = useState(null);
  const { summaries, available } = useRatings();

  //Undefined until the user sets a workout in the Workout tab
  const currentWorkout = getWorkoutById(profile.currentWorkoutId);

  //The workout of the selected day follows the training days chosen by the user. Without
  //training days nothing is planned, so the first day of the workout is shown
  const weekdays = profile.training?.weekdays ?? [];
  //The Workout tab has no selected day, it only lists the workouts
  const nextDay = !currentWorkout || !selectedDate
    ? undefined
    : weekdays.length === 0
      ? currentWorkout.days[0]
      : getWorkoutDayForDate(
          currentWorkout,
          weekdays,
          selectedDate,
          profile.currentWorkoutStart,
        );

  //A workout already finished on the selected day: the home shows it as done
  const completed = selectedDate
    ? profile.completedWorkouts?.[dateKey(selectedDate)]
    : undefined;
  const completedDay = completed
    ? getWorkoutById(completed.workoutId)?.days.find((d) => d.day === completed.day)
    : undefined;

  //The note under "Rest day" says "today" only for today
  const isToday = selectedDate?.toDateString() === new Date().toDateString();

  //A workout is set but nothing is planned on the selected day
  const isRestDay = currentWorkout !== undefined && !nextDay;

  //Today only: the day to suggest is the planned one, or on a rest day the one of the next
  //training day
  const suggestedDay = (() => {
    if (!isToday) return undefined;
    if (nextDay) return nextDay;
    if (!isRestDay) return undefined;
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const day = getWorkoutDayForDate(
        currentWorkout,
        weekdays,
        date,
        profile.currentWorkoutStart,
      );
      if (day) return day;
    }
    return currentWorkout.days[0];
  })();

  function openPicker() {
    setPickedDay(suggestedDay.day);
    setPickerOpen(true);
  }

  function startPicked() {
    setPickerOpen(false);
    router.push({
      pathname: "/workoutSession",
      params: { workoutId: currentWorkout.id, day: pickedDay },
    });
  }

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
      <Text style={styles.setButtonText}>{t("workout.setWorkout")}</Text>
    </Pressable>
  );

  const todayWorkout = (
    <View type={type}>
      <Text style={styles.sectionText}>{t("workout.section")}</Text>
      {completed ? (
        <View style={[styles.workoutPreview, styles.restCard]}>
          <CircleCheck size={26} color={colors.tertiary} />
          <View>
            <Text style={styles.restTitle}>{t("workout.completed")}</Text>
            {completedDay && (
              <Text style={styles.restNote}>
                {t("workout.dayLabel", { n: completedDay.day })} · {completedDay.name}
              </Text>
            )}
          </View>
        </View>
      ) : isRestDay ? (
        <>
        <View style={[styles.workoutPreview, styles.restCard]}>
          <Moon size={22} color={colors.secondaryDark} />
          <View>
            <Text style={styles.restTitle}>{t("workout.restDay")}</Text>
            <Text style={styles.restNote}>
              {t(isToday ? "workout.restToday" : "workout.restOther")}
            </Text>
          </View>
        </View>
        {/* A change of plan: train anyway, on the day that is next in the workout */}
        {suggestedDay && (
          <Pressable
            onPress={openPicker}
            style={({ pressed }) => [styles.trainButton, pressed && styles.setButtonPressed]}
          >
            <Text style={styles.trainText}>{t("workout.trainToday")}</Text>
          </Pressable>
        )}
        </>
      ) : nextDay ? (
        <>
        {/* Tapping the card expands it, only the Start button starts the workout */}
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
              <Text style={styles.dayLabel}>
                {t("workout.dayLabel", { n: nextDay.day })}
              </Text>
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
              <Text style={styles.startText}>{t("workout.start")}</Text>
            </Pressable>
          </View>

          {previewExercises.map((exercise, index) => (
            <View
              key={`${exercise.exerciseName}-${index}`}
              style={styles.previewExercise}
            >
              <Text style={[styles.exerciseName, styles.previewName]}>
                {exerciseLabel(exercise, language)}
              </Text>
              {/* The load of the last time, once the exercise was done: between the name and the sets */}
              {profile.lastLoads?.[exercise.exerciseName] && (
                <Text style={styles.lastLoad}>
                  {t("workout.lastLoad", {
                    weight: formatNumber(profile.lastLoads[exercise.exerciseName], language),
                  })}
                </Text>
              )}
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
        {/* A change of plan: do another day of the workout today */}
        {isToday && (
          <Pressable
            onPress={openPicker}
            style={({ pressed }) => [styles.trainButton, pressed && styles.setButtonPressed]}
          >
            <Text style={styles.trainText}>{t("workout.changeDay")}</Text>
          </Pressable>
        )}
        </>
      ) : (
        setWorkoutButton
      )}
    </View>
  );

  //The current workout first, then the others to choose from
  //Without votes a workout goes after the ones that have them (the sort is stable, so the
  //original order is kept among those)
  const candidates = getWorkouts().filter(
    (workout) => workout.id !== currentWorkout?.id,
  );

  //The numbers of days the workouts have, e.g. [3, 4, 5], for the filter chips
  const dayCounts = [...new Set(candidates.map((workout) => workout.days.length))].sort(
    (a, b) => a - b,
  );

  //The text of an option of the filter, e.g. "Tutti" or "4 giorni"
  const daysLabel = (count) =>
    count === null
      ? t("workout.filterAll")
      : `${count} ${t("common.days", { count })}`;

  const otherWorkouts = candidates
    .filter((workout) => daysFilter === null || workout.days.length === daysFilter)
    .filter((workout) => !adaptioOnly || workout.source === "adaptio")
    .sort((a, b) =>
      sortBest ? (summaries[b.id]?.score ?? 0) - (summaries[a.id]?.score ?? 0) : 0,
    );

  //Lists the days of the workout, the suggested one is marked
  const dayPicker = suggestedDay && (
    <ConfirmDialog
      visible={pickerOpen}
      title={t("workout.pickTitle")}
      message={t("workout.pickDay")}
      confirmText={t("workout.start")}
      onConfirm={startPicked}
      onCancel={() => setPickerOpen(false)}
    >
      <View style={styles.pickList}>
        {currentWorkout.days.map((day) => (
          <Pressable
            key={day.day}
            onPress={() => setPickedDay(day.day)}
            style={[styles.pickOption, pickedDay === day.day && styles.pickOptionOn]}
          >
            <View style={styles.pickInfo}>
              <Text style={styles.pickLabel}>
                {t("workout.dayLabel", { n: day.day })}
              </Text>
              <Text style={styles.pickName}>{day.name}</Text>
            </View>
            {day.day === suggestedDay.day && (
              <Text style={styles.pickSuggested}>{t("workout.suggested")}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </ConfirmDialog>
  );

  const workoutsList = (
    <>
      <View>
        <Text style={styles.sectionText}>{t("workout.currentSection")}</Text>
        {currentWorkout ? (
          <WorkoutCard
            workout={currentWorkout}
            isCurrent
            onPress={() => openWorkout(currentWorkout.id)}
          />
        ) : (
          <View style={styles.workoutPreview}>
            <Text style={styles.exerciseDetails}>
              {t("workout.none")}
            </Text>
          </View>
        )}
      </View>

      {candidates.length > 0 && (
        <View>
          <Text style={styles.sectionText}>
            {t(currentWorkout ? "workout.others" : "workout.choose")}
          </Text>
          {/* The sort and the filter by days of training a week, in the same row */}
          <View style={styles.sortRow}>
            {available && (
              <Pressable
                onPress={() => setSortBest(!sortBest)}
                style={[styles.sortChip, sortBest && styles.sortChipOn]}
              >
                <Text style={styles.sortText}>{t("ratings.sortBest")}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => setAdaptioOnly(!adaptioOnly)}
              style={[styles.sortChip, adaptioOnly && styles.sortChipOn]}
            >
              <Text style={styles.sortText}>{t("ratings.sortDefault")}</Text>
            </Pressable>
            {dayCounts.length > 1 && (
              <Pressable
                onPress={() => setFilterOpen(!filterOpen)}
                style={[styles.filterButton, daysFilter !== null && styles.sortChipOn]}
              >
                <Text style={styles.sortText}>
                  {daysFilter === null ? t("workout.filterLabel") : daysLabel(daysFilter)}
                </Text>
                {filterOpen ? (
                  <ChevronUp size={16} color={colors.secondaryDark} />
                ) : (
                  <ChevronDown size={16} color={colors.secondaryDark} />
                )}
              </Pressable>
            )}
            {/* Shows all the workouts again */}
            {(daysFilter !== null || adaptioOnly) && (
              <Pressable
                onPress={() => {
                  setDaysFilter(null);
                  setAdaptioOnly(false);
                  setFilterOpen(false);
                }}
                style={[styles.sortChip, styles.resetChip]}
              >
                <Text style={styles.resetText}>{t("workout.filterReset")}</Text>
              </Pressable>
            )}
          </View>
          {dayCounts.length > 1 && filterOpen && (
            <View style={styles.filterMenu}>
              <Text style={styles.filterQuestion}>{t("workout.filterQuestion")}</Text>
              {/* The numbers side by side, tapping the chosen one again shows all the workouts */}
              <View style={styles.filterNumbers}>
                {[1, 2, 3, 4, 5, 6, 7].map((count) => (
                  <Pressable
                    key={count}
                    //A number without workouts is dimmed and can't be chosen
                    disabled={!dayCounts.includes(count)}
                    onPress={() => {
                      setDaysFilter(daysFilter === count ? null : count);
                      setFilterOpen(false);
                    }}
                    style={[
                      styles.filterNumber,
                      !dayCounts.includes(count) && styles.filterNumberOff,
                      daysFilter === count && styles.sortChipOn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        daysFilter === count && styles.filterOptionOn,
                      ]}
                    >
                      {count}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {otherWorkouts.length === 0 && (
            <Text style={styles.exerciseDetails}>{t("workout.filterEmpty")}</Text>
          )}
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
    <>
      {todayWorkout}
      {dayPicker}
    </>
  ) : (
    //A plain View with the insets keeps the ScrollView bounded inside the tab pager
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <GlassBackground />
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t("workout.title")}</Text>
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
      paddingBottom: TAB_BAR_SPACE,
    },
    sectionText: {
      color: colors.secondaryDark,
      marginBottom: 10,
    },

    //One row: the chips are tight enough to keep Reset on the right of Frequenza
    sortRow: {
      flexDirection: "row",
      gap: 6,
      marginBottom: 12,
    },

    filterButton: {
      ...glassChip(colors),
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 6,
      paddingLeft: 11,
      paddingRight: 7,
      borderRadius: 14,
    },
    filterMenu: {
      ...glassCard(colors),
      marginBottom: 12,
      padding: 14,
      gap: 12,
      borderRadius: 14,
    },
    filterQuestion: {
      color: colors.secondaryDark,
      fontSize: 14,
    },
    filterNumbers: {
      flexDirection: "row",
      gap: 8,
    },
    //The seven numbers share the width of the panel
    filterNumber: {
      ...glassChip(colors),
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
      borderRadius: 12,
    },
    filterNumberOff: {
      opacity: 0.35,
    },
    filterOptionText: {
      color: colors.secondary,
      fontSize: 15,
    },
    filterOptionOn: {
      color: colors.tertiary,
      fontWeight: "700",
    },
    sortChip: {
      ...glassChip(colors),
      paddingVertical: 6,
      paddingHorizontal: 11,
      borderRadius: 14,
    },

    //Always red, it is the way back to all the workouts
    resetChip: {
      backgroundColor: colors.tertiary,
      borderColor: colors.tertiary,
      borderTopColor: colors.tertiary,
    },
    resetText: {
      color: colors.onTertiary,
      fontSize: 13,
      fontWeight: "600",
    },
    sortChipOn: {
      borderColor: colors.tertiary,
      borderTopColor: colors.tertiary,
    },

    sortText: {
      color: colors.secondary,
      fontSize: 13,
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
      ...glassCard(colors),
      padding: 20,
      marginBottom: 10,
      borderRadius: 18,
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
    //Red tinted glass, smaller than the button that sets a workout
    trainButton: {
      ...glassChip(colors),
      backgroundColor: "#b92e342e",
      borderColor: colors.tertiary,
      borderTopColor: colors.tertiary,
      marginTop: 10,
      paddingVertical: 11,
      borderRadius: 14,
      alignItems: "center",
    },
    trainText: {
      color: colors.tertiary,
      fontSize: 15,
      fontWeight: "600",
    },
    pickList: {
      gap: 8,
      marginTop: 8,
    },
    pickOption: {
      ...glassChip(colors),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 14,
    },
    pickOptionOn: {
      borderColor: colors.tertiary,
      borderTopColor: colors.tertiary,
    },
    pickInfo: {
      flex: 1,
    },
    pickLabel: {
      color: colors.tertiary,
      fontSize: 12,
    },
    pickName: {
      color: colors.secondary,
      fontSize: 16,
    },
    pickSuggested: {
      color: colors.secondaryDark,
      fontSize: 12,
    },
    restNote: {
      color: colors.secondaryDark,
      fontSize: 14,
      marginTop: 2,
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
    //Name and load share the free space, so the load sits in the middle of the row
    previewName: {
      flex: 1,
    },
    lastLoad: {
      flex: 1,
      textAlign: "center",
      color: colors.tertiary,
      fontSize: 13,
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
