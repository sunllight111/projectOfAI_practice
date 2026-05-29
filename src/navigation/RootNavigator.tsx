import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AppHeader } from "../components/AppHeader";
import { AiScreen } from "../screens/AiScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import type { RootTabParamList } from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <AppHeader title="ChatGPT Demo" />,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4
        },
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          backgroundColor: "#FFFFFF",
          elevation: 8,
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconName = getTabIcon(route.name, focused);

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI" component={AiScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function getTabIcon(
  routeName: keyof RootTabParamList,
  focused: boolean
): keyof typeof Ionicons.glyphMap {
  if (routeName === "Home") {
    return focused ? "home" : "home-outline";
  }

  if (routeName === "AI") {
    return focused ? "sparkles" : "sparkles-outline";
  }

  return focused ? "person" : "person-outline";
}
