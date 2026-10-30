import {
  View,
  Text,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useStyles } from "../../theme";

//Styled replacement for Alert.alert with a cancel and a confirm button,
//children (e.g. an input) are shown between the message and the buttons
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Conferma",
  cancelText = "Annulla",
  onConfirm,
  onCancel,
  children,
}) {
  const styles = useStyles(createStyles);
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
                <Text style={styles.cancelText}>{cancelText}</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                style={({ pressed }) => [
                  styles.button,
                  styles.confirm,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.confirmText}>{confirmText}</Text>
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
      backgroundColor: "#000000b3",
    },

    card: {
      padding: 24,
      gap: 8,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.secondaryDark,
      backgroundColor: colors.primary,
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
