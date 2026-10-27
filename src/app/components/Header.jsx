import { View } from "react-native";
import { Settings2 } from "lucide-react-native";
import { colors } from "../../theme";
import { StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Settings2
        style={styles.icon}
        color={`${colors.secondary}`}
        size="30"
      ></Settings2>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginLeft: "auto",
  },
});
