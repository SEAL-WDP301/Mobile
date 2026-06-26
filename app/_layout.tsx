import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/constants/theme/ThemeProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </AuthProvider>
  );
}