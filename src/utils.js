//Calculate 7 days from today. The names of the days follow the locale (e.g. "it-IT", "en-US")
export default function week(lang) {
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
      //The same in every language, so the selected day doesn't change with it
      key: day.toDateString(),
      date: day,
      dayNumber: dayNumber,
      //0 is Sunday ... 6 is Saturday
      weekday: day.getDay(),
      dayName: dayName[0].toUpperCase() + dayName.slice(1),
      today: today.toDateString(),
    };
  });

  return week;
}
