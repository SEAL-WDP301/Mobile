import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme/useTheme";

const { width } = Dimensions.get("window");

export default function TabsLayout() {
  const { isDark } = useTheme();

  // Color palette synchronized with current theme
  const colors = {
    bg: isDark ? "#0C0A09" : "#F9F6F0",
    navBg: isDark ? "rgba(20, 17, 15, 0.85)" : "rgba(255, 255, 255, 0.9)",
    navBorder: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
    textActive: "#f37021", // Brand Orange
    textInactive: isDark ? "#A39690" : "#78716C",
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.bg }]}>
      {/* BACKGROUND BLUR GLOWS */}
      <View style={[styles.glowTop, { backgroundColor: "#f37021", opacity: isDark ? 0.15 : 0.05 }]} />
      <View style={[styles.glowBottom, { backgroundColor: "#ff9248", opacity: isDark ? 0.12 : 0.04 }]} />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.textActive,
          tabBarInactiveTintColor: colors.textInactive,
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: colors.navBg,
              borderColor: colors.navBorder,
              ...Platform.select({
                ios: {
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: isDark ? 0.5 : 0.15,
                  shadowRadius: 20,
                },
                android: {
                  elevation: 8,
                },
              }),
            },
          ],
        }}
      >
        {/* TAB 1: HOME */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="home" size={18} color={focused ? "#FFFFFF" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 2: TEAMS */}
        <Tabs.Screen
          name="teams"
          options={{
            title: "Teams",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="users" size={18} color={focused ? "#FFFFFF" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 3: MENTORS */}
        <Tabs.Screen
          name="mentors"
          options={{
            title: "Mentors",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="award" size={18} color={focused ? "#FFFFFF" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 4: NOTIFICATIONS */}
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Alerts",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="bell" size={18} color={focused ? "#FFFFFF" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 5: PROFILE */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="user" size={18} color={focused ? "#FFFFFF" : color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  glowTop: {
    position: "absolute",
    top: -140,
    left: width / 2 - 230,
    width: 460,
    height: 460,
    borderRadius: 230,
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    right: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    pointerEvents: "none",
  },
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 16,
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 4 : 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  iconActive: {
    backgroundColor: "#f37021",
    shadowColor: "#f37021",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
});