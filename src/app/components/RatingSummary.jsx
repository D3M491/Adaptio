import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { useColors, useStyles } from "../../theme";
import { useT, useLanguage, numberToText } from "../../i18n";
import { useRatings } from "../../data/RatingsContext";

//The average and the number of votes of a workout, e.g. "4,6 (128)"
export default function RatingSummary({ workoutId }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
  const { language } = useLanguage();
  const { summaries, available } = useRatings();
  const summary = summaries[workoutId];

  if (!available) return null;
  if (!summary) return <Text style={styles.none}>{t("ratings.none")}</Text>;

  return (
    <View style={styles.row}>
      <Star size={14} color={colors.star} fill={colors.star} />
      <Text style={styles.value}>
        {numberToText(summary.average.toFixed(1), language)}
      </Text>
      <Text style={styles.votes}>({summary.votes})</Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 6,
    },

    value: {
      color: colors.secondary,
      fontSize: 13,
      fontWeight: "700",
    },

    votes: {
      color: colors.secondaryDark,
      fontSize: 13,
    },

    none: {
      color: colors.secondaryDark,
      fontSize: 13,
      marginTop: 6,
    },
  });
