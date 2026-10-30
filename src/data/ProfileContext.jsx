import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProgress } from "./progress";

// Shared user data (personal info, weight, maxes, measurements), editable from Home and Profile.
// It is saved on the phone, so it survives an app restart.
const ProfileContext = createContext(null);

const STORAGE_KEY = "profile";

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(getProgress);
  const [loaded, setLoaded] = useState(false);

  // Load the saved data once. Missing sections fall back to the starting data,
  // so fields added in a future version still get a value.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) setProfile({ ...getProgress(), ...JSON.parse(saved) });
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

  // group is "maxes" or "measurements", field is "initial" or "current"
  function updateEntry(group, index, field, value) {
    setProfile((prev) => ({
      ...prev,
      [group]: prev[group].map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    }));
  }

  // Wait for the saved data, so the screens don't flash the starting values
  if (!loaded) return null;

  return (
    <ProfileContext.Provider
      value={{ profile, updatePersonal, updateWeight, updateEntry }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
