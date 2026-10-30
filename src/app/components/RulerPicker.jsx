import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useState, useRef } from "react";
import { useStyles } from "../../theme";
import { useLanguage, numberToText } from "../../i18n";

//Distance between two marks, and the height of the ruler
const TICK_WIDTH = 14;
const RULER_HEIGHT = 64;

//Shows a number with the decimal separator of the language, e.g. 79.5 -> "79,5" in Italian
function format(value, decimals, language) {
  return numberToText(decimals ? value.toFixed(decimals) : value, language);
}

//Horizontal ruler: scrolling it raises or lowers the value, shown big above the ruler
export default function RulerPicker({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  labelStep = 10,
}) {
  const styles = useStyles(createStyles);
  const { language } = useLanguage();
  const [width, setWidth] = useState(0);
  const scrollRef = useRef(null);
  const placed = useRef(false);

  const decimals = step < 1 ? 1 : 0;
  const count = Math.round((max - min) / step) + 1;

  function handleScroll(event) {
    //Before the ruler is placed on the starting value, the scroll events are not the user's
    if (!placed.current) return;

    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.max(
      0,
      Math.min(count - 1, Math.round(offset / TICK_WIDTH)),
    );
    //Rounded to avoid decimals like 70.50000000001
    const newValue = Math.round((min + index * step) * 10) / 10;

    if (newValue !== value) onChange(newValue);
  }

  //Starts with the ruler already on the current value
  function placeRuler(contentWidth) {
    if (placed.current || width === 0) return;
    //The content must be fully laid out, or the scroll is cut to a smaller offset
    if (contentWidth < count * TICK_WIDTH + width - TICK_WIDTH - 1) return;
    placed.current = true;

    const index = Math.round((value - min) / step);
    scrollRef.current?.scrollTo({ x: index * TICK_WIDTH, animated: false });
  }

  //A tall mark every 10, a medium one every 5, a short one for the rest.
//The number under a mark is shown every labelStep.
  const ticks = [];
  for (let i = 0; i < count; i++) {
    const tickValue = Math.round((min + i * step) * 10) / 10;
    const isMajor = tickValue % 10 === 0;
    const isMedium = tickValue % 5 === 0;

    ticks.push(
      <View key={i} style={styles.tick}>
        <View
          style={[
            styles.line,
            isMedium && styles.mediumLine,
            isMajor && styles.majorLine,
          ]}
        />
        {tickValue % labelStep === 0 && (
          <Text style={styles.label}>{tickValue}</Text>
        )}
      </View>,
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{format(value, decimals, language)}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>

      <View
        style={styles.ruler}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {width > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK_WIDTH}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onContentSizeChange={(contentWidth) => placeRuler(contentWidth)}
            contentContainerStyle={{
              paddingHorizontal: (width - TICK_WIDTH) / 2,
            }}
          >
            {ticks}
          </ScrollView>
        )}
        {/* Fixed mark in the center: the value under it is the selected one */}
        <View style={styles.marker} pointerEvents="none" />
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      alignSelf: "stretch",
      //The ruler goes edge to edge, ignoring the padding of the screen
      marginHorizontal: -20,
      alignItems: "center",
    },

    valueRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 28,
    },

    value: {
      color: colors.secondary,
      fontSize: 64,
      fontWeight: "700",
    },

    unit: {
      color: colors.secondaryDark,
      fontSize: 20,
      paddingBottom: 14,
    },

    ruler: {
      alignSelf: "stretch",
      height: RULER_HEIGHT + 24,
    },

    tick: {
      width: TICK_WIDTH,
      alignItems: "center",
      overflow: "visible",
    },

    line: {
      width: 2,
      height: 20,
      borderRadius: 1,
      backgroundColor: colors.secondaryDark,
    },

    mediumLine: {
      height: 32,
    },

    majorLine: {
      height: 44,
      backgroundColor: colors.secondary,
    },

    label: {
      position: "absolute",
      top: 50,
      width: 40,
      textAlign: "center",
      color: colors.secondaryDark,
      fontSize: 12,
    },

    marker: {
      position: "absolute",
      top: 0,
      left: "50%",
      marginLeft: -1.5,
      width: 3,
      height: 52,
      borderRadius: 2,
      backgroundColor: colors.tertiary,
    },
  });
