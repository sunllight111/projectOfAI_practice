import { useAudioPlayer } from "expo-audio";
import React from "react";
import { Pressable, StyleSheet, Text, Vibration, View } from "react-native";

import { useLanguage } from "../i18n/language";

const RAIN_SOUND = require("../../assets/audio/rain-3s.wav");

export function AiScreen() {
  const rainPlayer = useAudioPlayer(RAIN_SOUND);
  const { language, t, toggleLanguage } = useLanguage();
  const nextLanguage = language === "zh" ? "en" : "zh";

  const playRainSound = async () => {
    await rainPlayer.seekTo(0);
    rainPlayer.play();
  };

  const vibratePhone = () => {
    Vibration.vibrate(500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 2112133</Text>
      <View style={styles.buttonGroup}>
        <Pressable
          accessibilityRole="button"
          onPress={playRainSound}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>{t("ai.audio")}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={vibratePhone}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>{t("ai.vibrate")}</Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={toggleLanguage}
        style={({ pressed }) => [
          styles.languageButton,
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.languageButtonText}>
          {t("ai.language.current")}: {t(`language.${language}`)}
        </Text>
        <Text style={styles.languageButtonSubtext}>
          {t("ai.language.switchTo")}: {t(`language.${nextLanguage}`)}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 14,
    marginTop: 28
  },
  button: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 8,
    minWidth: 104,
    paddingHorizontal: 24,
    paddingVertical: 14
  },
  buttonPressed: {
    opacity: 0.75
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0
  },
  languageButton: {
    alignItems: "center",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 18,
    minWidth: 228,
    paddingHorizontal: 20,
    paddingVertical: 13
  },
  languageButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0
  },
  languageButtonSubtext: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 4
  }
});
