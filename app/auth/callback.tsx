import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallbackScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { loginWithAccessToken } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      try {
        await loginWithAccessToken(String(token));
        router.replace("/(tabs)");
      } catch {
        router.replace("/auth/login");
      }
    };

    void run().catch(() => router.replace("/auth/login"));
  }, [token, loginWithAccessToken]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#F37021" />
    </View>
  );
}
