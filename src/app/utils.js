import { getLocales } from "expo-localization";

//Calculate 7 days from today
export default function week() {
  const lang = getLocales()[0]?.languageTag ?? "en-EN";

  const days = [];
  const today = new Date();

  for (let i = 2; i >= 1; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    days.push(day);
  }

  for (let i = 0; i <= 4; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    days.push(day);
  }

  const week = days.map((day) => {
    const dayName = day.toLocaleDateString(lang, {
      weekday: "short",
    });
    const dayNumber = day.getDate();

    return {
      key: day.toLocaleDateString(),
      dayNumber: dayNumber,
      dayName: dayName[0].toUpperCase() + dayName.slice(1),
      today: today.toLocaleDateString(),
    };
  });

  return week;
}
