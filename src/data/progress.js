// Starting progress data, used until the user saves their own values.
// Every entry has the starting value and the latest one: weight and maxes in kg, measurements in cm.
// The maxes and the measurements are empty (null) until the user fills them.
const progress = {
  // false until the first-launch form is completed
  onboarded: false,
  // True for new users. The profiles saved by old versions don't have it: ProfileContext
  // clears their example maxes and measurements once, then sets it
  legacyDemoCleared: true,
  personal: { name: "Manuel", age: 27, height: 178 },
  // Id of the workout chosen in the Workout tab, null until the user sets one
  currentWorkoutId: null,
  // Answers of the first-launch form, used later to suggest workout plans:
  // goal is "mass" | "fat" | "strength", level "beginner" | "intermediate" | "advanced",
  // place "gym" | "home" | "both". weekdays are the days chosen to train: 0 = Sunday ... 6 = Saturday
  training: {
    daysPerWeek: null,
    weekdays: [],
    goal: null,
    level: null,
    place: null,
  },
  // App settings, edited in the Settings tab. theme is "dark" | "light" | "system"
  settings: {
    keepAwake: true,
    restNotification: true,
    reminderEnabled: false,
    reminderHour: 18,
    reminderMinute: 0,
    theme: "dark",
  },
  weight: { initial: 82.5, current: 79.3 },
  maxes: [
    { name: "Squat", initial: null, current: null },
    { name: "Panca piana", initial: null, current: null },
    { name: "Stacco", initial: null, current: null },
    { name: "Military press", initial: null, current: null },
  ],
  measurements: [
    { name: "Petto", initial: null, current: null },
    { name: "Vita", initial: null, current: null },
    { name: "Fianchi", initial: null, current: null },
    { name: "Braccio", initial: null, current: null },
    { name: "Coscia", initial: null, current: null },
  ],
};

// The example values that old versions saved on the phones: initial and current by name.
// They are cleared once, but only if the user never changed them.
export const LEGACY_DEMO_VALUES = {
  Squat: [100, 120],
  "Panca piana": [80, 92.5],
  Stacco: [130, 150],
  "Military press": [50, 57.5],
  Petto: [102, 104],
  Vita: [88, 84],
  Fianchi: [100, 98],
  Braccio: [36, 37.5],
  Coscia: [58, 59],
};

// Starting data for ProfileContext. Later it can read from storage or the API.
export function getProgress() {
  return progress;
}
