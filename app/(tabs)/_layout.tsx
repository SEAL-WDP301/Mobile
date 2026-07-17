import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, Dimensions, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme/useTheme";
import StudentGuard from "@/components/student/StudentGuard";

const { width } = Dimensions.get("window");

export default function TabsLayout() {
  const { isDark } = useTheme();

  // Color palette synchronized with dark/light themes
  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    navBg: isDark ? "rgba(26, 25, 24, 0.95)" : "rgba(255, 255, 255, 0.95)",
    navBorder: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    textActive: "#F37021", // Brand Orange
    textInactive: isDark ? "#A8A29E" : "#78716C",
  };

  return (
    <StudentGuard>
    <View style={[styles.wrapper, { backgroundColor: colors.bg }]}>
      {/* Background ambient glows (subtle decorative) */}
      <View style={[styles.glowTop, { backgroundColor: "#F37021", opacity: isDark ? 0.08 : 0.02 }]} />
      <View style={[styles.glowBottom, { backgroundColor: "#FF8A3D", opacity: isDark ? 0.06 : 0.01 }]} />

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
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: isDark ? 0.4 : 0.1,
                  shadowRadius: 16,
                },
                android: {
                  elevation: 6,
                },
              }),
            },
          ],
        }}
      >
        {/* TAB 1: TRANG CHỦ */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="home" size={18} color={focused ? "#F8F7F5" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 2: CUỘC THI */}
        <Tabs.Screen
          name="competitions"
          options={{
            title: "Cuộc thi",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="award" size={18} color={focused ? "#F8F7F5" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 3: LỊCH TRÌNH */}
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Lịch trình",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="calendar" size={18} color={focused ? "#F8F7F5" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 4: ĐỘI */}
        <Tabs.Screen
          name="teams"
          options={{
            title: "Đội nhóm",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="users" size={18} color={focused ? "#F8F7F5" : color} />
              </View>
            ),
          }}
        />

        {/* TAB 5: CÁ NHÂN */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Cá nhân",
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Feather name="user" size={18} color={focused ? "#F8F7F5" : color} />
              </View>
            ),
          }}
        />

        {/* HIDE DEPRECATED TABS */}
        <Tabs.Screen
          name="mentors"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
    </StudentGuard>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  glowTop: {
    position: "absolute",
    top: -150,
    left: width / 2 - 200,
    width: 400,
    height: 400,
    borderRadius: 200,
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    bottom: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
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
    paddingBottom: Platform.OS === "ios" ? 6 : 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconActive: {
    backgroundColor: "#F37021",
    shadowColor: "#F37021",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
});