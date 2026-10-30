import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pencil, ChevronRight } from "lucide-react-native";
import { useColors, useStyles } from "../../theme";
import { useProfile } from "../../data/ProfileContext";
import ConfirmDialog from "./ConfirmDialog";

//Formats a number the Italian way, e.g. 92.5 -> 92,5. An empty value (null) is a dash
function formatValue(value) {
  return value === null ? "—" : value.toLocaleString("it-IT");
}

//Difference from the starting value with its sign, e.g. +12,5 kg
function formatDelta(entry, unit) {
  const delta = Math.round((entry.current - entry.initial) * 10) / 10;
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}${formatValue(Math.abs(delta))} ${unit}`;
}

export default function Progress() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const router = useRouter();
  const { profile, updateWeight, updateEntry } = useProfile();
  const { weight, maxes, measurements } = profile;

  //Value being edited: null, { group: "weight" } or { group: "maxes", index }
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  const editingEntry =
    editing?.group === "weight" ? weight : editing && maxes[editing.index];

  function startEditing(target, entry) {
    setDraft(entry.current === null ? "" : String(entry.current).replace(".", ","));
    setEditing(target);
  }

  //Saves the new current value, an invalid number is ignored
  function save() {
    const value = Number(draft.replace(",", "."));
    if (draft.trim() && !Number.isNaN(value)) {
      if (editing.group === "weight") updateWeight("current", value);
      else updateEntry("maxes", editing.index, "current", value);
    }
    setEditing(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionText}>PROGRESS</Text>

      <Pressable
        onPress={() => startEditing({ group: "weight" }, weight)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Peso corporeo</Text>
          <Pencil size={14} color={colors.secondaryDark} />
        </View>
        <View style={styles.weightRow}>
          <Text style={styles.weightValue}>
            {formatValue(weight.current)}
            <Text style={styles.weightUnit}> kg</Text>
          </Text>
          <Text style={styles.delta}>{formatDelta(weight, "kg")}</Text>
        </View>
        <Text style={styles.initial}>
          Iniziale {formatValue(weight.initial)} kg
        </Text>
      </Pressable>

      <Text style={styles.subsectionText}>MASSIMALI</Text>
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
              <Text style={styles.cardLabel}>{max.name}</Text>
              <Pencil size={14} color={colors.secondaryDark} />
            </View>
            <Text style={styles.maxValue}>
              {formatValue(max.current)}
              {max.current !== null && <Text style={styles.maxUnit}> kg</Text>}
            </Text>
            {max.current === null ? (
              <Text style={styles.initial}>Tocca per aggiungere</Text>
            ) : (
              <Text style={styles.delta}>{formatDelta(max, "kg")}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Measurements are many small values: they're edited in the Profile tab */}
      <View style={styles.subsectionHeader}>
        <Text style={styles.subsectionText}>CIRCONFERENZE</Text>
        <Pressable
          hitSlop={10}
          onPress={() => router.navigate("/profileTab")}
          style={styles.editLink}
        >
          <Text style={styles.editLinkText}>Modifica</Text>
          <ChevronRight size={14} color={colors.tertiary} />
        </Pressable>
      </View>
      <View style={styles.card}>
        {measurements.map((measurement, i) => (
          <View
            key={measurement.name}
            style={[styles.measureRow, i > 0 && styles.measureDivider]}
          >
            <Text style={styles.measureName}>{measurement.name}</Text>
            <Text style={styles.measureValue}>
              {measurement.current === null
                ? "—"
                : `${formatValue(measurement.current)} cm`}
            </Text>
            <Text style={[styles.delta, styles.measureDelta]}>
              {measurement.current !== null && formatDelta(measurement, "cm")}
            </Text>
          </View>
        ))}
      </View>

      <ConfirmDialog
        visible={editing !== null}
        title={
          editing?.group === "weight" ? "Peso corporeo" : editingEntry?.name
        }
        message={
          editingEntry &&
          (editingEntry.initial === null
            ? "Il primo valore sarà anche quello iniziale"
            : `Valore attuale · iniziale ${formatValue(editingEntry.initial)} kg`)
        }
        confirmText="Salva"
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
      padding: 16,
      gap: 4,
      borderColor: colors.secondaryDark,
      borderWidth: 1,
      borderRadius: 14,
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
