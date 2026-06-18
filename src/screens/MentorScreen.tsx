import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MentorChatSheet } from "../features/mentor/components/MentorChatSheet";
import { TranslationKey, useLanguage } from "../i18n/language";

const MENTOR_NATURAL_BLINK_GIF = require("../../assets/mentor/mentor-natural-blink.gif");

const FEATURE_CARDS: Array<{
  descriptionKey: TranslationKey;
  icon: keyof typeof Ionicons.glyphMap;
  key: "archive" | "chat" | "learning";
  titleKey: TranslationKey;
}> = [
  {
    descriptionKey: "tool.mentor.archiveDesc",
    icon: "newspaper-outline",
    key: "archive",
    titleKey: "tool.mentor.archive"
  },
  {
    descriptionKey: "tool.mentor.chatCardDesc",
    icon: "chatbubble-ellipses-outline",
    key: "chat",
    titleKey: "tool.mentor.chatCard"
  },
  {
    descriptionKey: "tool.mentor.learningDesc",
    icon: "stats-chart-outline",
    key: "learning",
    titleKey: "tool.mentor.learning"
  }
];

export function MentorScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { width, height } = useWindowDimensions();
  const { t } = useLanguage();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const availableHeight = height - insets.top - tabBarHeight - insets.bottom;
  const avatarHeight = Math.min(Math.max(availableHeight * 0.48, 286), 392);
  const mentorWidth = Math.min(
    Math.max(width * 0.52, 168),
    Math.max((avatarHeight - 10) * 0.5, 168),
    218
  );
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const handleFeaturePress = (key: (typeof FEATURE_CARDS)[number]["key"]) => {
    if (key === "chat") {
      openChat();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topWash} />
      <View style={styles.accentRail} />
      <View style={styles.industryLineLeft} />
      <View style={styles.industryLineRight} />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 6,
            paddingBottom: tabBarHeight + insets.bottom + 8
          }
        ]}
      >
        <View style={[styles.avatarArea, { height: avatarHeight }]}>
          <Pressable
            accessibilityLabel={t("tool.mentor.imageLabel")}
            accessibilityRole="button"
            onPress={openChat}
            style={({ pressed }) => [
              styles.avatarPressable,
              { width: mentorWidth },
              pressed && styles.pressed
            ]}
          >
            <Image
              resizeMode="contain"
              source={MENTOR_NATURAL_BLINK_GIF}
              style={styles.mentorGif}
            />
          </Pressable>
        </View>

        <View style={styles.featureArea}>
          {FEATURE_CARDS.map((card) => (
            <Pressable
              accessibilityRole="button"
              key={card.key}
              onPress={() => handleFeaturePress(card.key)}
              style={({ pressed }) => [
                styles.featureCard,
                pressed && styles.pressed
              ]}
            >
              <View style={styles.featureIcon}>
                <Ionicons name={card.icon} size={20} color="#2563EB" />
              </View>
              <View style={styles.featureCopy}>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                  numberOfLines={1}
                  style={styles.featureTitle}
                >
                  {t(card.titleKey)}
                </Text>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                  numberOfLines={1}
                  style={styles.featureDescription}
                >
                  {t(card.descriptionKey)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          ))}
        </View>
      </View>

      <MentorChatSheet
        closeLabel={t("tool.mentor.closeChat")}
        mentorMessage={t("tool.mentor.chatMentor")}
        onClose={closeChat}
        title={t("tool.mentor.chatTitle")}
        userMessage={t("tool.mentor.chatUser")}
        visible={isChatOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#EDF4FA",
    flex: 1,
    position: "relative"
  },
  topWash: {
    backgroundColor: "#E5F1FA",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    height: "48%",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  accentRail: {
    backgroundColor: "rgba(37, 99, 235, 0.06)",
    borderRadius: 999,
    height: 118,
    position: "absolute",
    right: -62,
    top: 74,
    transform: [{ rotate: "-18deg" }],
    width: 190
  },
  industryLineLeft: {
    backgroundColor: "rgba(148, 180, 210, 0.18)",
    bottom: "49%",
    height: 2,
    left: 18,
    position: "absolute",
    width: "24%"
  },
  industryLineRight: {
    backgroundColor: "rgba(148, 180, 210, 0.18)",
    bottom: "49%",
    height: 2,
    position: "absolute",
    right: 18,
    width: "24%"
  },
  content: {
    flex: 1,
    paddingHorizontal: 18
  },
  avatarArea: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 0
  },
  avatarPressable: {
    aspectRatio: 300 / 600
  },
  mentorGif: {
    height: "100%",
    width: "100%"
  },
  featureArea: {
    flex: 1,
    gap: 9,
    justifyContent: "flex-start",
    paddingTop: 16
  },
  featureCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E8F8",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18
  },
  featureIcon: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  featureCopy: {
    flex: 1,
    minWidth: 0
  },
  featureTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0
  },
  featureDescription: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 3
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }]
  }
});
