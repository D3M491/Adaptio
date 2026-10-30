// Starting progress data, used until the user saves their own values.
// Every entry has the starting value and the latest one: weight and maxes in kg, measurements in cm.
const progress = {
  personal: { name: "Manuel", age: 27, height: 178 },
  weight: { initial: 82.5, current: 79.3 },
  maxes: [
    { name: "Squat", initial: 100, current: 120 },
    { name: "Panca piana", initial: 80, current: 92.5 },
    { name: "Stacco", initial: 130, current: 150 },
    { name: "Military press", initial: 50, current: 57.5 },
  ],
  measurements: [
    { name: "Petto", initial: 102, current: 104 },
    { name: "Vita", initial: 88, current: 84 },
    { name: "Fianchi", initial: 100, current: 98 },
    { name: "Braccio", initial: 36, current: 37.5 },
    { name: "Coscia", initial: 58, current: 59 },
  ],
};

// Starting data for ProfileContext. Later it can read from storage or the API.
export function getProgress() {
  return progress;
}
