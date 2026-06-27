import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/constants/theme/ThemeProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <EventProvider>
        <LocaleProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </LocaleProvider>
      </EventProvider>
    </AuthProvider>
  );
}