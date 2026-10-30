import { View, Text, Image, StyleSheet } from "react-native";
import { useStyles } from "../../theme";
import { SOURCE_LABELS } from "../../data/workouts";

//Small label saying where a workout comes from: the Adaptio logo, or the text of the community
export default function SourceTag({ source }) {
  const styles = useStyles(createStyles);
  if (source === "adaptio") {
    return (
      <View style={[styles.tag, styles.adaptioTag]}>
        <Image
          source={require("../../../assets/images/logo-symbol.png")}
          accessibilityLabel={SOURCE_LABELS.adaptio}
          style={styles.logo}
        />
      </View>
    );
  }

  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{SOURCE_LABELS[source]}</Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    tag: {
      alignSelf: "flex-start",
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: colors.secondaryDark,
    },

    adaptioTag: {
      borderColor: colors.tertiary,
    },

    //The logo is 573 x 316
    logo: {
      width: 26,
      height: 26 * (316 / 573),
    },

    text: {
      color: colors.secondaryDark,
      fontSize: 11,
    },
  });
