import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/constants/theme/ThemeProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <EventProvider>
        <LocaleProvider>
          <ThemeProvider>
            <NotificationProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </NotificationProvider>
          </ThemeProvider>
        </LocaleProvider>
      </EventProvider>
    </AuthProvider>
  );
}
