import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "../components/AppHeader";
import { useLanguage } from "../i18n/language";
import { EntropyScreen } from "../screens/EntropyScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MentorScreen } from "../screens/MentorScreen";
import { PetScreen } from "../screens/PetScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { ToolScreen } from "../screens/ToolScreen";
import type { RootTabParamList } from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();
const TAB_BAR_CONTENT_HEIGHT = 60;

export function RootNavigator() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t } = useLanguage();
  const bottomOffset = Math.max(insets.bottom, 10);
  const tabBarSideInset =
    width >= 768 ? Math.max((width - 560) / 2, 32) : 26;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <AppHeader title="ChatGPT Demo" />,
        headerShown:
          route.name !== "Home" &&
          route.name !== "AI" &&
          route.name !== "Mentor" &&
          route.name !== "Entropy" &&
          route.name !== "Pet" &&
          route.name !== "Profile" &&
          route.name !== "Search",
        tabBarActiveTintColor: "#FF4400",
        tabBarInactiveTintColor: "#1F2937",
        tabBarLabelPosition: "below-icon",
        tabBarLabel: ({ color }) => (
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.68}
            numberOfLines={1}
            style={[styles.tabBarLabel, { color }]}
          >
            {getTabLabel(route.name, t)}
          </Text>
        ),
        tabBarItemStyle: {
          alignItems: "center",
          height: TAB_BAR_CONTENT_HEIGHT,
          justifyContent: "center",
          paddingBottom: 6,
          paddingTop: 6
        },
        tabBarIconStyle: {
          height: 24,
          marginBottom: 2,
          marginTop: 0,
          width: 24
        },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={22}
            color={color}
          />
        ),
        tabBarStyle:
          route.name === "Search"
            ? styles.hiddenTabBar
            : [
                styles.floatingTabBar,
                {
                  bottom: bottomOffset,
                  left: tabBarSideInset,
                  right: tabBarSideInset
                }
              ],
        tabBarBackground: () => (
          <BlurView
            intensity={88}
            tint="systemChromeMaterialLight"
            experimentalBlurMethod="dimezisBlurView"
            style={styles.tabBarGlass}
          >
            <View style={styles.tabBarHighlight} />
            <View style={styles.tabBarVeil} />
          </BlurView>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI" component={ToolScreen} />
      <Tab.Screen name="Mentor" component={MentorScreen} />
      <Tab.Screen name="Entropy" component={EntropyScreen} />
      <Tab.Screen name="Pet" component={PetScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarButton: () => null
        }}
      />
    </Tab.Navigator>
  );
}

function getTabLabel(
  routeName: keyof RootTabParamList,
  t: ReturnType<typeof useLanguage>["t"]
) {
  if (routeName === "Home") {
    return t("tabs.home");
  }

  if (routeName === "AI") {
    return t("tabs.workbench");
  }

  if (routeName === "Mentor") {
    return t("tabs.mentor");
  }

  if (routeName === "Entropy") {
    return t("tabs.entropy");
  }

  if (routeName === "Pet") {
    return t("tabs.pet");
  }

  if (routeName === "Search") {
    return "";
  }

  return t("tabs.profile");
}

function getTabIcon(
  routeName: keyof RootTabParamList,
  focused: boolean
): keyof typeof Ionicons.glyphMap {
  if (routeName === "Home") {
    return focused ? "home" : "home-outline";
  }

  if (routeName === "AI") {
    return focused ? "briefcase" : "briefcase-outline";
  }

  if (routeName === "Mentor") {
    return focused ? "school" : "school-outline";
  }

  if (routeName === "Entropy") {
    return focused ? "dice" : "dice-outline";
  }

  if (routeName === "Pet") {
    return focused ? "flame" : "flame-outline";
  }

  if (routeName === "Search") {
    return "search-outline";
  }

  return focused ? "person" : "person-outline";
}

const styles = StyleSheet.create({
  floatingTabBar: {
    backgroundColor: "rgba(238, 248, 255, 0.34)",
    borderColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 30,
    borderTopWidth: 0,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 16,
    height: TAB_BAR_CONTENT_HEIGHT,
    overflow: "hidden",
    paddingBottom: 0,
    paddingTop: 0,
    position: "absolute",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20
  },
  hiddenTabBar: {
    display: "none"
  },
  tabBarGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(232, 246, 255, 0.24)"
  },
  tabBarHighlight: {
    backgroundColor: "rgba(255, 255, 255, 0.58)",
    height: 1,
    left: 16,
    position: "absolute",
    right: 16,
    top: 0
  },
  tabBarVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.24)"
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 13,
    marginBottom: 0,
    maxWidth: 58,
    textAlign: "center"
  }
});
