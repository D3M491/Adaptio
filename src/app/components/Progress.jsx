import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme";
export default function Progress() {
  return (
    <View>
      <Text style={styles.sectionText}>PROGRESS</Text>
      <View style={styles.container}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionText: {
    color: colors.secondaryDark,
    marginBottom: 10,
  },
  container: {
    padding: 20,
    borderColor: colors.secondaryDark,
    borderWidth: 1,
    borderRadius: 14,
    width: "50%",
    height: 100,
  },
});
