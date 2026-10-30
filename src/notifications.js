import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

//Notifications are not available on the web version
const supported = Platform.OS !== "web";

//Shows the notifications that arrive while the app is open, with a sound
if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

//Asks for the permission if it was never asked, true if notifications are allowed
export async function askPermission() {
  if (!supported) return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

//Schedules the "rest is over" notification at endTime (a timestamp), with the title and the
//body already in the current language. Returns its id, or null if it can't be shown,
//pass the id to cancelNotification to remove it
export async function scheduleRestEnd(endTime, { title, body }) {
  if (!(await askPermission())) return null;

  const seconds = Math.max(Math.ceil((endTime - Date.now()) / 1000), 1);

  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
}

export async function cancelNotification(id) {
  if (!supported || !id) return;
  await Notifications.cancelScheduledNotificationAsync(id);
}

//Puts the weekly reminders in line with the settings: removes the old ones and, if
//they are enabled, schedules one for each training weekday (0 = Sunday ... 6 = Saturday).
//title and body are the text of the reminder, in the current language
export async function syncReminders({
  enabled,
  hour,
  minute,
  weekdays,
  title,
  body,
}) {
  if (!supported) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith("reminder-"))
      .map((item) =>
        Notifications.cancelScheduledNotificationAsync(item.identifier),
      ),
  );

  if (!enabled || weekdays.length === 0) return;
  if (!(await askPermission())) return;

  for (const weekday of weekdays) {
    await Notifications.scheduleNotificationAsync({
      identifier: `reminder-${weekday}`,
      content: { title, body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        //Expo counts the weekdays from 1 = Sunday
        weekday: weekday + 1,
        hour,
        minute,
      },
    });
  }
}
