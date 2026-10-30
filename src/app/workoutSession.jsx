import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { X, Check, Timer } from "lucide-react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useColors, useStyles } from "../theme";
import { getWorkoutById } from "../data/workouts";
import { useProfile } from "../data/ProfileContext";
import { scheduleRestEnd, cancelNotification } from "../notifications";
import ConfirmDialog from "./components/ConfirmDialog";
import WorkoutSummary from "./components/WorkoutSummary";

//Seconds added or removed by the rest timer buttons
const REST_STEP = 15;

//Formats seconds as m:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

//Builds the empty sets for every exercise of the day
function createSets(exercises) {
  return exercises.map((exercise) =>
    Array.from({ length: exercise.sets }, () => ({
      weight: "",
      reps: "",
      done: false,
    })),
  );
}

export default function WorkoutSession() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const router = useRouter();
  //SafeAreaView measures 0 insets inside a fullScreenModal, so read them from the root
  const insets = useSafeAreaInsets();
  const safeArea = { paddingTop: insets.top, paddingBottom: insets.bottom };
  const { workoutId, day } = useLocalSearchParams();
  const workoutDay = getWorkoutById(workoutId)?.days.find(
    (d) => d.day === Number(day),
  );

  const [sets, setSets] = useState(() =>
    createSets(workoutDay?.exercises ?? []),
  );
  //One note per exercise, same order as the exercises
  const [notes, setNotes] = useState(() =>
    (workoutDay?.exercises ?? []).map(() => ""),
  );
  const [startTime] = useState(Date.now());
  //Which confirm dialog is open: "finish", "exit" or null
  const [dialog, setDialog] = useState(null);
  const [now, setNow] = useState(Date.now());
  //Timestamp when the current rest ends, null when not resting
  const [restEnd, setRestEnd] = useState(null);
  //Timestamp when the workout was finished, shows the summary
  const [finishedAt, setFinishedAt] = useState(null);

  //Ticks every second to update the elapsed and rest timers
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = Math.floor((now - startTime) / 1000);
  const restLeft = restEnd ? Math.ceil((restEnd - now) / 1000) : 0;

  //Hide the rest bar once the countdown is over
  useEffect(() => {
    if (restEnd && restLeft <= 0) setRestEnd(null);
  }, [restEnd, restLeft]);

  const { keepAwake, restNotification } = useProfile().profile.settings;

  //Keeps the screen on during the workout, so the rest timer stays visible
  useEffect(() => {
    if (!keepAwake) return;
    activateKeepAwakeAsync("workout").catch(() => {});
    return () => {
      deactivateKeepAwake("workout").catch(() => {});
    };
  }, [keepAwake]);

  //Notification when the rest ends, even with the phone locked. It follows the timer:
  //moved when the rest is changed, removed when it is skipped or the session is closed
  useEffect(() => {
    if (!restEnd || !restNotification) return;

    let cancelled = false;
    let notificationId = null;

    scheduleRestEnd(restEnd)
      .then((id) => {
        if (cancelled) cancelNotification(id);
        else notificationId = id;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelNotification(notificationId).catch(() => {});
    };
  }, [restEnd, restNotification]);

  if (!workoutDay) {
    return (
      <View style={[styles.body, safeArea]}>
        <Text style={styles.exerciseDetails}>Workout non trovato</Text>
      </View>
    );
  }

  const totalSets = sets.flat().length;
  const doneSets = sets.flat().filter((set) => set.done).length;
  //An exercise is remaining until all of its sets are done
  const remainingExercises = sets.filter((exerciseSets) =>
    exerciseSets.some((set) => !set.done),
  ).length;

  function updateSet(exerciseIndex, setIndex, changes) {
    setSets((prev) =>
      prev.map((exerciseSets, i) =>
        i === exerciseIndex
          ? exerciseSets.map((set, j) =>
              j === setIndex ? { ...set, ...changes } : set,
            )
          : exerciseSets,
      ),
    );
  }

  //Completing a set closes the keyboard and starts the rest timer of its exercise
  function toggleSet(exerciseIndex, setIndex) {
    const set = sets[exerciseIndex][setIndex];
    Keyboard.dismiss();
    //A set can't be completed without kg and reps, the empty fields turn red
    if (!set.done && (!set.weight || !set.reps)) {
      updateSet(exerciseIndex, setIndex, { invalid: true });
      return;
    }
    updateSet(exerciseIndex, setIndex, { done: !set.done, invalid: false });
    if (!set.done) {
      setRestEnd(Date.now() + workoutDay.exercises[exerciseIndex].rest * 1000);
    }
  }

  function changeRest(seconds) {
    setRestEnd((prev) => prev + seconds * 1000);
  }

  function close() {
    setDialog(null);
    router.back();
  }

  //Todo save the session for the progress and the AI progressions
  function finish() {
    Keyboard.dismiss();
    setDialog(null);
    setRestEnd(null);
    setFinishedAt(Date.now());
  }

  if (finishedAt) {
    return (
      <View style={[styles.body, safeArea]}>
        <WorkoutSummary
          workoutDay={workoutDay}
          sets={sets}
          notes={notes}
          duration={formatTime(Math.floor((finishedAt - startTime) / 1000))}
          onClose={close}
        />
      </View>
    );
  }

  return (
    <View style={[styles.body, safeArea]}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => setDialog("exit")}>
          <X size={26} color={colors.secondary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.dayLabel}>DAY {workoutDay.day}</Text>
          <Text style={styles.dayTitle}>{workoutDay.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.elapsed}>{formatTime(elapsed)}</Text>
          <Pressable
            hitSlop={8}
            onPress={() => setDialog("finish")}
            style={({ pressed }) => [
              styles.headerFinish,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.headerFinishText}>Termina</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${(doneSets / totalSets) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {workoutDay.exercises.map((exercise, exerciseIndex) => (
          <View key={`${exercise.exerciseName}-${exerciseIndex}`} style={styles.exercise}>
            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
            <Text style={styles.exerciseDetails}>
              <Text style={styles.exerciseTarget}>
                {exercise.sets} x {exercise.reps}
              </Text>
              {exercise.technique && (
                <Text>
                  {" · "}
                  <Text style={styles.technique}>{exercise.technique}</Text>
                </Text>
              )}
              {exercise.RPE !== null && ` · RPE ${exercise.RPE}`}
              {` · ${exercise.rest}s recupero`}
            </Text>

            <View style={styles.setRow}>
              <Text style={[styles.columnLabel, styles.setColumn]}>SET</Text>
              <Text style={[styles.columnLabel, styles.inputColumn]}>KG</Text>
              <Text style={[styles.columnLabel, styles.inputColumn]}>REPS</Text>
              <View style={styles.checkSpacer} />
            </View>

            {sets[exerciseIndex].map((set, setIndex) => (
              <View
                key={setIndex}
                style={[styles.setRow, set.done && styles.setRowDone]}
              >
                <Text style={[styles.setColumn, styles.setNumber]}>
                  {setIndex + 1}
                </Text>
                <TextInput
                  style={[
                    styles.inputColumn,
                    styles.input,
                    set.invalid && !set.weight && styles.inputInvalid,
                  ]}
                  value={set.weight}
                  onChangeText={(weight) =>
                    updateSet(exerciseIndex, setIndex, { weight })
                  }
                  selectionColor={colors.tertiary}
                  cursorColor={colors.tertiary}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  style={[
                    styles.inputColumn,
                    styles.input,
                    set.invalid && !set.reps && styles.inputInvalid,
                  ]}
                  value={set.reps}
                  onChangeText={(reps) =>
                    updateSet(exerciseIndex, setIndex, { reps })
                  }
                  placeholder={String(exercise.reps)}
                  placeholderTextColor={colors.secondaryDark}
                  selectionColor={colors.tertiary}
                  cursorColor={colors.tertiary}
                  keyboardType="number-pad"
                />
                <Pressable
                  hitSlop={8}
                  onPress={() => toggleSet(exerciseIndex, setIndex)}
                  style={[styles.checkButton, set.done && styles.checkDone]}
                >
                  <Check
                    size={18}
                    color={set.done ? colors.onTertiary : colors.secondaryDark}
                  />
                </Pressable>
              </View>
            ))}

            <TextInput
              style={styles.notes}
              value={notes[exerciseIndex]}
              onChangeText={(text) =>
                setNotes((prev) =>
                  prev.map((note, i) => (i === exerciseIndex ? text : note)),
                )
              }
              placeholder="Aggiungi una nota..."
              placeholderTextColor={colors.secondaryDark}
              selectionColor={colors.tertiary}
              cursorColor={colors.tertiary}
              multiline
            />
          </View>
        ))}

        <Pressable
          onPress={() => setDialog("finish")}
          style={({ pressed }) => [
            styles.finishButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.finishText}>
            Termina workout
            {remainingExercises > 0 &&
              ` · ${remainingExercises} ${remainingExercises === 1 ? "esercizio rimanente" : "esercizi rimanenti"}`}
          </Text>
        </Pressable>
      </ScrollView>

      {restEnd && (
        <View style={styles.restBar}>
          <Timer size={22} color={colors.tertiary} />
          <Text style={styles.restTime}>
            {formatTime(Math.max(restLeft, 0))}
          </Text>
          <Pressable hitSlop={8} onPress={() => changeRest(-REST_STEP)}>
            <Text style={styles.restButton}>-{REST_STEP}s</Text>
          </Pressable>
          <Pressable hitSlop={8} onPress={() => changeRest(REST_STEP)}>
            <Text style={styles.restButton}>+{REST_STEP}s</Text>
          </Pressable>
          <Pressable hitSlop={8} onPress={() => setRestEnd(null)}>
            <Text style={styles.restSkip}>Salta</Text>
          </Pressable>
        </View>
      )}

      <ConfirmDialog
        visible={dialog === "finish"}
        title="Sicuro di voler terminare?"
        message={`Hai completato ${workoutDay.exercises.length - remainingExercises} esercizi su ${workoutDay.exercises.length}`}
        confirmText="Termina"
        onConfirm={finish}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        visible={dialog === "exit"}
        title="Uscire dal workout?"
        message="I progressi di oggi andranno persi"
        confirmText="Esci"
        onConfirm={close}
        onCancel={() => setDialog(null)}
      />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: colors.primary,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      paddingBottom: 12,
    },

    headerCenter: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "baseline",
      gap: 8,
    },

    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    headerFinish: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: colors.tertiary,
    },

    headerFinishText: {
      color: colors.onTertiary,
      fontWeight: "600",
    },

    dayLabel: {
      color: colors.tertiary,
    },

    dayTitle: {
      color: colors.secondary,
      fontSize: 18,
    },

    elapsed: {
      color: colors.secondary,
      fontSize: 16,
      fontVariant: ["tabular-nums"],
    },

    progressTrack: {
      height: 3,
      marginHorizontal: 20,
      borderRadius: 2,
      backgroundColor: colors.primaryLight,
    },

    progressFill: {
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.tertiary,
    },

    list: {
      padding: 20,
      gap: 14,
    },

    exercise: {
      padding: 20,
      gap: 6,
      borderColor: colors.secondaryDark,
      borderWidth: 1,
      borderRadius: 14,
    },

    exerciseName: {
      color: colors.secondary,
      fontSize: 16,
    },

    technique: {
      color: colors.tertiary,
    },
    exerciseDetails: {
      color: colors.secondaryDark,
      marginBottom: 6,
    },

    exerciseTarget: {
      color: colors.secondary,
    },

    setRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 4,
      paddingHorizontal: 6,
      borderRadius: 8,
    },

    setRowDone: {
      backgroundColor: colors.primaryLight,
    },

    columnLabel: {
      color: colors.secondaryDark,
      fontSize: 11,
      textAlign: "center",
    },

    //Column widths shared by the labels row and the set rows
    setColumn: {
      width: 30,
    },

    inputColumn: {
      flex: 1,
      marginHorizontal: 8,
    },

    setNumber: {
      color: colors.secondary,
      textAlign: "center",
      fontSize: 16,
    },

    input: {
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      backgroundColor: colors.primaryLight,
      color: colors.secondary,
      textAlign: "center",
      fontSize: 16,
    },

    inputInvalid: {
      borderColor: colors.tertiary,
    },

    notes: {
      marginTop: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      minHeight: 40,
      borderRadius: 8,
      color: colors.secondary,
      backgroundColor: colors.primaryLight,
      textAlignVertical: "top",
    },

    checkSpacer: {
      width: 32,
    },

    checkButton: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.secondaryDark,
    },

    checkDone: {
      borderColor: colors.tertiary,
      backgroundColor: colors.tertiary,
    },

    finishButton: {
      alignItems: "center",
      paddingVertical: 16,
      marginTop: 6,
      borderRadius: 14,
      backgroundColor: colors.tertiary,
    },

    pressed: {
      opacity: 0.7,
    },

    finishText: {
      color: colors.onTertiary,
      fontSize: 16,
      fontWeight: "700",
    },

    restBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginHorizontal: 20,
      marginBottom: 10,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.tertiary,
      backgroundColor: colors.primary,
    },

    restTime: {
      flex: 1,
      color: colors.secondary,
      fontSize: 22,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    restButton: {
      color: colors.secondary,
    },

    restSkip: {
      color: colors.tertiary,
      fontWeight: "600",
    },
  });
