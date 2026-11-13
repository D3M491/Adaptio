import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { Camera } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useColors, useStyles, glassCard } from "../../theme";
import { useProfile } from "../../data/ProfileContext";
import NumberField from "../components/NumberField";
import GlassBackground from "../components/GlassBackground";
import ConfirmDialog from "../components/ConfirmDialog";
import { TAB_BAR_SPACE } from "../components/GlassTabBar";
import { useT, useLanguage, entryName, formatNumber } from "../../i18n";

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
  const { language, locale } = useLanguage();
  //The last workouts done, the newest first
  const recentSessions = (profile.sessions ?? []).slice(0, 5);

  //The name is saved when the field loses focus, an empty name is reverted
  const [name, setName] = useState(personal.name);
  useEffect(() => setName(personal.name), [personal.name]);

  //Picks a square photo from the library and keeps a copy in the documents of the app: the
  //picker's own file is in the cache, which the system can empty
  //Without a photo the avatar goes straight to the library, with one it asks what to do
  const [photoMenu, setPhotoMenu] = useState(false);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;

    try {
      const saved = new File(Paths.document, `profile-photo-${Date.now()}.jpg`);
      new File(result.assets[0].uri).copy(saved);
      if (personal.photo) {
        const old = new File(personal.photo);
        if (old.exists) old.delete();
      }
      updatePersonal("photo", saved.uri);
    } catch {
      //The photo could not be saved: the previous one stays
    }
  }

  //Deletes the saved file and goes back to the initial of the name
  function removePhoto() {
    setPhotoMenu(false);
    try {
      const file = new File(personal.photo);
      if (file.exists) file.delete();
    } catch {
      //The file is already gone
    }
    updatePersonal("photo", null);
  }

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
          {/* Tapping the avatar changes the photo */}
          <Pressable
            onPress={() => (personal.photo ? setPhotoMenu(true) : pickPhoto())}
            style={styles.avatar}
          >
            {personal.photo ? (
              <Image source={{ uri: personal.photo }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {personal.name[0]?.toUpperCase()}
              </Text>
            )}
            <View style={styles.avatarBadge}>
              <Camera size={12} color={colors.onTertiary} />
            </View>
          </Pressable>
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

        <Text style={styles.sectionText}>{t("profile.history")}</Text>
        <View style={styles.card}>
          {recentSessions.length === 0 ? (
            <Text style={styles.historyEmpty}>{t("profile.historyEmpty")}</Text>
          ) : (
            recentSessions.map((session, i) => (
              <View
                key={session.id}
                style={[styles.sessionRow, i > 0 && styles.rowDivider]}
              >
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionDay}>
                    {t("workout.dayLabel", { n: session.day })}
                  </Text>
                  <Text style={styles.sessionName}>{session.dayName}</Text>
                  <Text style={styles.sessionDate}>
                    {new Date(`${session.date}T12:00:00`).toLocaleDateString(locale, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
                <View style={styles.sessionStats}>
                  <Text style={styles.sessionStat}>
                    {t("profile.sessionMinutes", {
                      minutes: Math.max(1, Math.round(session.durationSec / 60)),
                    })}
                  </Text>
                  <Text style={styles.sessionStat}>
                    {formatNumber(session.volume, language)} kg
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={photoMenu}
        title={t("profile.photoTitle")}
        confirmText={t("profile.photoChange")}
        onConfirm={() => {
          setPhotoMenu(false);
          //iOS can't open the library while the dialog is still closing: wait for it
          setTimeout(pickPhoto, 500);
        }}
        onCancel={() => setPhotoMenu(false)}
      >
        <Pressable onPress={removePhoto} style={styles.photoRemove}>
          <Text style={styles.photoRemoveText}>{t("profile.photoRemove")}</Text>
        </Pressable>
      </ConfirmDialog>
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

    avatarImage: {
      width: 62,
      height: 62,
      borderRadius: 31,
    },

    //Small camera on the corner, it tells the photo can be changed
    avatarBadge: {
      position: "absolute",
      right: -4,
      bottom: -4,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tertiary,
    },

    historyEmpty: {
      color: colors.secondaryDark,
      padding: 16,
    },

    sessionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },

    sessionInfo: {
      flex: 1,
    },

    sessionDay: {
      color: colors.tertiary,
      fontSize: 12,
    },

    sessionName: {
      color: colors.secondary,
      fontSize: 16,
      marginTop: 2,
    },

    sessionDate: {
      color: colors.secondaryDark,
      fontSize: 13,
      marginTop: 2,
    },

    sessionStats: {
      alignItems: "flex-end",
      gap: 2,
    },

    sessionStat: {
      color: colors.secondaryDark,
      fontSize: 13,
    },

    photoRemove: {
      alignItems: "center",
      paddingVertical: 12,
      marginTop: 8,
    },

    photoRemoveText: {
      color: colors.tertiary,
      fontWeight: "600",
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
