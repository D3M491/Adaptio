import { useId } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { BlurView } from "expo-blur";
import { useColors, useScheme, useStyles, glassCard } from "../../theme";

//Space the screens leave at the bottom of their content, so nothing stays hidden under the bar
export const TAB_BAR_SPACE = 110;

//The tab bar in the glass look: a pill that floats over the screens, blurring what scrolls
//behind it. It replaces the default bar of TopTabs (the `tabBar` option of the layout).
export default function GlassTabBar({ state, descriptors, navigateToTab, insets }) {
  const colors = useColors();
  const scheme = useScheme();
  const styles = useStyles(createStyles);
  const sheen = `sheen${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: Math.max(insets.bottom, 14) }]}
    >
      <View style={styles.pill}>
        <BlurView
          intensity={40}
          tint={scheme === "dark" ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        {/* The light of the glass: it fades from the top, and the line at the top stops before
            the corners, so no border has to change color there */}
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id={sheen} x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0"
                stopColor="#ffffff"
                stopOpacity={scheme === "dark" ? 0.16 : 0.6}
              />
              <Stop offset="0.65" stopColor="#ffffff" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${sheen})`} />
        </Svg>
        <View pointerEvents="none" style={styles.highlight} />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? colors.tertiary : colors.secondary;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigateToTab(route.key)}
              style={styles.item}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
            >
              {options.tabBarIcon?.({ color, focused })}
              <Text style={[styles.label, { color }]}>
                {options.title ?? route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    //Floats over the screens, the margins keep it away from the edges
    wrap: {
      position: "absolute",
      left: 18,
      right: 18,
    },

    pill: {
      ...glassCard(colors),
      //One color all around: with such round corners a brighter top edge shows a cut at the corners
      borderTopColor: colors.glassBorder,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 30,
      paddingVertical: 6,
      overflow: "hidden",
    },

    highlight: {
      position: "absolute",
      top: 0,
      left: 26,
      right: 26,
      height: 1,
      backgroundColor: colors.glassHighlight,
    },

    item: {
      flex: 1,
      alignItems: "center",
      gap: 2,
      paddingVertical: 4,
    },

    label: {
      fontSize: 11,
    },
  });
