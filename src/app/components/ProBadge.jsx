import { View, Text, StyleSheet, Pressable } from "react-native";
import { Crown } from "lucide-react-native";
import { colors } from "../../theme";

//Bottone per provare il piano PRO
export default function ProBadge({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.badge}>
        <Crown size={16} color={colors.pro} fill={colors.pro} />
        <Text style={styles.badgeText}>PRO</Text>
      </View>
      <Text style={styles.trialText}>PROVA GRATIS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },

  pressed: {
    opacity: 0.7,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.pro,
    backgroundColor: colors.proLight,
    shadowColor: colors.pro,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  badgeText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  trialText: {
    color: colors.pro,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
