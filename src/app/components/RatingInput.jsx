import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { useColors, useStyles, glassCard } from "../../theme";
import { useT } from "../../i18n";
import { useRatings } from "../../data/RatingsContext";
import RatingSummary from "./RatingSummary";

//The vote of the person on a workout: tapping a star votes, tapping the same star again
//removes the vote
export default function RatingInput({ workoutId }) {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
  const { myVotes, available, rate } = useRatings();
  const [error, setError] = useState(false);
  const mine = myVotes[workoutId] ?? null;

  async function vote(stars) {
    setError(false);
    try {
      await rate(workoutId, stars === mine ? null : stars);
    } catch {
      setError(true);
    }
  }

  if (!available) return null;

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{t("ratings.yourVote")}</Text>
        <RatingSummary workoutId={workoutId} />
      </View>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => vote(n)} hitSlop={6}>
            <Star
              size={34}
              color={colors.star}
              fill={mine !== null && n <= mine ? colors.star : "transparent"}
            />
          </Pressable>
        ))}
      </View>
      {error && <Text style={styles.error}>{t("ratings.error")}</Text>}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      ...glassCard(colors),
      padding: 16,
      gap: 12,
      borderRadius: 18,
    },

    title: {
      color: colors.secondary,
      fontSize: 16,
      fontWeight: "600",
    },

    stars: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    error: {
      color: colors.tertiary,
      fontSize: 13,
    },
  });
