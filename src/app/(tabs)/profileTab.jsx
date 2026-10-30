import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useColors, useStyles, glassCard } from "../../theme";
import { useProfile } from "../../data/ProfileContext";
import NumberField from "../components/NumberField";
import GlassBackground from "../components/GlassBackground";
import { TAB_BAR_SPACE } from "../components/GlassTabBar";
import { useT, entryName } from "../../i18n";

//A row with the starting and the current value of an entry, e.g. a max
function EntryRow({ label, entry, unit, onChange, first }) {
  const styles = useStyles(createStyles);
  return (
    <View style={[styles.row, !first && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <NumberField
        style={styles.entryField}
        value={entry.initial}
        unit={unit}
        onChange={(value) => onChange("initial", value)}
      />
      <NumberField
        style={styles.entryField}
        value={entry.current}
        unit={unit}
        onChange={(value) => onChange("current", value)}
      />
    </View>
  );
}

//Column titles shown above the entry rows
function EntryHeader() {
  const styles = useStyles(createStyles);
  const t = useT();
  return (
    <View style={styles.entryHeader}>
      <View style={styles.rowLabel} />
      <Text style={[styles.columnLabel, styles.entryField]}>
        {t("profile.initial")}
      </Text>
      <Text style={[styles.columnLabel, styles.entryField]}>
        {t("profile.current")}
      </Text>
    </View>
  );
}

export default function ProfileTab() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
  //A plain View with the insets keeps the ScrollView bounded inside the tab pager
  const insets = useSafeAreaInsets();
  const { profile, updatePersonal, updateWeight, updateEntry } = useProfile();
  const { personal, weight, maxes, measurements } = profile;

  //The name is saved when the field loses focus, an empty name is reverted
  const [name, setName] = useState(personal.name);
  useEffect(() => setName(personal.name), [personal.name]);

  function commitName() {
    if (name.trim()) updatePersonal("name", name.trim());
    else setName(personal.name);
  }

  return (
    <View style={[styles.body, { paddingTop: insets.top }]}>
      <GlassBackground />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {personal.name[0]?.toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.name}>{personal.name}</Text>
            <Text style={styles.heroDetails}>
              {t("profile.details", {
                age: personal.age,
                height: personal.height,
              })}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionText}>{t("profile.personal")}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t("profile.name")}</Text>
            <TextInput
              style={[styles.textField, styles.personalField]}
              value={name}
              onChangeText={setName}
              onBlur={commitName}
              onSubmitEditing={commitName}
              selectionColor={colors.tertiary}
              cursorColor={colors.tertiary}
            />
          </View>
          <View style={[styles.row, styles.rowDivider]}>
            <Text style={styles.rowLabel}>{t("profile.age")}</Text>
            <NumberField
              style={styles.personalField}
              value={personal.age}
              unit={t("profile.years")}
              onChange={(value) => updatePersonal("age", value)}
            />
          </View>
          <View style={[styles.row, styles.rowDivider]}>
            <Text style={styles.rowLabel}>{t("profile.height")}</Text>
            <NumberField
              style={styles.personalField}
              value={personal.height}
              unit="cm"
              onChange={(value) => updatePersonal("height", value)}
            />
          </View>
        </View>

        <Text style={styles.sectionText}>{t("profile.bodyWeight")}</Text>
        <View style={styles.card}>
          <EntryHeader />
          <EntryRow
            first
            label={t("profile.weight")}
            entry={weight}
            unit="kg"
            onChange={updateWeight}
          />
        </View>

        <Text style={styles.sectionText}>{t("profile.maxes")}</Text>
        <View style={styles.card}>
          <EntryHeader />
          {maxes.map((max, i) => (
            <EntryRow
              key={max.name}
              first={i === 0}
              label={entryName(t, max.name)}
              entry={max}
              unit="kg"
              onChange={(field, value) => updateEntry("maxes", i, field, value)}
            />
          ))}
        </View>

        <Text style={styles.sectionText}>{t("profile.measurements")}</Text>
        <View style={styles.card}>
          <EntryHeader />
          {measurements.map((measurement, i) => (
            <EntryRow
              key={measurement.name}
              first={i === 0}
              label={entryName(t, measurement.name)}
              entry={measurement}
              unit="cm"
              onChange={(field, value) =>
                updateEntry("measurements", i, field, value)
              }
            />
          ))}
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

    hero: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 10,
    },

    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.tertiary,
    },

    avatarText: {
      color: colors.tertiary,
      fontSize: 26,
      fontWeight: "700",
    },

    name: {
      color: colors.secondary,
      fontSize: 24,
    },

    heroDetails: {
      color: colors.secondaryDark,
    },

    sectionText: {
      color: colors.secondaryDark,
      marginTop: 10,
    },

    card: {
      ...glassCard(colors),
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 18,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },

    rowDivider: {
      borderTopWidth: 1,
      borderTopColor: colors.primaryLight,
    },

    rowLabel: {
      flex: 1,
      color: colors.secondary,
    },

    entryHeader: {
      flexDirection: "row",
      gap: 10,
      paddingTop: 8,
    },

    columnLabel: {
      color: colors.secondaryDark,
      fontSize: 11,
      textAlign: "center",
    },

    entryField: {
      width: 96,
    },

    personalField: {
      width: 150,
    },

    textField: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      backgroundColor: colors.primaryLight,
      color: colors.secondary,
      fontSize: 16,
      textAlign: "right",
    },
  });
