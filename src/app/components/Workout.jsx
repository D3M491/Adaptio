import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../../theme";

export default function Workout() {
  return (
    <View>
      <Text style={styles.sectionText}>WORKOUT</Text>
      <View style={styles.workoutPreview}>
        <Text style={styles.sectionText}>WORKOUT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionText: {
    color: colors.secondaryDark,
  },
  workoutPreview: {
    borderColor: colors.tertiary,
    borderWidth: 1,
    borderRadius: 2,
  },
});
