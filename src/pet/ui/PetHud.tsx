import React, { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "../../i18n/language";
import type { PetEvent, PetSnapshot } from "../engine/petTypes";

type PetHudProps = {
  dispatch: (event: PetEvent) => void;
  snapshot: PetSnapshot;
};

export const PetHud = memo(function PetHud({ dispatch, snapshot }: PetHudProps) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const bottomClearance = Math.max(tabBarHeight + insets.bottom + 22, 106);

  return (
    <View style={[styles.panel, { paddingBottom: bottomClearance }]}>
      <View style={styles.statsPanel}>
        <StatBar
          color="#F97316"
          icon="restaurant"
          label={t("pet.stats.hunger")}
          value={snapshot.stats.hunger}
        />
        <StatBar
          color="#14B8A6"
          icon="flash"
          label={t("pet.stats.energy")}
          value={snapshot.stats.energy}
        />
        <StatBar
          color="#E11D48"
          icon="heart"
          label={t("pet.stats.bond")}
          value={snapshot.stats.bond}
        />
      </View>

      <View style={styles.messagePanel}>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          numberOfLines={1}
          style={styles.moodLabel}
        >
          {t(snapshot.moodKey)}
        </Text>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={2}
          style={styles.messageText}
        >
          {t(snapshot.messageKey)}
        </Text>
      </View>

      <View style={styles.actions}>
        <ActionButton
          icon="nutrition"
          label={t("pet.actions.feed")}
          onPress={() => dispatch({ type: "feed" })}
        />
        <ActionButton
          icon="sparkles"
          label={t("pet.actions.play")}
          onPress={() => dispatch({ type: "play" })}
        />
        <ActionButton
          icon="moon"
          label={t("pet.actions.rest")}
          onPress={() => dispatch({ type: "rest" })}
        />
      </View>
    </View>
  );
});

function StatBar({
  color,
  icon,
  label,
  value
}: {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statRow}>
      <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={17} color={color} />
      </View>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.68}
        numberOfLines={1}
        style={styles.statLabel}
      >
        {label}
      </Text>
      <View style={styles.statTrack}>
        <View
          style={[
            styles.statFill,
            {
              backgroundColor: color,
              width: `${value}%`
            }
          ]}
        />
      </View>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        numberOfLines={1}
        style={styles.statValue}
      >
        {value}
      </Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.actionPressed
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color="#FFFFFF" />
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.68}
        numberOfLines={1}
        style={styles.actionText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#FFF7ED",
    borderTopColor: "rgba(254, 215, 170, 0.85)",
    borderTopWidth: 1,
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12
  },
  statsPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FED7AA",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 10
  },
  statRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    minHeight: 24
  },
  statIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 26,
    justifyContent: "center",
    width: 26
  },
  statLabel: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    width: 52
  },
  statTrack: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    flex: 1,
    height: 8,
    overflow: "hidden"
  },
  statFill: {
    borderRadius: 999,
    height: "100%"
  },
  statValue: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    maxWidth: 30,
    textAlign: "right",
    width: 30
  },
  messagePanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FED7AA",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 66,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  moodLabel: {
    color: "#C2410C",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0
  },
  messageText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 23,
    marginTop: 2
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#EA580C",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 54,
    minWidth: 0,
    paddingHorizontal: 6
  },
  actionPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }]
  },
  actionText: {
    color: "#FFFFFF",
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0
  }
});
