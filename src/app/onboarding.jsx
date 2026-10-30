import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { useColors, useStyles, glassCard, glassChip } from "../theme";
import { useProfile } from "../data/ProfileContext";
import { useT } from "../i18n";
import { useIntroDone } from "./components/Intro";
import RulerPicker from "./components/RulerPicker";
import GlassBackground from "./components/GlassBackground";

const SELECTED_BG = "#b92e342e";

//How far a vertical swipe must go to change step
const SWIPE_DISTANCE = 60;

// type: "text" is typed, "number" is scrolled on a ruler, "days" and "options" are tapped.
// A number starts at its default and moves between min and max by step.
// question, unit, label and note are keys of the texts (src/i18n): "cm" and "kg" are the same in every language
const STEPS = [
  { key: "name", type: "text", question: "onboarding.questions.name" },
  { key: "age", type: "number", question: "onboarding.questions.age", unit: "onboarding.years", min: 12, max: 90, default: 25 },
  { key: "height", type: "number", question: "onboarding.questions.height", unit: "cm", min: 120, max: 230, default: 175 },
  { key: "weight", type: "number", question: "onboarding.questions.weight", unit: "kg", min: 30, max: 250, step: 0.5, default: 70, labelStep: 5 },
  { key: "daysPerWeek", type: "days", question: "onboarding.questions.daysPerWeek", options: [2, 3, 4, 5, 6] },
  // As many weekdays as chosen in the previous step, saved as 0 = Sunday ... 6 = Saturday
  { key: "weekdays", type: "weekdays", question: "onboarding.questions.weekdays" },
  {
    key: "goal",
    type: "options",
    question: "onboarding.questions.goal",
    options: [
      { value: "mass", label: "onboarding.goal.mass", note: "onboarding.goal.massNote" },
      { value: "fat", label: "onboarding.goal.fat", note: "onboarding.goal.fatNote" },
      { value: "strength", label: "onboarding.goal.strength", note: "onboarding.goal.strengthNote" },
    ],
  },
  {
    key: "level",
    type: "options",
    question: "onboarding.questions.level",
    options: [
      { value: "beginner", label: "onboarding.level.beginner", note: "onboarding.level.beginnerNote" },
      { value: "intermediate", label: "onboarding.level.intermediate", note: "onboarding.level.intermediateNote" },
      { value: "advanced", label: "onboarding.level.advanced", note: "onboarding.level.advancedNote" },
    ],
  },
  {
    key: "place",
    type: "options",
    question: "onboarding.questions.place",
    options: [
      { value: "gym", label: "onboarding.place.gym", note: "onboarding.place.gymNote" },
      { value: "home", label: "onboarding.place.home", note: "onboarding.place.homeNote" },
      { value: "both", label: "onboarding.place.both", note: "onboarding.place.bothNote" },
    ],
  },
];

//The numbers start on their default, so the ruler is already on a valid value
const DEFAULT_ANSWERS = Object.fromEntries(
  STEPS.filter((step) => step.type === "number").map((step) => [
    step.key,
    step.default,
  ]),
);

//Monday first, with the number the days have in JavaScript (0 is Sunday)
const WEEKDAY_NUMBERS = [1, 2, 3, 4, 5, 6, 0];

function isValid(step, value, answers) {
  if (value === undefined || value === null) return false;
  if (step.type === "text") return value.trim() !== "";
  //The weekdays must be as many as the days a week chosen before
  if (step.type === "weekdays") return value.length === answers.daysPerWeek;
  //numbers, days and options: a value is always set when it reaches here
  return true;
}

//Each step fades in and moves a little when it appears: from below going forward
//(direction 1), from above going back (direction -1)
function StepView({ children, direction }) {
  const styles = useStyles(createStyles);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.center,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [14 * direction, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

//Arrow that bounces a little towards the previous (up) or next (down) question,
//to show that the steps can be swiped. It is hidden when there is nowhere to go
//and faded when the answer is not valid yet.
function SwipeArrow({ direction, visible, faded }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const Icon = direction === "up" ? ChevronUp : ChevronDown;
  const sign = direction === "up" ? -1 : 1;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.arrow,
        {
          opacity: visible ? (faded ? 0.2 : 0.6) : 0,
          transform: [
            {
              translateY: bounce.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 5 * sign],
              }),
            },
          ],
        },
      ]}
    >
      <Icon size={28} color={colors.secondary} />
    </Animated.View>
  );
}

export default function Onboarding() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
  const { completeOnboarding } = useProfile();
  const introDone = useIntroDone();
  const inputRef = useRef(null);
  const swipeActions = useRef({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);

  const step = STEPS[index];
  const value = answers[step.key];
  const canContinue = isValid(step, value, answers);
  const isLast = index === STEPS.length - 1;
  const isTyped = step.type === "text";

  //Opens the keyboard on typed steps, but only after the intro is over
  useEffect(() => {
    if (!introDone || !isTyped) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [introDone, index, isTyped]);

  function setValue(newValue) {
    setAnswers((prev) => {
      const updated = { ...prev, [step.key]: newValue };
      //Changing how many days a week empties the days chosen for the old number
      if (step.key === "daysPerWeek" && newValue !== prev.daysPerWeek) {
        delete updated.weekdays;
      }
      return updated;
    });
  }

  //Adds or removes a weekday, up to the number of days a week chosen before
  function toggleWeekday(weekday) {
    const selected = value ?? [];
    if (selected.includes(weekday)) {
      setValue(selected.filter((item) => item !== weekday));
    } else if (selected.length < answers.daysPerWeek) {
      setValue([...selected, weekday]);
    }
  }

  function next() {
    if (!canContinue) return;

    Keyboard.dismiss();

    if (!isLast) {
      setDirection(1);
      setIndex(index + 1);
      return;
    }

    //The stack redirects to the app as soon as the profile is marked as done
    completeOnboarding({
      name: answers.name.trim(),
      age: answers.age,
      height: answers.height,
      weight: answers.weight,
      training: {
        daysPerWeek: answers.daysPerWeek,
        weekdays: answers.weekdays,
        goal: answers.goal,
        level: answers.level,
        place: answers.place,
      },
    });
  }

  function back() {
    if (index === 0) return;

    Keyboard.dismiss();
    setDirection(-1);
    setIndex(index - 1);
  }

  //Swiping up goes forward and swiping down goes back. It is vertical because the
  //horizontal swipe belongs to the rulers. The last step is finished only with the button.
  useEffect(() => {
    swipeActions.current = { next: isLast ? () => {} : next, back };
  });

  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 12 &&
        Math.abs(gesture.dy) > Math.abs(gesture.dx) * 1.5,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -SWIPE_DISTANCE) swipeActions.current.next();
        else if (gesture.dy > SWIPE_DISTANCE) swipeActions.current.back();
      },
    }),
  ).current;

  //The input changes with the type of the step
  let input;

  if (step.type === "text") {
    input = (
      <TextInput
        ref={inputRef}
        style={[styles.field, styles.textField]}
        value={value ?? ""}
        onChangeText={setValue}
        onSubmitEditing={next}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={30}
        returnKeyType="next"
        selectionColor={colors.tertiary}
        cursorColor={colors.tertiary}
      />
    );
  } else if (step.type === "number") {
    input = (
      <RulerPicker
        value={value}
        onChange={setValue}
        min={step.min}
        max={step.max}
        step={step.step}
        unit={t(step.unit)}
        labelStep={step.labelStep}
      />
    );
  } else if (step.type === "weekdays") {
    input = (
      <View style={styles.weekdaysBlock}>
        <View style={styles.weekdays}>
          {WEEKDAY_NUMBERS.map((weekday) => {
            const isSelected = (value ?? []).includes(weekday);
            return (
              <Pressable
                key={weekday}
                style={[styles.weekday, isSelected && styles.selected]}
                onPress={() => toggleWeekday(weekday)}
              >
                <Text
                  style={[
                    styles.weekdayText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {t(`weekdays.${weekday}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.weekdaysHint}>
          {t("onboarding.daysChosen", {
            count: (value ?? []).length,
            total: answers.daysPerWeek,
          })}
        </Text>
      </View>
    );
  } else if (step.type === "days") {
    input = (
      <View style={styles.days}>
        {step.options.map((option) => (
          <Pressable
            key={option}
            style={[styles.day, value === option && styles.selected]}
            onPress={() => setValue(option)}
          >
            <Text
              style={[styles.dayText, value === option && styles.selectedText]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  } else {
    input = (
      <View style={styles.options}>
        {step.options.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.option, value === option.value && styles.selected]}
            onPress={() => setValue(option.value)}
          >
            <Text style={styles.optionLabel}>{t(option.label)}</Text>
            <Text style={styles.optionNote}>{t(option.note)}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <GlassBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.top}>
          <View style={styles.progress}>
            {STEPS.map((item, i) => (
              <View
                key={item.key}
                style={[styles.segment, i <= index && styles.segmentOn]}
              />
            ))}
          </View>
          <Pressable
            onPress={back}
            disabled={index === 0}
            hitSlop={10}
            style={styles.back}
          >
            <Text style={[styles.backText, index === 0 && styles.hidden]}>
              ‹ {t("common.back")}
            </Text>
          </Pressable>
        </View>

        <View style={styles.swipeArea} {...swipe.panHandlers}>
          <SwipeArrow direction="up" visible={index > 0} />
          <StepView key={step.key} direction={direction}>
            <Text style={styles.stepLabel}>
              {t("onboarding.stepOf", { n: index + 1, total: STEPS.length })}
            </Text>
            <Text style={styles.question}>{t(step.question)}</Text>
            {input}
          </StepView>
          {!isLast && (
            <SwipeArrow direction="down" visible faded={!canContinue} />
          )}
        </View>

        <Pressable
          style={[styles.button, !canContinue && styles.buttonOff]}
          onPress={next}
          disabled={!canContinue}
        >
          <Text style={styles.buttonText}>
            {t(isLast ? "onboarding.start" : "onboarding.next")}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.primary,
    },

    flex: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 14,
    },

    top: {
      paddingTop: 16,
      gap: 16,
    },

    //Without userSelect a mouse drag on the web selects the text and cancels the swipe
    //The arrows and the question stay together in the middle of the screen
    swipeArea: {
      flex: 1,
      justifyContent: "center",
      userSelect: "none",
    },

    arrow: {
      alignSelf: "center",
      marginVertical: 12,
    },

    progress: {
      flexDirection: "row",
      gap: 4,
    },

    segment: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.secondaryDark,
    },

    segmentOn: {
      backgroundColor: colors.tertiary,
    },

    back: {
      alignSelf: "flex-start",
    },

    backText: {
      color: colors.secondaryDark,
      fontSize: 16,
    },

    hidden: {
      opacity: 0,
    },

    center: {
      alignItems: "center",
    },

    stepLabel: {
      color: colors.tertiary,
      fontSize: 12,
      letterSpacing: 1,
      marginBottom: 8,
    },

    question: {
      color: colors.secondary,
      fontSize: 26,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 28,
    },

    field: {
      color: colors.secondary,
      fontSize: 40,
      fontWeight: "700",
      textAlign: "center",
      borderBottomWidth: 2,
      borderBottomColor: colors.tertiary,
      paddingVertical: 4,
      outlineWidth: 0,
    },

    textField: {
      width: 260,
    },

    days: {
      flexDirection: "row",
      gap: 10,
    },

    weekdaysBlock: {
      alignItems: "center",
      gap: 16,
    },

    weekdays: {
      flexDirection: "row",
      gap: 6,
    },

    weekday: {
      width: 44,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
      ...glassChip(colors),
      borderRadius: 14,
    },

    weekdayText: {
      color: colors.secondary,
      fontSize: 14,
    },

    weekdaysHint: {
      color: colors.secondaryDark,
      fontSize: 13,
    },

    day: {
      width: 52,
      height: 64,
      alignItems: "center",
      justifyContent: "center",
      ...glassChip(colors),
      borderRadius: 16,
    },

    dayText: {
      color: colors.secondary,
      fontSize: 24,
    },

    options: {
      alignSelf: "stretch",
      gap: 10,
    },

    option: {
      ...glassCard(colors),
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 18,
    },

    optionLabel: {
      color: colors.secondary,
      fontSize: 17,
    },

    optionNote: {
      color: colors.secondaryDark,
      fontSize: 13,
      marginTop: 2,
    },

    selected: {
      borderColor: colors.tertiary,
      borderTopColor: colors.tertiary,
      backgroundColor: SELECTED_BG,
    },

    selectedText: {
      fontWeight: "700",
    },

    button: {
      backgroundColor: colors.tertiary,
      borderRadius: 26,
      paddingVertical: 15,
      alignItems: "center",
    },

    buttonOff: {
      opacity: 0.35,
    },

    buttonText: {
      color: colors.onTertiary,
      fontSize: 16,
      fontWeight: "600",
    },
  });
