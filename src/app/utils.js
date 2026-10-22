//Calculate 7 days from today
export default function week() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    days.push(day);
  }

  const week = days.map((day) => {
    const date = day.toLocaleDateString(navigator.language, {
      day: "2-digit",
      weekday: "short",
    });

    return {
      key: day.toLocaleDateString(),
      day: date,
    };
  });
  return week;
}
