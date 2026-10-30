import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useColors, useStyles } from "../../theme";
import { useLanguage, numberToText, parseNumber } from "../../i18n";

//Number input that saves when the field loses focus, an invalid value is reverted.
//An empty value (null) is an empty field; the decimal separator follows the language
export default function NumberField({ value, onChange, unit, style }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const { language } = useLanguage();
  const toText = (number) => numberToText(number, language);
  const [text, setText] = useState(toText(value));

  //Keep the field in sync when the value is changed somewhere else
  useEffect(() => {
    setText(toText(value));
  }, [value, language]);

  function commit() {
    const parsed = parseNumber(text);
    if (text.trim() === "" || Number.isNaN(parsed)) {
      setText(toText(value));
    } else if (parsed !== value) {
      onChange(parsed);
    }
  }

  return (
    <View style={[styles.field, style]}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        onBlur={commit}
        onSubmitEditing={commit}
        keyboardType="decimal-pad"
        placeholder="—"
        placeholderTextColor={colors.secondaryDark}
        selectTextOnFocus
        selectionColor={colors.tertiary}
        cursorColor={colors.tertiary}
      />
      {unit && <Text style={styles.unit}>{unit}</Text>}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    field: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      backgroundColor: colors.primaryLight,
    },

    input: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 8,
      color: colors.secondary,
      fontSize: 16,
      textAlign: "right",
    },

    unit: {
      marginLeft: 4,
      color: colors.secondaryDark,
    },
  });
