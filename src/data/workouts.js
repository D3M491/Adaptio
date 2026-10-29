// Workout offline. In futuro alcuni arriveranno da API: basta cambiare getWorkouts().
// Ogni esercizio: rest in secondi, technique opzionale (es. "dropset").
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

// Punto di accesso unico: oggi legge il file locale, domani potrà chiamare l'API.
export function getWorkouts() {
  return workouts;
}

// Workout attualmente in corso. Per ora e' il primo: in futuro sara' scelto dall'utente.
export function getCurrentWorkout() {
  return workouts[0];
}

export function getWorkoutById(id) {
  return workouts.find((workout) => workout.id === id);
}
