import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { colors } from "../../theme";
import { useProfile } from "../../data/ProfileContext";
import NumberField from "../components/NumberField";

//A row with the starting and the current value of an entry, e.g. a max
function EntryRow({ label, entry, unit, onChange, first }) {
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
  return (
    <View style={styles.entryHeader}>
      <View style={styles.rowLabel} />
      <Text style={[styles.columnLabel, styles.entryField]}>INIZIALE</Text>
      <Text style={[styles.columnLabel, styles.entryField]}>ATTUALE</Text>
    </View>
  );
}

export default function ProfileTab() {
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
              {personal.age} anni · {personal.height} cm
            </Text>
          </View>
        </View>

        <Text style={styles.sectionText}>DATI PERSONALI</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Nome</Text>
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
            <Text style={styles.rowLabel}>Età</Text>
            <NumberField
              style={styles.personalField}
              value={personal.age}
              unit="anni"
              onChange={(value) => updatePersonal("age", value)}
            />
          </View>
          <View style={[styles.row, styles.rowDivider]}>
            <Text style={styles.rowLabel}>Altezza</Text>
            <NumberField
              style={styles.personalField}
              value={personal.height}
              unit="cm"
              onChange={(value) => updatePersonal("height", value)}
            />
          </View>
        </View>

        <Text style={styles.sectionText}>PESO CORPOREO</Text>
        <View style={styles.card}>
          <EntryHeader />
          <EntryRow
            first
            label="Peso"
            entry={weight}
            unit="kg"
            onChange={updateWeight}
          />
        </View>

        <Text style={styles.sectionText}>MASSIMALI</Text>
        <View style={styles.card}>
          <EntryHeader />
          {maxes.map((max, i) => (
            <EntryRow
              key={max.name}
              first={i === 0}
              label={max.name}
              entry={max}
              unit="kg"
              onChange={(field, value) => updateEntry("maxes", i, field, value)}
            />
          ))}
        </View>

        <Text style={styles.sectionText}>CIRCONFERENZE</Text>
        <View style={styles.card}>
          <EntryHeader />
          {measurements.map((measurement, i) => (
            <EntryRow
              key={measurement.name}
              first={i === 0}
              label={measurement.name}
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

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  content: {
    padding: 20,
    paddingBottom: 30,
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
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderColor: colors.secondaryDark,
    borderWidth: 1,
    borderRadius: 14,
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
