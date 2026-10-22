import { getLocales } from "expo-localization";

//Calculate 7 days from today
export default function week() {
  const lang = getLocales()[0].languageTag;

  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    days.push(day);
  }

  const week = days.map((day) => {
    const dayName = day.getDate();
    const dayNumber = day.getDate();

    return {
      key: Math.random(),
      dayNumber: dayNumber,
      dayName: dayName,
    };
  });

  return week;
}
