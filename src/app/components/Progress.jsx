import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pencil, ChevronRight } from "lucide-react-native";
import { useColors, useStyles, glassCard } from "../../theme";
import { useProfile } from "../../data/ProfileContext";
import {
  useT,
  useLanguage,
  formatNumber,
  numberToText,
  parseNumber,
  entryName,
} from "../../i18n";
import ConfirmDialog from "./ConfirmDialog";

//Formats a number the way the language does, e.g. 92.5 -> 92,5 in Italian. An empty value (null) is a dash
function formatValue(value, language) {
  return value === null ? "—" : formatNumber(value, language);
}

//Difference from the starting value with its sign, e.g. +12,5 kg
function formatDelta(entry, unit, language) {
  const delta = Math.round((entry.current - entry.initial) * 10) / 10;
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}${formatValue(Math.abs(delta), language)} ${unit}`;
}


export default function Progress() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
  const { language } = useLanguage();
  const router = useRouter();
  const { profile, updateWeight, updateEntry } = useProfile();
  const { weight, maxes, measurements } = profile;

  //Value being edited: null, { group: "weight" } or { group: "maxes", index }
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  const editingEntry =
    editing?.group === "weight" ? weight : editing && maxes[editing.index];

  function startEditing(target, entry) {
    setDraft(numberToText(entry.current, language));
    setEditing(target);
  }

  //Saves the new current value, an invalid number is ignored
  function save() {
    const value = parseNumber(draft);
    if (draft.trim() && !Number.isNaN(value)) {
      if (editing.group === "weight") updateWeight("current", value);
      else updateEntry("maxes", editing.index, "current", value);
    }
    setEditing(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionText}>{t("progress.section")}</Text>

      <Pressable
        onPress={() => startEditing({ group: "weight" }, weight)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>{t("progress.bodyWeight")}</Text>
          <Pencil size={14} color={colors.secondaryDark} />
        </View>
        <View style={styles.weightRow}>
          <Text style={styles.weightValue}>
            {formatValue(weight.current, language)}
            <Text style={styles.weightUnit}> kg</Text>
          </Text>
          <Text style={styles.delta}>{formatDelta(weight, "kg", language)}</Text>
        </View>
        <Text style={styles.initial}>
          {t("progress.initial", {
            value: formatValue(weight.initial, language),
          })}
        </Text>
      </Pressable>

      <Text style={styles.subsectionText}>{t("progress.maxes")}</Text>
      <View style={styles.grid}>
        {maxes.map((max, index) => (
          <Pressable
            key={max.name}
            onPress={() => startEditing({ group: "maxes", index }, max)}
            style={({ pressed }) => [
              styles.card,
              styles.gridItem,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>{entryName(t, max.name)}</Text>
              <Pencil size={14} color={colors.secondaryDark} />
            </View>
            <Text style={styles.maxValue}>
              {formatValue(max.current, language)}
              {max.current !== null && <Text style={styles.maxUnit}> kg</Text>}
            </Text>
            {max.current === null ? (
              <Text style={styles.initial}>{t("progress.tapToAdd")}</Text>
            ) : (
              <Text style={styles.delta}>{formatDelta(max, "kg", language)}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Measurements are many small values: they're edited in the Profile tab */}
      <View style={styles.subsectionHeader}>
        <Text style={styles.subsectionText}>
          {t("progress.measurements")}
        </Text>
        <Pressable
          hitSlop={10}
          onPress={() => router.navigate("/profileTab")}
          style={styles.editLink}
        >
          <Text style={styles.editLinkText}>{t("progress.edit")}</Text>
          <ChevronRight size={14} color={colors.tertiary} />
        </Pressable>
      </View>
      <View style={styles.card}>
        {measurements.map((measurement, i) => (
          <View
            key={measurement.name}
            style={[styles.measureRow, i > 0 && styles.measureDivider]}
          >
            <Text style={styles.measureName}>
              {entryName(t, measurement.name)}
            </Text>
            <Text style={styles.measureValue}>
              {measurement.current === null
                ? "—"
                : `${formatValue(measurement.current, language)} cm`}
            </Text>
            <Text style={[styles.delta, styles.measureDelta]}>
              {measurement.current !== null &&
                formatDelta(measurement, "cm", language)}
            </Text>
          </View>
        ))}
      </View>

      <ConfirmDialog
        visible={editing !== null}
        title={
          editing?.group === "weight"
            ? t("progress.bodyWeight")
            : editingEntry && entryName(t, editingEntry.name)
        }
        message={
          editingEntry &&
          (editingEntry.initial === null
            ? t("progress.firstValue")
            : t("progress.currentValue", {
                value: formatValue(editingEntry.initial, language),
              }))
        }
        confirmText={t("progress.save")}
        onConfirm={save}
        onCancel={() => setEditing(null)}
      >
        <View style={styles.dialogField}>
          <TextInput
            style={styles.dialogInput}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={save}
            keyboardType="decimal-pad"
            autoFocus
            selectTextOnFocus
            selectionColor={colors.tertiary}
            cursorColor={colors.tertiary}
          />
          <Text style={styles.dialogUnit}>kg</Text>
        </View>
      </ConfirmDialog>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },

    sectionText: {
      color: colors.secondaryDark,
    },

    //Same look as sectionText, so all the titles of the home have the same size
    subsectionText: {
      color: colors.secondaryDark,
    },

    subsectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
    },

    editLink: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },

    editLinkText: {
      color: colors.tertiary,
      fontSize: 12,
    },

    card: {
      ...glassCard(colors),
      padding: 16,
      gap: 4,
      borderRadius: 18,
    },

    cardPressed: {
      backgroundColor: colors.primaryLight,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    cardLabel: {
      color: colors.secondaryDark,
    },

    weightRow: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },

    weightValue: {
      color: colors.secondary,
      fontSize: 32,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    weightUnit: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.secondaryDark,
    },

    initial: {
      color: colors.secondaryDark,
      fontSize: 12,
    },

    delta: {
      color: colors.tertiary,
      fontVariant: ["tabular-nums"],
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    //Two tiles per row: half width minus half the gap
    gridItem: {
      width: "48%",
      flexGrow: 1,
    },

    maxValue: {
      color: colors.secondary,
      fontSize: 22,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    maxUnit: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.secondaryDark,
    },

    measureRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },

    measureDivider: {
      borderTopWidth: 1,
      borderTopColor: colors.primaryLight,
    },

    measureName: {
      flex: 1,
      color: colors.secondary,
    },

    measureValue: {
      color: colors.secondary,
      fontVariant: ["tabular-nums"],
    },

    measureDelta: {
      width: 70,
      textAlign: "right",
    },

    dialogField: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      paddingHorizontal: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      backgroundColor: colors.primaryLight,
    },

    dialogInput: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 12,
      color: colors.secondary,
      fontSize: 22,
      fontWeight: "700",
    },

    dialogUnit: {
      color: colors.secondaryDark,
      fontSize: 16,
    },
  });
