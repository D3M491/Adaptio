import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../../theme";

export default function Workout({ type }) {
  return type === "preview" ? (
    <View type={type}>
      <Text style={styles.sectionText}>WORKOUT</Text>
      <View style={styles.workoutPreview}></View>
    </View>
  ) : (
    <View type={type}>
      <Text style={styles.sectionText}>porcodiio</Text>
      <View style={styles.workoutPreview}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionText: {
    color: colors.secondaryDark,
    marginBottom: 10,
  },
  workoutPreview: {
    padding: 20,
    borderColor: colors.secondaryDark,
    borderWidth: 1,
    borderRadius: 14,
  },
});
