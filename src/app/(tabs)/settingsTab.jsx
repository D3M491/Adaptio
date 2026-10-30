import { View, Text, ScrollView, Pressable, Switch, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, useStyles, glassCard, glassChip } from "../../theme";
import { useProfile } from "../../data/ProfileContext";
import ProBadge from "../components/ProBadge";
import GlassBackground from "../components/GlassBackground";
import { TAB_BAR_SPACE } from "../components/GlassTabBar";
import { useT, useLanguage } from "../../i18n";

//Monday first, with the number the days have in JavaScript (0 is Sunday)
const WEEKDAY_NUMBERS = [1, 2, 3, 4, 5, 6, 0];

const THEMES = ["dark", "light", "system"];

//"auto" follows the language of the phone
const LANGUAGES = ["auto", "it", "en"];

//The reminder time moves by half an hour at a time
const TIME_STEP = 30;

//e.g. 18, 0 -> "18:00" in Italian, "6:00 PM" in English
function formatTime(hour, minute, locale) {
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
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
  const t = useT();
  const { locale } = useLanguage();
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
      <GlassBackground />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("settings.title")}</Text>
          <ProBadge></ProBadge>
        </View>

        <Text style={styles.sectionText}>{t("settings.training")}</Text>
        <View style={styles.card}>
          <View style={styles.block}>
            <Text style={styles.rowTitle}>{t("settings.trainingDays")}</Text>
            <View style={styles.weekdays}>
              {WEEKDAY_NUMBERS.map((weekday) => {
                const isSelected = weekdays.includes(weekday);
                return (
                  <Pressable
                    key={weekday}
                    onPress={() => toggleWeekday(weekday)}
                    style={[styles.weekday, isSelected && styles.selected]}
                  >
                    <Text
                      style={[
                        styles.weekdayText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {t(`weekdays.${weekday}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <SwitchRow
            title={t("settings.keepAwake")}
            description={t("settings.keepAwakeNote")}
            value={settings.keepAwake}
            onValueChange={(value) => updateSetting("keepAwake", value)}
          />
        </View>

        <Text style={styles.sectionText}>{t("settings.notifications")}</Text>
        <View style={styles.card}>
          <SwitchRow
            first
            title={t("settings.restEnd")}
            description={t("settings.restEndNote")}
            value={settings.restNotification}
            onValueChange={(value) => updateSetting("restNotification", value)}
          />
          <SwitchRow
            title={t("settings.reminder")}
            description={t("settings.reminderNote")}
            value={settings.reminderEnabled}
            onValueChange={(value) => updateSetting("reminderEnabled", value)}
          />
          {settings.reminderEnabled && (
            <View style={[styles.row, styles.rowDivider]}>
              <Text style={styles.rowTitle}>{t("settings.reminderTime")}</Text>
              <View style={styles.stepper}>
                <Pressable
                  hitSlop={8}
                  onPress={() => changeReminderTime(-TIME_STEP)}
                >
                  <Text style={styles.stepperButton}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>
                  {formatTime(settings.reminderHour, settings.reminderMinute, locale)}
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

        <Text style={styles.sectionText}>{t("settings.appearance")}</Text>
        <View style={styles.card}>
          <View style={styles.block}>
            <Text style={styles.rowTitle}>{t("settings.theme")}</Text>
            <View style={styles.segmented}>
              {THEMES.map((theme) => {
                const isSelected = settings.theme === theme;
                return (
                  <Pressable
                    key={theme}
                    onPress={() => updateSetting("theme", theme)}
                    style={[styles.segment, isSelected && styles.selected]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {t(`settings.themes.${theme}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={styles.sectionText}>{t("settings.languageSection")}</Text>
        <View style={styles.card}>
          <View style={styles.block}>
            <Text style={styles.rowTitle}>{t("settings.language")}</Text>
            <View style={styles.segmented}>
              {LANGUAGES.map((language) => {
                const isSelected = (settings.language ?? "auto") === language;
                return (
                  <Pressable
                    key={language}
                    onPress={() => updateSetting("language", language)}
                    style={[styles.segment, isSelected && styles.selected]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {t(`settings.languages.${language}`)}
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
      paddingBottom: TAB_BAR_SPACE,
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
      ...glassCard(colors),
      borderRadius: 18,
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
      ...glassChip(colors),
      borderRadius: 12,
    },

    weekdayText: {
      color: colors.secondary,
      fontSize: 13,
    },

    selected: {
      borderColor: colors.tertiary,
      borderTopColor: colors.tertiary,
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
      ...glassChip(colors),
      borderRadius: 12,
    },

    segmentText: {
      color: colors.secondary,
      fontSize: 14,
    },
  });
