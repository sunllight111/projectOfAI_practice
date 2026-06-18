import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MentorChatSheetProps = {
  closeLabel: string;
  mentorMessage: string;
  onClose: () => void;
  title: string;
  userMessage: string;
  visible: boolean;
};

export function MentorChatSheet({
  closeLabel,
  mentorMessage,
  onClose,
  title,
  userMessage,
  visible
}: MentorChatSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                { paddingBottom: Math.max(insets.bottom + 18, 28) }
              ]}
            >
              <View style={styles.sheetHeader}>
                <View style={styles.sheetTitleRow}>
                  <View style={styles.sheetIcon}>
                    <Ionicons name="school-outline" size={20} color="#2563EB" />
                  </View>
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                    numberOfLines={1}
                    style={styles.sheetTitle}
                  >
                    {title}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel={closeLabel}
                  accessibilityRole="button"
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Ionicons name="close" size={20} color="#475569" />
                </Pressable>
              </View>

              <View style={styles.chatStack}>
                <View style={[styles.bubble, styles.userBubble]}>
                  <Text style={[styles.bubbleText, styles.userText]}>
                    {userMessage}
                  </Text>
                </View>
                <View style={[styles.bubble, styles.mentorBubble]}>
                  <Text style={styles.bubbleText}>{mentorMessage}</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(15, 23, 42, 0.24)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 18,
    paddingTop: 14
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sheetTitleRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minWidth: 0
  },
  sheetIcon: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  sheetTitle: {
    color: "#0F172A",
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  buttonPressed: {
    backgroundColor: "#F1F5F9"
  },
  chatStack: {
    gap: 10,
    paddingTop: 16
  },
  bubble: {
    borderRadius: 8,
    maxWidth: "86%",
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#2563EB"
  },
  mentorBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9"
  },
  bubbleText: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 20
  },
  userText: {
    color: "#FFFFFF"
  }
});

