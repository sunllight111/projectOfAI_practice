import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Iconify } from "../components/Iconify";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer
} from "expo-audio";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TranslationKey, useLanguage } from "../i18n/language";

const RAIN_SOUND = require("../../assets/audio/rain-3s.wav");

type ToolItem = {
  accent: string;
  badgeKey?: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string; // Ionicons name or Iconify prefix:name, e.g. "mdi:home"
  titleKey: TranslationKey;
};

type ToolSection = {
  id: string;
  subtitleKey: TranslationKey;
  titleKey: TranslationKey;
  tools: ToolItem[];
};

type OverviewMetric = {
  background: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: TranslationKey;
  value: string;
};

const OVERVIEW_METRICS: OverviewMetric[] = [
  {
    background: "#ECFDF5",
    color: "#16A34A",
    icon: "analytics-outline",
    labelKey: "tool.overview.mastery",
    value: "72%"
  },
  {
    background: "#EFF6FF",
    color: "#2563EB",
    icon: "create-outline",
    labelKey: "tool.overview.todayPractice",
    value: "18"
  },
  {
    background: "#ECFEFF",
    color: "#0891B2",
    icon: "desktop-outline",
    labelKey: "tool.overview.simulations",
    value: "2"
  },
  {
    background: "#FFF7ED",
    color: "#EA580C",
    icon: "alert-circle-outline",
    labelKey: "tool.overview.review",
    value: "4"
  }
];

const TOOL_SECTIONS: ToolSection[] = [
  {
    id: "process",
    titleKey: "tool.sections.process.title",
    subtitleKey: "tool.sections.process.subtitle",
    tools: [
      {
        accent: "#2563EB",
        descriptionKey: "tool.items.parameter.description",
        icon: "tabler:list-search",
        titleKey: "tool.items.parameter.title"
      },
      {
        accent: "#D4A574",
        descriptionKey: "tool.items.material.description",
        icon: "fa-solid:balance-scale-right",
        titleKey: "tool.items.material.title"
      },
      {
        accent: "#16A34A",
        descriptionKey: "tool.items.kpi.description",
        icon: "stats-chart-outline",
        titleKey: "tool.items.kpi.title"
      },
      {
        accent: "#DC2626",
        descriptionKey: "tool.items.startup.description",
        icon: "emojione-monotone:factory",
        titleKey: "tool.items.startup.title"
      },
      // {
      //   accent: "#0891B2",
      //   descriptionKey: "tool.items.monitor.description",
      //   icon: "cloud-done-outline",
      //   titleKey: "tool.items.monitor.title"
      // },
      {
        accent: "#7C3AED",
        descriptionKey: "tool.items.conversion.description",
        icon: "mingcute:mind-map-line",
        titleKey: "tool.items.conversion.title"
      }
    ]
  },
  {
    id: "training",
    titleKey: "tool.sections.training.title",
    subtitleKey: "tool.sections.training.subtitle",
    tools: [
      {
        accent: "#FF4400",
        descriptionKey: "tool.items.quiz.description",
        icon: "game-icons:bookmarklet",
        titleKey: "tool.items.quiz.title"
      },
      {
        accent: "#0891B2",
        descriptionKey: "tool.items.simulation.description",
        icon: "mdi:monitor-dashboard",
        titleKey: "tool.items.simulation.title"
      }
    ]
  }
];

export function ToolScreen() {
  const rainPlayer = useAudioPlayer(RAIN_SOUND, {
    downloadFirst: true,
    keepAudioSessionActive: true
  });
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { language, t, toggleLanguage } = useLanguage();
  const nextLanguage = language === "zh" ? "en" : "zh";
  const [showTopTabbar, setShowTopTabbar] = useState(false);
  const [vibrationFeedback, setVibrationFeedback] = useState(false);
  const dangerPulse = useRef(new Animated.Value(0)).current;

  const playRainSound = async () => {
    await setIsAudioActiveAsync(true);
    await setAudioModeAsync({
      allowsRecording: false,
      interruptionMode: "mixWithOthers",
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false
    });
    await rainPlayer.seekTo(0);
    rainPlayer.play();
  };

  const vibratePhone = () => {
    Vibration.vibrate(Platform.OS === "ios" ? 400 : 500);
    setVibrationFeedback(true);
    dangerPulse.setValue(0);
    Animated.sequence([
      Animated.timing(dangerPulse, {
        duration: 220,
        toValue: 1,
        useNativeDriver: true
      }),
      Animated.timing(dangerPulse, {
        duration: 680,
        toValue: 0,
        useNativeDriver: true
      })
    ]).start(() => setVibrationFeedback(false));
  };

  const dangerWashOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.18, 0.55, 1],
    outputRange: [0, 0.28, 0.16, 0]
  });
  const dangerFrameOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.16, 0.65, 1],
    outputRange: [0, 0.92, 0.5, 0]
  });
  const dangerFrameScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.985, 1.035]
  });
  const dangerRippleOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.16, 0.62, 1],
    outputRange: [0, 0.74, 0.24, 0]
  });
  const dangerRippleScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1.18]
  });
  const dangerWideRippleOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.26, 0.72, 1],
    outputRange: [0, 0.46, 0.18, 0]
  });
  const dangerWideRippleScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.32]
  });
  const dangerLiquidOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.14, 0.58, 1],
    outputRange: [0, 0.76, 0.36, 0]
  });
  const dangerLiquidScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1.08]
  });
  const dangerLiquidDrift = dangerPulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-34, 18, 38]
  });
  const dangerTopWaveY = dangerPulse.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [-82, 18, 6]
  });
  const dangerBottomWaveY = dangerPulse.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [82, -18, -6]
  });
  const dangerLeftWaveX = dangerPulse.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [-78, 16, 4]
  });
  const dangerRightWaveX = dangerPulse.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [78, -16, -4]
  });
  const dangerAlarmOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.12, 0.72, 1],
    outputRange: [0, 1, 0.86, 0]
  });
  const dangerAlarmScale = dangerPulse.interpolate({
    inputRange: [0, 0.18, 1],
    outputRange: [0.9, 1.04, 0.98]
  });
  const dangerAlarmY = dangerPulse.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [-18, 0, -4]
  });
  const dangerHaloOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.2, 0.66, 1],
    outputRange: [0, 0.72, 0.24, 0]
  });
  const dangerHaloScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1.42]
  });
  const dangerHaloWideOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.28, 0.76, 1],
    outputRange: [0, 0.46, 0.16, 0]
  });
  const dangerHaloWideScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.76]
  });
  const dangerEdgeOpacity = dangerPulse.interpolate({
    inputRange: [0, 0.12, 0.48, 1],
    outputRange: [0, 0.55, 0.28, 0]
  });
  const dangerHorizontalScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 1]
  });
  const dangerVerticalScale = dangerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });

  return (
    <View style={styles.screen}>
      <View style={styles.topWash} />
      <View style={styles.accentRail} />
      <View style={styles.softMiddleWash} />
      <View style={styles.softProcessWash} />
      <View style={styles.softTrainingWash} />
      {showTopTabbar ? (
        <View
          style={[
            styles.floatingTopBar,
            {
              height: insets.top + 58,
              paddingTop: insets.top
            }
          ]}
        >
          <View style={styles.floatingTopContent}>
            <Text numberOfLines={1} style={styles.floatingTitle}>
              {t("tabs.workbench")}
            </Text>
            <View style={styles.floatingTabs}>
              <Text numberOfLines={1} style={styles.floatingTab}>
                {"\u5de5\u827a"}
              </Text>
              <Text numberOfLines={1} style={styles.floatingTab}>
                {"\u57f9\u8bad"}
              </Text>
              <Text numberOfLines={1} style={styles.floatingTab}>
                {"\u6f14\u7ec3"}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const shouldShow = nativeEvent.contentOffset.y > insets.top + 18;
          setShowTopTabbar((current) =>
            current === shouldShow ? current : shouldShow
          );
        }}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 18,
            paddingBottom: Math.max(tabBarHeight + insets.bottom + 24, 100)
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              numberOfLines={1}
              style={styles.eyebrow}
            >
              Process Console
            </Text>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.68}
              numberOfLines={1}
              style={styles.title}
            >
              {t("tool.title")}
            </Text>
          </View>
        </View>

        <View style={styles.overviewPanel}>
          <View style={styles.overviewPanelTop}>
            <View style={styles.overviewMainCopy}>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.68}
                numberOfLines={1}
                style={styles.overviewTitle}
              >
                {t("tool.overview.title")}
              </Text>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                numberOfLines={1}
                style={styles.overviewSubtitle}
              >
                {t("tool.overview.subtitle")}
              </Text>
            </View>
            <View style={styles.overviewStatusPill}>
              <Ionicons name="sparkles-outline" size={14} color="#2563EB" />
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                numberOfLines={1}
                style={styles.overviewStatusText}
              >
                {t("tool.overview.status")}
              </Text>
            </View>
          </View>

          <View style={styles.overviewProgressHeader}>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.72}
              numberOfLines={1}
              style={styles.overviewProgressLabel}
            >
              {t("tool.overview.progressLabel")}
            </Text>
            <Text style={styles.overviewProgressValue}>72%</Text>
          </View>

          <View style={styles.overviewProgressTrack}>
            <View style={styles.overviewProgressFill} />
          </View>

          <View style={styles.overviewMetricsGrid}>
            {OVERVIEW_METRICS.map((metric) => (
              <View key={metric.labelKey} style={styles.overviewMetricItem}>
                <View style={styles.overviewMetricLeft}>
                  <View
                    style={[
                      styles.overviewMetricIcon,
                      { backgroundColor: metric.background }
                    ]}
                  >
                    <Ionicons
                      name={metric.icon}
                      size={16}
                      color={metric.color}
                    />
                  </View>
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.68}
                    numberOfLines={1}
                    style={styles.overviewMetricLabel}
                  >
                    {t(metric.labelKey)}
                  </Text>
                </View>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.68}
                  numberOfLines={1}
                  style={styles.overviewMetricValue}
                >
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.overviewFocusRow}>
            <View style={styles.overviewFocusItem}>
              <Text style={styles.overviewFocusLabel}>
                {t("tool.overview.focusLabel")}
              </Text>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                numberOfLines={1}
                style={styles.overviewFocusValue}
              >
                {t("tool.overview.focusValue")}
              </Text>
            </View>
            <View style={styles.overviewFocusItem}>
              <Text style={styles.overviewFocusLabel}>
                {t("tool.overview.nextLabel")}
              </Text>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                numberOfLines={1}
                style={styles.overviewFocusValue}
              >
                {t("tool.overview.nextValue")}
              </Text>
            </View>
          </View>
        </View>

        {TOOL_SECTIONS.map((section, index) => (
          <View
            key={section.id}
            style={[styles.section, index === 0 && styles.firstSection]}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.68}
                  numberOfLines={1}
                  style={styles.sectionTitle}
                >
                  {t(section.titleKey)}
                </Text>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                  numberOfLines={1}
                  style={styles.sectionSubtitle}
                >
                  {t(section.subtitleKey)}
                </Text>
              </View>
            </View>

            <View style={styles.toolGrid}>
              {section.tools.map((tool) => (
                <ToolCard key={tool.titleKey} tool={tool} />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.demoSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionCopy}>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.68}
                numberOfLines={1}
                style={styles.sectionTitle}
              >
                {t("tool.demo.title")}
              </Text>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                numberOfLines={1}
                style={styles.sectionSubtitle}
              >
                {t("tool.demo.subtitle")}
              </Text>
            </View>
          </View>

          <View style={styles.demoButtonRow}>
            <Pressable
              accessibilityRole="button"
              onPress={playRainSound}
              style={({ pressed }) => [
                styles.demoButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Ionicons name="volume-high-outline" size={20} color="#2563EB" />
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.68}
                numberOfLines={1}
                style={styles.demoButtonText}
              >
                {t("ai.audio")}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={vibratePhone}
              style={({ pressed }) => [
                styles.demoButton,
                vibrationFeedback && styles.vibrationFeedback,
                pressed && styles.buttonPressed
              ]}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color="#2563EB"
              />
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.68}
                numberOfLines={1}
                style={styles.demoButtonText}
              >
                {t("ai.vibrate")}
              </Text>
            </Pressable>
          </View>

          {/* <View style={styles.iconRow}>
            <View style={styles.iconDemo}>
              <Iconify icon="mdi:emoticon-happy-outline" size={28} color="f97316" />
            </View>
            <View style={styles.iconDemo}>
              <Iconify icon="mdi:rocket-launch-outline" size={28} color="7c3aed" />
            </View>
            <View style={styles.iconDemo}>
              <Iconify icon="mdi:palette-outline" size={28} color="06b6d4" />
            </View>
            <View style={styles.iconDemo}>
              <Iconify icon="material-symbols:10k" size={28} color="f97316" />
            </View>
            <View style={styles.iconDemo}>
              <Iconify icon="solar:accumulator-outline" size={28} color="f97316" />
            </View>
            <View style={styles.iconDemo}>
              <Iconify icon="mingcute:mind-map-line" size={28} color="7C3AED" />
            </View>
          </View> */}

          <Pressable
            accessibilityRole="button"
            onPress={toggleLanguage}
            style={({ pressed }) => [
              styles.languageButton,
              pressed && styles.buttonPressed
            ]}
          >
            <View style={styles.languageCopy}>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.68}
                numberOfLines={1}
                style={styles.languageButtonText}
              >
                {t("ai.language.current")}: {t(`language.${language}`)}
              </Text>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.68}
                numberOfLines={1}
                style={styles.languageButtonSubtext}
              >
                {t("ai.language.switchTo")}: {t(`language.${nextLanguage}`)}
              </Text>
            </View>
            <Ionicons name="language-outline" size={22} color="#2563EB" />
          </Pressable>
        </View>
      </ScrollView>
      {vibrationFeedback ? (
        <Animated.View pointerEvents="none" style={styles.dangerOverlay}>
          <Animated.View
            style={[
              styles.dangerWash,
              {
                opacity: dangerWashOpacity
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerLiquidWave,
              styles.dangerLiquidWaveTop,
              {
                opacity: dangerLiquidOpacity,
                transform: [
                  { translateY: dangerTopWaveY },
                  { translateX: dangerLiquidDrift },
                  { scaleX: dangerLiquidScale }
                ]
              }
            ]}
          >
            <View style={[styles.dangerWaveLobe, styles.dangerWaveLobeLarge]} />
            <View style={[styles.dangerWaveLobe, styles.dangerWaveLobeMid]} />
            <View style={[styles.dangerWaveLobe, styles.dangerWaveLobeSmall]} />
          </Animated.View>
          <Animated.View
            style={[
              styles.dangerLiquidWave,
              styles.dangerLiquidWaveBottom,
              {
                opacity: dangerLiquidOpacity,
                transform: [
                  { translateY: dangerBottomWaveY },
                  { translateX: dangerLiquidDrift },
                  { scaleX: dangerLiquidScale }
                ]
              }
            ]}
          >
            <View style={[styles.dangerWaveLobe, styles.dangerWaveLobeLarge]} />
            <View style={[styles.dangerWaveLobe, styles.dangerWaveLobeMid]} />
            <View style={[styles.dangerWaveLobe, styles.dangerWaveLobeSmall]} />
          </Animated.View>
          <Animated.View
            style={[
              styles.dangerLiquidSide,
              styles.dangerLiquidSideLeft,
              {
                opacity: dangerLiquidOpacity,
                transform: [
                  { translateX: dangerLeftWaveX },
                  { scaleY: dangerLiquidScale }
                ]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerLiquidSide,
              styles.dangerLiquidSideRight,
              {
                opacity: dangerLiquidOpacity,
                transform: [
                  { translateX: dangerRightWaveX },
                  { scaleY: dangerLiquidScale }
                ]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerAlarmWrap,
              {
                top: insets.top + 72,
                opacity: dangerAlarmOpacity,
                transform: [
                  { translateY: dangerAlarmY },
                  { scale: dangerAlarmScale }
                ]
              }
            ]}
          >
            <Animated.View
              style={[
                styles.dangerAlarmHalo,
                styles.dangerAlarmHaloWide,
                {
                  opacity: dangerHaloWideOpacity,
                  transform: [{ scale: dangerHaloWideScale }]
                }
              ]}
            />
            <Animated.View
              style={[
                styles.dangerAlarmHalo,
                {
                  opacity: dangerHaloOpacity,
                  transform: [{ scale: dangerHaloScale }]
                }
              ]}
            />
            <View style={styles.dangerAlarmPanel}>
              <View style={styles.dangerAlarmIcon}>
                <Ionicons name="warning" size={23} color="#FFFFFF" />
              </View>
              <View style={styles.dangerAlarmCopy}>
                <Text style={styles.dangerAlarmTitle}>
                  {"\u5371\u9669\u8b66\u62a5"}
                </Text>
                <Text style={styles.dangerAlarmText}>
                  {"\u8bf7\u6ce8\u610f\u5f53\u524d\u72b6\u6001"}
                </Text>
              </View>
              <View style={styles.dangerAlarmSignal}>
                <View style={styles.dangerSignalDot} />
                <View style={styles.dangerSignalBar} />
              </View>
            </View>
          </Animated.View>
          <Animated.View
            style={[
              styles.dangerRipple,
              styles.dangerRippleWide,
              {
                opacity: dangerWideRippleOpacity,
                transform: [{ scale: dangerWideRippleScale }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerRipple,
              styles.dangerRippleTight,
              {
                opacity: dangerRippleOpacity,
                transform: [{ scale: dangerRippleScale }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerFrame,
              {
                opacity: dangerFrameOpacity,
                transform: [{ scale: dangerFrameScale }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerEdge,
              styles.dangerEdgeTop,
              {
                opacity: dangerEdgeOpacity,
                transform: [{ scaleX: dangerHorizontalScale }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerEdge,
              styles.dangerEdgeBottom,
              {
                opacity: dangerEdgeOpacity,
                transform: [{ scaleX: dangerHorizontalScale }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerEdgeSide,
              styles.dangerEdgeLeft,
              {
                opacity: dangerEdgeOpacity,
                transform: [{ scaleY: dangerVerticalScale }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.dangerEdgeSide,
              styles.dangerEdgeRight,
              {
                opacity: dangerEdgeOpacity,
                transform: [{ scaleY: dangerVerticalScale }]
              }
            ]}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

function ToolCard({ tool }: { tool: ToolItem }) {
  const { t } = useLanguage();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.toolCard,
        pressed && styles.toolCardPressed
      ]}
    >
      <View style={styles.toolTop}>
        <View style={[styles.toolIcon, { backgroundColor: `${tool.accent}14` }]}>
          {tool.icon.includes(":")
            ? <Iconify icon={tool.icon} size={25} color={tool.accent.replace("#", "")} />
            : <Ionicons name={tool.icon as keyof typeof Ionicons.glyphMap} size={25} color={tool.accent} />
          }
        </View>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.68}
          numberOfLines={1}
          style={styles.toolTitle}
        >
          {t(tool.titleKey)}
        </Text>
      </View>
      {tool.badgeKey ? (
        <View style={styles.badge}>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            numberOfLines={1}
            style={styles.badgeText}
          >
            {t(tool.badgeKey)}
          </Text>
        </View>
      ) : null}
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        numberOfLines={2}
        style={styles.toolDescription}
      >
        {t(tool.descriptionKey)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F4F8FB",
    flex: 1,
    position: "relative"
  },
  topWash: {
    backgroundColor: "#EAF4FF",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    height: 178,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  accentRail: {
    backgroundColor: "rgba(22, 119, 255, 0.08)",
    borderRadius: 999,
    height: 118,
    position: "absolute",
    right: -44,
    top: 88,
    transform: [{ rotate: "-18deg" }],
    width: 190
  },
  softMiddleWash: {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: 999,
    height: 104,
    position: "absolute",
    right: 18,
    top: 248,
    width: 156
  },
  softProcessWash: {
    backgroundColor: "rgba(22, 119, 255, 0.026)",
    borderRadius: 999,
    height: 132,
    left: -34,
    position: "absolute",
    top: 424,
    width: 188
  },
  softTrainingWash: {
    backgroundColor: "rgba(8, 145, 178, 0.024)",
    borderRadius: 999,
    height: 126,
    position: "absolute",
    right: -42,
    top: 644,
    width: 196
  },
  dangerOverlay: {
    ...StyleSheet.absoluteFillObject,
    elevation: 999,
    overflow: "hidden",
    zIndex: 999
  },
  dangerWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(220, 38, 38, 0.42)"
  },
  dangerLiquidWave: {
    backgroundColor: "rgba(220, 38, 38, 0.46)",
    height: 168,
    left: -54,
    overflow: "hidden",
    position: "absolute",
    right: -54
  },
  dangerLiquidWaveTop: {
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    top: -126
  },
  dangerLiquidWaveBottom: {
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    bottom: -126
  },
  dangerWaveLobe: {
    backgroundColor: "rgba(254, 202, 202, 0.32)",
    borderRadius: 999,
    position: "absolute"
  },
  dangerWaveLobeLarge: {
    bottom: -18,
    height: 112,
    left: 18,
    width: 170
  },
  dangerWaveLobeMid: {
    bottom: -30,
    height: 138,
    left: "38%",
    width: 210
  },
  dangerWaveLobeSmall: {
    bottom: -12,
    height: 92,
    right: 26,
    width: 142
  },
  dangerLiquidSide: {
    backgroundColor: "rgba(248, 113, 113, 0.38)",
    borderRadius: 999,
    bottom: 88,
    position: "absolute",
    top: 88,
    width: 118
  },
  dangerLiquidSideLeft: {
    left: -96
  },
  dangerLiquidSideRight: {
    right: -96
  },
  dangerAlarmWrap: {
    alignItems: "center",
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 2
  },
  dangerAlarmHalo: {
    backgroundColor: "rgba(248, 113, 113, 0.18)",
    borderColor: "rgba(254, 202, 202, 0.62)",
    borderRadius: 999,
    borderWidth: 2,
    height: 112,
    position: "absolute",
    top: -24,
    width: 112
  },
  dangerAlarmHaloWide: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderColor: "rgba(248, 113, 113, 0.42)",
    height: 148,
    top: -42,
    width: 148
  },
  dangerAlarmPanel: {
    alignItems: "center",
    backgroundColor: "#DC2626",
    borderColor: "rgba(254, 226, 226, 0.92)",
    borderRadius: 8,
    borderWidth: 1,
    elevation: 12,
    flexDirection: "row",
    gap: 10,
    minHeight: 64,
    minWidth: 238,
    overflow: "hidden",
    paddingLeft: 10,
    paddingRight: 12,
    shadowColor: "#7F1D1D",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18
  },
  dangerAlarmIcon: {
    alignItems: "center",
    backgroundColor: "#991B1B",
    borderColor: "rgba(254, 226, 226, 0.45)",
    borderRadius: 999,
    borderWidth: 2,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  dangerAlarmCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0
  },
  dangerAlarmTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22
  },
  dangerAlarmText: {
    color: "#FEE2E2",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 16
  },
  dangerAlarmSignal: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#F97316",
    justifyContent: "center",
    marginRight: -12,
    paddingHorizontal: 10
  },
  dangerSignalDot: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 6,
    marginBottom: 5,
    width: 6
  },
  dangerSignalBar: {
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    borderRadius: 999,
    height: 20,
    width: 5
  },
  dangerRipple: {
    borderColor: "rgba(254, 202, 202, 0.62)",
    borderRadius: 28,
    borderWidth: 2,
    bottom: 18,
    left: 14,
    position: "absolute",
    right: 14,
    top: 18
  },
  dangerRippleWide: {
    borderColor: "rgba(220, 38, 38, 0.34)",
    borderWidth: 4,
    bottom: 28,
    left: 24,
    right: 24,
    top: 28
  },
  dangerRippleTight: {
    borderColor: "rgba(254, 202, 202, 0.58)",
    borderWidth: 2
  },
  dangerFrame: {
    ...StyleSheet.absoluteFillObject,
    borderColor: "rgba(185, 28, 28, 0.52)",
    borderRadius: 14,
    borderWidth: 2,
    margin: 7
  },
  dangerEdge: {
    backgroundColor: "rgba(239, 68, 68, 0.92)",
    height: 12,
    left: 10,
    position: "absolute",
    right: 10,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12
  },
  dangerEdgeTop: {
    top: 0
  },
  dangerEdgeBottom: {
    bottom: 0
  },
  dangerEdgeSide: {
    backgroundColor: "rgba(239, 68, 68, 0.92)",
    bottom: 10,
    position: "absolute",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    top: 10,
    width: 12
  },
  dangerEdgeLeft: {
    left: 0
  },
  dangerEdgeRight: {
    right: 0
  },
  floatingTopBar: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 10,
    left: 0,
    position: "absolute",
    right: 0,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    top: 0,
    zIndex: 20
  },
  floatingTopContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 18
  },
  floatingTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
  },
  floatingTabs: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end"
  },
  floatingTab: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    paddingHorizontal: 4
  },
  content: {
    paddingHorizontal: 16
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  eyebrow: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 2,
    maxWidth: "100%"
  },
  overviewPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E6EEF7",
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    marginTop: 14,
    overflow: "hidden",
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18
  },
  overviewPanelTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  overviewMainCopy: {
    flex: 1,
    minWidth: 0
  },
  overviewTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 23
  },
  overviewSubtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 17,
    marginTop: 3
  },
  overviewStatusPill: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    flexDirection: "row",
    flexShrink: 0,
    gap: 4,
    maxWidth: 128,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  overviewStatusText: {
    color: "#2563EB",
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0
  },
  overviewProgressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14
  },
  overviewProgressLabel: {
    color: "#475569",
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  },
  overviewProgressValue: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0
  },
  overviewProgressTrack: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 8,
    marginTop: 7,
    overflow: "hidden"
  },
  overviewProgressFill: {
    backgroundColor: "#2563EB",
    borderRadius: 999,
    height: "100%",
    width: "72%"
  },
  overviewMetricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 12
  },
  overviewMetricItem: {
    alignItems: "center",
    backgroundColor: "#F9FBFD",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    minWidth: 0,
    paddingHorizontal: 11,
    paddingVertical: 8,
    width: "48.5%"
  },
  overviewMetricLeft: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 7,
    minWidth: 0
  },
  overviewMetricIcon: {
    alignItems: "center",
    borderRadius: 8,
    flexShrink: 0,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  overviewMetricValue: {
    color: "#0F172A",
    flexShrink: 0,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22,
    marginLeft: 8,
    minWidth: 34,
    textAlign: "right"
  },
  overviewMetricLabel: {
    color: "#64748B",
    flex: 1,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 13,
    minWidth: 0
  },
  overviewFocusRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  overviewFocusItem: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  overviewFocusLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 13
  },
  overviewFocusValue: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 16,
    marginTop: 2
  },
  section: {
    marginTop: 18
  },
  firstSection: {
    marginTop: 14
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  sectionCopy: {
    flex: 1,
    minWidth: 0
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
    maxWidth: "100%"
  },
  sectionSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 2,
    maxWidth: "100%"
  },
  toolGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  toolCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF2F7",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 100,
    paddingBottom: 11,
    paddingHorizontal: 12,
    paddingTop: 12,
    position: "relative",
    width: "48.5%"
  },
  toolCardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }]
  },
  toolTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9
  },
  toolIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  badge: {
    backgroundColor: "#FEF2F2",
    borderRadius: 999,
    position: "absolute",
    right: 10,
    top: 10,
    paddingHorizontal: 7,
    paddingVertical: 3
  },
  badgeText: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    maxWidth: 36
  },
  toolTitle: {
    color: "#0F172A",
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    maxWidth: "100%",
    paddingRight: 26
  },
  toolDescription: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 17,
    marginTop: 8,
    maxWidth: "100%"
  },
  demoSection: {
    marginTop: 18
  },
  demoButtonRow: {
    flexDirection: "row",
    gap: 10
  },
  demoButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 10
  },
  demoButtonText: {
    color: "#0F172A",
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0
  },
  buttonPressed: {
    opacity: 0.75
  },
  vibrationFeedback: {
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626"
  },
  languageButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 10,
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  languageCopy: {
    flex: 1,
    minWidth: 0
  },
  languageButtonText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0
  },
  languageButtonSubtext: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 3
  },
  iconRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 10
  },
  iconDemo: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  iconPickerSection: {
    marginBottom: 10
  },
  iconPickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  iconPickerCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF2F7",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: "18.7%"
  },
  iconPickerRing: {
    alignItems: "center",
    borderColor: "#E2E8F0",
    borderRadius: 999,
    borderWidth: 1.5,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  iconPickerLabel: {
    color: "#0F172A",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0,
    maxWidth: 56,
    textAlign: "center"
  },
  iconPickerName: {
    color: "#94A3B8",
    fontSize: 7,
    fontWeight: "600",
    letterSpacing: 0,
    maxWidth: 56,
    textAlign: "center"
  }
});
