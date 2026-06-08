import React, { useRef, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { G, Path, Polygon, Text as SvgText } from "react-native-svg";

import { TranslationKey, useLanguage } from "../i18n/language";

/* ================================================================
   Wheel helpers
   ================================================================ */

const SEGMENT_COUNT = 8;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const WHEEL_RADIUS = 140;
const WHEEL_CX = WHEEL_RADIUS + 12;
const WHEEL_CY = WHEEL_RADIUS + 12;
const SVG_SIZE = (WHEEL_RADIUS + 12) * 2;

const SEGMENT_COLORS = [
  "#FF6B6B", // red
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4D96FF", // blue
  "#FF8C32", // orange
  "#9B59B6", // purple
  "#1ABC9C", // teal
  "#E74C3C"  // crimson
];

const SEGMENT_LABEL_KEYS: TranslationKey[] = [
  "entropy.wheel.segments.diamond",
  "entropy.wheel.segments.gold",
  "entropy.wheel.segments.silver",
  "entropy.wheel.segments.platinum",
  "entropy.wheel.segments.lucky",
  "entropy.wheel.segments.mystery",
  "entropy.wheel.segments.special",
  "entropy.wheel.segments.miss"
];

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

/* ================================================================
   Slot helpers
   ================================================================ */

const SLOT_SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "🍉", "🍎", "⭐", "💎"];

/* ================================================================
   EntropyScreen
   ================================================================ */

export function EntropyScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useLanguage();

  /* ---- Wheel state ---- */
  const wheelRotation = useRef(new Animated.Value(0)).current;
  const totalRotation = useRef(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const spinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);

    // Pick a random target segment
    const targetSeg = Math.floor(Math.random() * SEGMENT_COUNT);

    // Compute rotation so segment `targetSeg` lands under pointer (12 o'clock)
    // Segment center angle in original coords: targetSeg * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    // We want that point at 270° (12 o'clock)
    let rotationNeeded =
      270 -
      (targetSeg * SEGMENT_ANGLE + SEGMENT_ANGLE / 2) -
      (totalRotation.current % 360);
    while (rotationNeeded < 0) rotationNeeded += 360;

    // Add 5-7 full spins for visual effect
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const spinAmount = fullSpins + rotationNeeded;
    const newTotal = totalRotation.current + spinAmount;

    // Animate from current position — no reset to avoid visual snap
    Animated.timing(wheelRotation, {
      toValue: newTotal,
      duration: 4000 + Math.random() * 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => {
      totalRotation.current = newTotal;
      setWheelSpinning(false);
      // Compute result segment
      const normalized =
        ((270 - (totalRotation.current % 360) + 360) % 360);
      const segIndex = Math.floor(normalized / SEGMENT_ANGLE);
      setWheelResult(t(SEGMENT_LABEL_KEYS[segIndex % SEGMENT_COUNT]));
    });
  };

  /* ---- Slot state ---- */
  const [reels, setReels] = useState<string[]>(["❓", "❓", "❓"]);
  const [slotSpinning, setSlotSpinning] = useState(false);
  const [slotResult, setSlotResult] = useState<string | null>(null);
  const intervalRefs = useRef<ReturnType<typeof setInterval>[]>([]);

  const spinSlots = () => {
    if (slotSpinning) return;
    setSlotSpinning(true);
    setSlotResult(null);

    // Clear any stale intervals
    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current = [];

    const finalSymbols: string[] = [];
    const stopped = [false, false, false];

    // Start all three reels cycling
    for (let i = 0; i < 3; i++) {
      const id = setInterval(() => {
        if (stopped[i]) return;
        setReels((prev) => {
          const next = [...prev];
          next[i] = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
          return next;
        });
      }, 60);
      intervalRefs.current.push(id);
    }

    // Stop reel 0 after 800ms
    setTimeout(() => {
      const sym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      finalSymbols[0] = sym;
      stopped[0] = true;
      setReels((prev) => {
        const next = [...prev];
        next[0] = sym;
        return next;
      });
    }, 800);

    // Stop reel 1 after 1500ms
    setTimeout(() => {
      const sym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      finalSymbols[1] = sym;
      stopped[1] = true;
      setReels((prev) => {
        const next = [...prev];
        next[1] = sym;
        return next;
      });
    }, 1500);

    // Stop reel 2 after 2200ms, then clean up
    setTimeout(() => {
      const sym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      finalSymbols[2] = sym;
      stopped[2] = true;
      setReels((prev) => {
        const next = [...prev];
        next[2] = sym;
        return next;
      });
      // Clean up all intervals
      intervalRefs.current.forEach(clearInterval);
      intervalRefs.current = [];
      setSlotSpinning(false);

      // Check result
      if (
        finalSymbols[0] === finalSymbols[1] &&
        finalSymbols[1] === finalSymbols[2]
      ) {
        setSlotResult(t("entropy.slot.result.win"));
      } else if (
        finalSymbols[0] === finalSymbols[1] ||
        finalSymbols[1] === finalSymbols[2] ||
        finalSymbols[0] === finalSymbols[2]
      ) {
        setSlotResult("🍀 小奖！");
      } else {
        setSlotResult(t("entropy.slot.result.lose"));
      }
    }, 2200);
  };

  /* ---- Render ---- */

  const renderWheel = () => {
    const segments = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const startAngle = i * SEGMENT_ANGLE;
      const endAngle = (i + 1) * SEGMENT_ANGLE;
      const midAngle = startAngle + SEGMENT_ANGLE / 2;
      const path = describeArc(
        WHEEL_CX,
        WHEEL_CY,
        WHEEL_RADIUS,
        startAngle,
        endAngle
      );

      // Text position at ~65% radius from center
      const labelPos = polarToCartesian(
        WHEEL_CX,
        WHEEL_CY,
        WHEEL_RADIUS * 0.64,
        midAngle + 90
      );

      segments.push(
        <G key={i}>
          <Path d={path} fill={SEGMENT_COLORS[i]} stroke="#fff" strokeWidth={2} />
          <SvgText
            x={labelPos.x}
            y={labelPos.y}
            fill="#fff"
            fontSize={12}
            fontWeight="700"
            textAnchor="middle"
            alignmentBaseline="central"
            transform={`rotate(${midAngle}, ${labelPos.x}, ${labelPos.y})`}
          >
            {t(SEGMENT_LABEL_KEYS[i])}
          </SvgText>
        </G>
      );
    }

    // Outer ring
    segments.push(
      <Path
        key="ring"
        d={`M ${WHEEL_CX} ${WHEEL_CY} m 0 -${WHEEL_RADIUS} a ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 1 1 -0.01 0`}
        fill="none"
        stroke="#fff"
        strokeWidth={4}
      />
    );

    // Center circle
    segments.push(
      <Path
        key="center"
        d={`M ${WHEEL_CX} ${WHEEL_CY} m 0 -18 a 18 18 0 1 1 -0.01 0`}
        fill="#fff"
        stroke="#E0E0E0"
        strokeWidth={2}
      />
    );

    return (
      <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
        {segments}
      </Svg>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>{t("entropy.title")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("language.zh") === "中文" ? "随机与命运" : "Random & Fortune"}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + insets.bottom + 40,
          paddingHorizontal: 20
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ============ Wheel Card ============ */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("entropy.wheel.title")}</Text>

          {/* Wheel area */}
          <View style={styles.wheelContainer}>
            {/* Pointer */}
            <View style={styles.pointer}>
              <Svg width={28} height={28} viewBox="0 0 28 28">
                <Polygon
                  points="14,26 2,2 26,2"
                  fill="#FF4400"
                  stroke="#fff"
                  strokeWidth={2}
                />
              </Svg>
            </View>

            {/* Rotating wheel */}
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: wheelRotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"]
                    })
                  }
                ]
              }}
            >
              {renderWheel()}
            </Animated.View>
          </View>

          {/* Result */}
          {wheelResult !== null && !wheelSpinning && (
            <View style={styles.resultBanner}>
              <Text style={styles.resultText}>
                {t("entropy.wheel.result")}
                <Text style={styles.resultValue}>{wheelResult}</Text>
              </Text>
            </View>
          )}

          {/* Spin button */}
          <Pressable
            style={({ pressed }) => [
              styles.spinButton,
              wheelSpinning && styles.spinButtonDisabled,
              { opacity: pressed ? 0.75 : 1 }
            ]}
            onPress={spinWheel}
            disabled={wheelSpinning}
          >
            <Text style={styles.spinButtonText}>
              {wheelSpinning ? "🎰 ..." : `🎯 ${t("entropy.wheel.spin")}`}
            </Text>
          </Pressable>
        </View>

        {/* ============ Slot Machine Card ============ */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("entropy.slot.title")}</Text>

          {/* Slot reels */}
          <View style={styles.slotMachine}>
            {reels.map((symbol, i) => (
              <View
                key={i}
                style={[
                  styles.reel,
                  slotSpinning && styles.reelSpinning
                ]}
              >
                <Text style={styles.reelSymbol}>{symbol}</Text>
              </View>
            ))}
          </View>

          {/* Result */}
          {slotResult !== null && !slotSpinning && (
            <View style={styles.resultBanner}>
              <Text style={styles.resultText}>{slotResult}</Text>
            </View>
          )}

          {/* Spin button */}
          <Pressable
            style={({ pressed }) => [
              styles.spinButton,
              styles.slotButton,
              slotSpinning && styles.spinButtonDisabled,
              { opacity: pressed ? 0.75 : 1 }
            ]}
            onPress={spinSlots}
            disabled={slotSpinning}
          >
            <Text style={styles.spinButtonText}>
              {slotSpinning ? "🎰 ..." : `🎰 ${t("entropy.slot.spin")}`}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================================================================
   Styles
   ================================================================ */

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#F8FAFC",
    flex: 1
  },
  header: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 12
  },
  headerTitle: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  headerSubtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2
  },
  scroll: {
    flex: 1
  },

  /* Card */
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    marginTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12
  },
  cardTitle: {
    color: "#1E293B",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 16
  },

  /* Wheel */
  wheelContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative"
  },
  pointer: {
    elevation: 10,
    left: SVG_SIZE / 2 - 14,
    position: "absolute",
    top: -14,
    transform: [{ rotate: "180deg" }],
    zIndex: 10
  },

  /* Result */
  resultBanner: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  resultText: {
    color: "#92400E",
    fontSize: 15,
    fontWeight: "500"
  },
  resultValue: {
    color: "#D97706",
    fontWeight: "800"
  },

  /* Spin Button */
  spinButton: {
    alignItems: "center",
    backgroundColor: "#FF4400",
    borderRadius: 28,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 40,
    paddingVertical: 14
  },
  spinButtonDisabled: {
    backgroundColor: "#FCA5A5",
    opacity: 0.7
  },
  spinButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  slotButton: {
    backgroundColor: "#7C3AED"
  },

  /* Slot Machine */
  slotMachine: {
    alignItems: "center",
    backgroundColor: "#1E1B4B",
    borderRadius: 18,
    columnGap: 8,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 28
  },
  reel: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    height: 88,
    justifyContent: "center",
    width: 80
  },
  reelSpinning: {
    backgroundColor: "#FEF3C7"
  },
  reelSymbol: {
    fontSize: 44
  }
});
