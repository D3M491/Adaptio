import { View, Text, ScrollView, Pressable, Switch, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, useStyles } from "../../theme";
import { useProfile } from "../../data/ProfileContext";
import ProBadge from "../components/ProBadge";

//Monday first, with the number the days have in JavaScript (0 is Sunday)
const WEEKDAYS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mer" },
  { value: 4, label: "Gio" },
  { value: 5, label: "Ven" },
  { value: 6, label: "Sab" },
  { value: 0, label: "Dom" },
];

const THEMES = [
  { value: "dark", label: "Scuro" },
  { value: "light", label: "Chiaro" },
  { value: "system", label: "Automatico" },
];

//The reminder time moves by half an hour at a time
const TIME_STEP = 30;

//e.g. 18, 0 -> "18:00"
function formatTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

//A row with a title, a short explanation and a switch
function SwitchRow({ title, description, value, onValueChange, first }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  return (
    <View style={[styles.row, !first && styles.rowDivider]}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {description && <Text style={styles.rowDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.secondaryDark, true: colors.tertiary }}
        thumbColor={colors.secondary}
      />
    </View>
  );
}

export default function Settings() {
  const styles = useStyles(createStyles);
  //A plain View with the insets keeps the ScrollView bounded inside the tab pager
  const insets = useSafeAreaInsets();
  const { profile, updateSetting, updateTrainingDays } = useProfile();
  const { settings, training } = profile;

  const weekdays = training.weekdays ?? [];

  //Adds or removes a training day, at least one stays selected
  function toggleWeekday(weekday) {
    if (weekdays.includes(weekday)) {
      if (weekdays.length > 1) {
        updateTrainingDays(weekdays.filter((item) => item !== weekday));
      }
    } else {
      updateTrainingDays([...weekdays, weekday]);
    }
  }

  //Moves the reminder time, going around midnight
  function changeReminderTime(minutes) {
    const total = settings.reminderHour * 60 + settings.reminderMinute + minutes;
    const wrapped = ((total % 1440) + 1440) % 1440;
    updateSetting("reminderHour", Math.floor(wrapped / 60));
    updateSetting("reminderMinute", wrapped % 60);
  }

  return (
    <View style={[styles.body, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Impostazioni</Text>
          <ProBadge></ProBadge>
        </View>

        <Text style={styles.sectionText}>ALLENAMENTO</Text>
        <View style={styles.card}>
          <View style={styles.block}>
            <Text style={styles.rowTitle}>Giorni di allenamento</Text>
            <View style={styles.weekdays}>
              {WEEKDAYS.map((weekday) => {
                const isSelected = weekdays.includes(weekday.value);
                return (
                  <Pressable
                    key={weekday.value}
                    onPress={() => toggleWeekday(weekday.value)}
                    style={[styles.weekday, isSelected && styles.selected]}
                  >
                    <Text
                      style={[
                        styles.weekdayText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {weekday.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <SwitchRow
            title="Schermo sempre acceso"
            description="Durante l'allenamento, per vedere sempre il timer di recupero"
            value={settings.keepAwake}
            onValueChange={(value) => updateSetting("keepAwake", value)}
          />
        </View>

        <Text style={styles.sectionText}>NOTIFICHE</Text>
        <View style={styles.card}>
          <SwitchRow
            first
            title="Fine pausa"
            description="Ti avvisa quando il recupero è finito, anche a telefono bloccato"
            value={settings.restNotification}
            onValueChange={(value) => updateSetting("restNotification", value)}
          />
          <SwitchRow
            title="Promemoria allenamento"
            description="Nei giorni di allenamento che hai scelto"
            value={settings.reminderEnabled}
            onValueChange={(value) => updateSetting("reminderEnabled", value)}
          />
          {settings.reminderEnabled && (
            <View style={[styles.row, styles.rowDivider]}>
              <Text style={styles.rowTitle}>Ora del promemoria</Text>
              <View style={styles.stepper}>
                <Pressable
                  hitSlop={8}
                  onPress={() => changeReminderTime(-TIME_STEP)}
                >
                  <Text style={styles.stepperButton}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>
                  {formatTime(settings.reminderHour, settings.reminderMinute)}
                </Text>
                <Pressable
                  hitSlop={8}
                  onPress={() => changeReminderTime(TIME_STEP)}
                >
                  <Text style={styles.stepperButton}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.sectionText}>ASPETTO</Text>
        <View style={styles.card}>
          <View style={styles.block}>
            <Text style={styles.rowTitle}>Tema</Text>
            <View style={styles.segmented}>
              {THEMES.map((theme) => {
                const isSelected = settings.theme === theme.value;
                return (
                  <Pressable
                    key={theme.value}
                    onPress={() => updateSetting("theme", theme.value)}
                    style={[styles.segment, isSelected && styles.selected]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {theme.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: colors.primary,
    },

    content: {
      padding: 20,
      paddingBottom: 30,
      gap: 10,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      color: colors.secondary,
      fontSize: 24,
    },

    sectionText: {
      color: colors.secondaryDark,
      marginTop: 10,
    },

    card: {
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      borderRadius: 14,
      paddingHorizontal: 16,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingVertical: 14,
    },

    rowDivider: {
      borderTopWidth: 1,
      borderTopColor: colors.primaryLight,
    },

    rowText: {
      flex: 1,
    },

    rowTitle: {
      color: colors.secondary,
      fontSize: 16,
    },

    rowDescription: {
      color: colors.secondaryDark,
      fontSize: 13,
      marginTop: 2,
    },

    block: {
      gap: 12,
      paddingVertical: 14,
    },

    weekdays: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    weekday: {
      width: 40,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      borderRadius: 12,
    },

    weekdayText: {
      color: colors.secondary,
      fontSize: 13,
    },

    selected: {
      borderColor: colors.tertiary,
      backgroundColor: "#b92e342e",
    },

    selectedText: {
      fontWeight: "700",
    },

    stepper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },

    stepperButton: {
      color: colors.tertiary,
      fontSize: 26,
      paddingHorizontal: 6,
    },

    stepperValue: {
      color: colors.secondary,
      fontSize: 18,
      fontWeight: "600",
      minWidth: 54,
      textAlign: "center",
    },

    segmented: {
      flexDirection: "row",
      gap: 8,
    },

    segment: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      borderRadius: 12,
    },

    segmentText: {
      color: colors.secondary,
      fontSize: 14,
    },
  });
