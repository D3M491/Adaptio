import {
  View,
  Text,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { useStyles, useScheme, glassCard } from "../../theme";
import { useT } from "../../i18n";

//Styled replacement for Alert.alert with a cancel and a confirm button,
//children (e.g. an input) are shown between the message and the buttons.
//Without confirmText and cancelText the buttons say "Confirm" and "Cancel" in the current language
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  children,
}) {
  const styles = useStyles(createStyles);
  const scheme = useScheme();
  const t = useT();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* Moves the card up when the keyboard opens */}
      <KeyboardAvoidingView
        style={styles.avoider}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Tapping outside the card closes the dialog */}
        <Pressable style={styles.backdrop} onPress={onCancel}>
          {/* The app behind the dialog is blurred */}
          <BlurView
            intensity={30}
            tint={scheme === "dark" ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <Pressable style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            {children}

            <View style={styles.buttons}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.button,
                  styles.cancel,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.cancelText}>
                  {cancelText ?? t("common.cancel")}
                </Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                style={({ pressed }) => [
                  styles.button,
                  styles.confirm,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.confirmText}>
                  {confirmText ?? t("common.confirm")}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    avoider: {
      flex: 1,
    },

    backdrop: {
      flex: 1,
      justifyContent: "center",
      padding: 30,
      backgroundColor: "#00000066",
    },

    card: {
      ...glassCard(colors),
      padding: 24,
      gap: 8,
      borderRadius: 22,
    },

    title: {
      color: colors.secondary,
      fontSize: 20,
      fontWeight: "700",
    },

    message: {
      color: colors.secondaryDark,
      fontSize: 15,
    },

    buttons: {
      flexDirection: "row",
      gap: 10,
      marginTop: 16,
    },

    button: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 14,
      borderRadius: 14,
    },

    cancel: {
      borderWidth: 1,
      borderColor: colors.secondaryDark,
    },

    confirm: {
      backgroundColor: colors.tertiary,
    },

    pressed: {
      opacity: 0.7,
    },

    cancelText: {
      color: colors.secondary,
      fontWeight: "600",
    },

    confirmText: {
      color: colors.onTertiary,
      fontWeight: "700",
    },
  });
