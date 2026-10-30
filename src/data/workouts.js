import { wgerWorkouts } from "./wgerWorkouts";

// Offline workouts, written by hand. More come from wger, see scripts/import-wger.mjs.
// Each exercise: rest in seconds, optional technique (e.g. "dropset"), RPE can be null.
const workouts = [
  {
    id: "push-pull-legs",
    name: "Push Pull Legs",
    days: [
      {
        day: 1,
        name: "Push",
        exercises: [
          {
            exerciseName: "Dumbbell Horizontal Bench Press",
            sets: 3,
            reps: 8,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "45° Chest Press",
            sets: 3,
            reps: 10,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "Shoulder Press",
            sets: 3,
            reps: 10,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "Pectoral Machine",
            sets: 3,
            reps: 12,
            technique: "dropset",
            RPE: 9,
            rest: 90,
          },
          {
            exerciseName: "Pushdown Rope",
            sets: 3,
            reps: 15,
            RPE: 9,
            rest: 60,
          },
        ],
      },
      {
        day: 2,
        name: "Pull",
        exercises: [
          {
            exerciseName: "Barbell Row",
            sets: 4,
            reps: 10,
            RPE: 8,
            rest: 120,
          },
          {
            exerciseName: "Lat Machine",
            sets: 3,
            reps: 10,
            technique: "dropset",
            RPE: 9,
            rest: 90,
          },
          {
            exerciseName: "Seated Cable Row",
            sets: 3,
            reps: 12,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "Dumbbell Curl",
            sets: 3,
            reps: 12,
            RPE: 9,
            rest: 60,
          },
        ],
      },
      {
        day: 3,
        name: "Legs",
        exercises: [
          {
            exerciseName: "Squat",
            sets: 4,
            reps: 8,
            RPE: 8,
            rest: 150,
          },
          {
            exerciseName: "Leg Press",
            sets: 3,
            reps: 12,
            RPE: 8,
            rest: 120,
          },
          {
            exerciseName: "Leg Curl",
            sets: 3,
            reps: 12,
            RPE: 9,
            rest: 90,
          },
          {
            exerciseName: "Calf Raise",
            sets: 4,
            reps: 15,
            RPE: 9,
            rest: 60,
          },
        ],
      },
    ],
  },
  {
    id: "full-body",
    name: "Full Body",
    days: [
      {
        day: 1,
        name: "Full Body A",
        exercises: [
          {
            exerciseName: "Squat",
            sets: 3,
            reps: 8,
            RPE: 8,
            rest: 120,
          },
          {
            exerciseName: "Dumbbell Horizontal Bench Press",
            sets: 3,
            reps: 8,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "Barbell Row",
            sets: 3,
            reps: 10,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "Plank",
            sets: 3,
            reps: 1,
            RPE: 7,
            rest: 60,
          },
        ],
      },
      {
        day: 2,
        name: "Full Body B",
        exercises: [
          {
            exerciseName: "Romanian Deadlift",
            sets: 3,
            reps: 8,
            RPE: 8,
            rest: 120,
          },
          {
            exerciseName: "Shoulder Press",
            sets: 3,
            reps: 10,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "Lat Machine",
            sets: 3,
            reps: 10,
            RPE: 8,
            rest: 90,
          },
          {
            exerciseName: "Leg Curl",
            sets: 3,
            reps: 12,
            technique: "dropset",
            RPE: 9,
            rest: 90,
          },
        ],
      },
    ],
  },
];

// Where a workout comes from: shown as a label next to it
export const SOURCE_LABELS = {
  adaptio: "Adaptio Workouts",
  wger: "Community Workouts",
};

const allWorkouts = [
  ...workouts.map((workout) => ({ ...workout, source: "adaptio" })),
  ...wgerWorkouts,
];

// Single access point: today it reads local files, later it can call an API.
export function getWorkouts() {
  return allWorkouts;
}

// The day of a workout planned on a weekday (0 = Sunday ... 6 = Saturday), or null for a rest day.
// The training weekdays, from Monday, take the days of the workout one after the other:
// with Monday, Wednesday and Friday, Monday is DAY 1, Wednesday DAY 2 and Friday DAY 3.
// If there are more weekdays than days, the days start over.
//The days of the workout rotate through the training days without restarting every week:
//with 4 training days and a 3 day workout the weeks go D1 D2 D3 D1, then D2 D3 D1 D2 and so on.
//The rotation starts on startDate ("YYYY-MM-DD", the day the workout was set), the day itself
//is a Date. Returns null on a day that is not a training day
export function getWorkoutDayForDate(workout, weekdays, date, startDate) {
  if (!weekdays.includes(date.getDay())) return null;

  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const [year, month, dayOfMonth] = (startDate ?? "").split("-").map(Number);
  const start = year ? new Date(year, month - 1, dayOfMonth) : day;

  //Training days between the start and the day: before the start they count backwards
  const forward = day >= start;
  const from = forward ? new Date(start) : new Date(day);
  const until = forward ? day : start;
  let count = 0;
  while (from < until) {
    if (weekdays.includes(from.getDay())) count++;
    from.setDate(from.getDate() + 1);
  }

  const total = workout.days.length;
  const position = forward ? count : -count;
  return workout.days[((position % total) + total) % total];
}

//Today as "YYYY-MM-DD" in the local time
export function todayKey() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// The name of an exercise in a language ("it" or "en"). The imported workouts have it in both,
// the others have only exerciseName
export function exerciseLabel(exercise, language) {
  return exercise.exerciseNames?.[language] ?? exercise.exerciseName;
}

// The workout chosen by the user is saved in the profile (currentWorkoutId), then found by id.
export function getWorkoutById(id) {
  return allWorkouts.find((workout) => workout.id === id);
}
