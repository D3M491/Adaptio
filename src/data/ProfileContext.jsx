import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProgress, LEGACY_DEMO_VALUES } from "./progress";
import { todayKey } from "./workouts";

// Shared user data (personal info, weight, maxes, measurements), editable from Home and Profile.
// It is saved on the phone, so it survives an app restart.
const ProfileContext = createContext(null);

const STORAGE_KEY = "profile";

// Empties the entries that still have the example values of old versions
function clearLegacyDemo(entries) {
  return entries.map((entry) => {
    const demo = LEGACY_DEMO_VALUES[entry.name];
    const isDemo =
      demo && entry.initial === demo[0] && entry.current === demo[1];
    return isDemo ? { ...entry, initial: null, current: null } : entry;
  });
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(getProgress);
  const [loaded, setLoaded] = useState(false);
  // True only in the session where the first-launch form was completed, it is not saved:
  // the home says "Piacere" then, and "Rieccoti" from the next app start
  // (greetings without a gender, so the app doesn't need to ask it)
  const [justOnboarded, setJustOnboarded] = useState(false);

  // Load the saved data once. Missing sections fall back to the starting data,
  // so fields added in a future version still get a value.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          const savedProfile = JSON.parse(saved);
          const merged = { ...getProgress(), ...savedProfile };

          // Sections that grew in newer versions: a saved profile keeps its values and
          // gets the new fields (e.g. the weekdays of the training, new settings)
          merged.settings = { ...getProgress().settings, ...savedProfile.settings };
          merged.training = { ...getProgress().training, ...savedProfile.training };

          // Old versions saved example maxes and measurements: empty them once, only if
          // the user didn't change them
          if (!savedProfile.legacyDemoCleared) {
            merged.maxes = clearLegacyDemo(merged.maxes);
            merged.measurements = clearLegacyDemo(merged.measurements);
            merged.legacyDemoCleared = true;
          }

          //A workout chosen before the rotation existed starts today
          if (merged.currentWorkoutId && !merged.currentWorkoutStart) {
            merged.currentWorkoutStart = todayKey();
          }

          setProfile(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Save every change, but only after loading so the defaults never overwrite saved data
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile)).catch(
        () => {},
      );
    }
  }, [profile, loaded]);

  // e.g. updatePersonal("height", 180)
  function updatePersonal(field, value) {
    setProfile((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  }

  // field is "initial" or "current"
  function updateWeight(field, value) {
    setProfile((prev) => ({
      ...prev,
      weight: { ...prev.weight, [field]: value },
    }));
  }

  // Saves the first-launch form: the weight entered is both the starting and the current one
  function completeOnboarding({ name, age, height, weight, training }) {
    setJustOnboarded(true);
    setProfile((prev) => ({
      ...prev,
      onboarded: true,
      personal: { ...prev.personal, name, age, height },
      weight: { initial: weight, current: weight },
      training,
    }));
  }

  // e.g. updateSetting("keepAwake", false)
  function updateSetting(key, value) {
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  }

  // Changes the days chosen to train: the days a week are as many as the weekdays
  function updateTrainingDays(weekdays) {
    setProfile((prev) => ({
      ...prev,
      training: {
        ...prev.training,
        weekdays,
        daysPerWeek: weekdays.length,
      },
    }));
  }

  // Sets the workout shown on the home and used by Start, e.g. selectWorkout("full-body")
  function selectWorkout(id) {
    setProfile((prev) => ({
      ...prev,
      currentWorkoutId: id,
      currentWorkoutStart: todayKey(),
    }));
  }

  // group is "maxes" or "measurements", field is "initial" or "current".
  // The first value of an empty entry is both the starting and the current one.
  function updateEntry(group, index, field, value) {
    setProfile((prev) => ({
      ...prev,
      [group]: prev[group].map((entry, i) => {
        if (i !== index) return entry;
        if (entry.initial === null && entry.current === null) {
          return { ...entry, initial: value, current: value };
        }
        return { ...entry, [field]: value };
      }),
    }));
  }

  // Wait for the saved data, so the screens don't flash the starting values
  if (!loaded) return null;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        justOnboarded,
        updatePersonal,
        updateWeight,
        updateEntry,
        completeOnboarding,
        selectWorkout,
        updateSetting,
        updateTrainingDays,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
