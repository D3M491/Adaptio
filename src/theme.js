import { createContext, createElement, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useProfile } from "./data/ProfileContext";

export const darkColors = {
  primary: "#0e0606",
  primaryLight: "#4129293b",
  secondary: "#f8f8ff",
  secondaryDark: "#f8f8ff3b",
  tertiary: "#b92e34",
  //A darker red, for backgrounds that shouldn't look like a button
  tertiaryDark: "#6b1c20",
  //Text and icons on top of the red (tertiary) buttons, light in both themes
  onTertiary: "#f8f8ff",
  pro: "#a855f7",
  proLight: "#a855f726",
  //Glass look: fill and border of the cards, the light on their top edge, the strength of their
  //shadow, and the colored lights behind them (see GlassBackground)
  glassFill: "#ffffff12",
  glassBorder: "#ffffff26",
  glassHighlight: "#ffffff3d",
  glassShadow: 0.35,
  glowRed: "#b92e34",
  glowRedOpacity: 0.5,
  glowViolet: "#7c3aed",
  glowVioletOpacity: 0.36,
  star: "#c99a14",
};

export const lightColors = {
  primary: "#f6f1f0",
  primaryLight: "#1f141414",
  secondary: "#1c1212",
  secondaryDark: "#1c121270",
  tertiary: "#b92e34",
  tertiaryDark: "#8f2429",
  onTertiary: "#f8f8ff",
  pro: "#9333ea",
  proLight: "#9333ea1f",
  glassFill: "#ffffff99",
  glassBorder: "#ffffffd9",
  glassHighlight: "#ffffff",
  glassShadow: 0.12,
  glowRed: "#ff8f94",
  glowRedOpacity: 0.6,
  glowViolet: "#a78bfa",
  glowVioletOpacity: 0.5,
  star: "#e0b034",
};

//The style of a card in the glass look: translucent fill, a light border that is brighter on
//the top edge, and a soft shadow. Use it inside createStyles: ...glassCard(colors)
export function glassCard(colors) {
  return {
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderTopColor: colors.glassHighlight,
    shadowColor: "#000000",
    shadowOpacity: colors.glassShadow,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  };
}

//The same for small controls (chips, segments), without the shadow
export function glassChip(colors) {
  return {
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderTopColor: colors.glassHighlight,
  };
}

//The dark palette: for what stays dark in every theme, like the intro of the app
export const colors = darkColors;

const ThemeContext = createContext({ colors: darkColors, scheme: "dark" });

//Gives the colors of the theme chosen in the settings: "dark", "light" or "system"
//(the same as the phone). Needs to be inside ProfileProvider.
export function ThemeProvider({ children }) {
  const { profile } = useProfile();
  const systemScheme = useColorScheme();
  const theme = profile.settings.theme;

  const scheme =
    theme === "system" ? (systemScheme === "light" ? "light" : "dark") : theme;

  const value = useMemo(
    () => ({ colors: scheme === "light" ? lightColors : darkColors, scheme }),
    [scheme],
  );

  return createElement(ThemeContext.Provider, { value }, children);
}

//The colors of the current theme, for icons and other values not in a stylesheet
export function useColors() {
  return useContext(ThemeContext).colors;
}

//"dark" or "light", the theme in use
export function useScheme() {
  return useContext(ThemeContext).scheme;
}

//Builds the styles of a component with the colors of the current theme. createStyles is
//a function defined outside the component: (colors) => StyleSheet.create({ ... })
export function useStyles(createStyles) {
  const colors = useColors();
  return useMemo(() => createStyles(colors), [createStyles, colors]);
}
