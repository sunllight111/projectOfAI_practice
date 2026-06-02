import React, { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "../i18n/language";
import { usePetStateMachine } from "./engine/usePetStateMachine";
import { PetCanvas } from "./renderer/PetCanvas";
import { PetHud } from "./ui/PetHud";

export const VirtualPetModule = memo(function VirtualPetModule() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const pet = usePetStateMachine();

  return (
    <View style={styles.screen}>
      <View style={[styles.stageShell, { paddingTop: insets.top + 10 }]}>
        <View style={styles.topPanel}>
          <View style={styles.nameBlock}>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              numberOfLines={1}
              style={styles.eyebrow}
            >
              Pocket Fire Pet
            </Text>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.72}
              numberOfLines={1}
              style={styles.title}
            >
              {t("pet.name")}
            </Text>
          </View>
          <View style={styles.levelPill}>
            <Ionicons name="flame" size={18} color="#F97316" />
            <Text style={styles.levelText}>Lv. 7</Text>
          </View>
        </View>

        <PetCanvas dispatch={pet.dispatch} snapshot={pet.snapshot} />
      </View>

      <PetHud dispatch={pet.dispatch} snapshot={pet.snapshot} />
    </View>
  );
});

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFF7ED",
    flex: 1
  },
  stageShell: {
    flex: 1,
    minHeight: 340,
    paddingBottom: 10,
    paddingHorizontal: 18
  },
  topPanel: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderColor: "rgba(254, 215, 170, 0.9)",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: "100%",
    zIndex: 4
  },
  nameBlock: {
    flex: 1,
    minWidth: 0
  },
  eyebrow: {
    color: "#9A3412",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "#1F2937",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 34
  },
  levelPill: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FED7AA",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    flexShrink: 0,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  levelText: {
    color: "#7C2D12",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0
  }
});
