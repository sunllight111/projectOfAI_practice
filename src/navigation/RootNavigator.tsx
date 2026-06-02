import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "../components/AppHeader";
import { useLanguage } from "../i18n/language";
import { AiScreen } from "../screens/AiScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import type { RootTabParamList } from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();
const TAB_BAR_CONTENT_HEIGHT = 60;

export function RootNavigator() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <AppHeader title="ChatGPT Demo" />,
        headerShown: route.name !== "Home" && route.name !== "Profile",
        tabBarActiveTintColor: "#222222",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabel: getTabLabel(route.name, t),
        tabBarLabelStyle: {
          fontSize: 19,
          fontWeight: "600",
          lineHeight: 24,
          marginBottom: 0
        },
        tabBarItemStyle: {
          height: TAB_BAR_CONTENT_HEIGHT,
          justifyContent: "center",
          paddingBottom: 4,
          paddingTop: 6
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F1F5F9",
          borderTopWidth: 1,
          elevation: 8,
          height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 0,
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10
        },
        tabBarIcon: () => {
          if (route.name !== "AI") {
            return null;
          }

          return (
            <View style={styles.createButton}>
              <Ionicons name="add" size={36} color="#FFFFFF" />
            </View>
          );
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI" component={AiScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
    return "";
  }

  return t("tabs.profile");
}

const styles = StyleSheet.create({
  createButton: {
    alignItems: "center",
    backgroundColor: "#F43F5E",
    borderRadius: 13,
    height: 48,
    justifyContent: "center",
    marginTop: 8,
    width: 72
  }
});
