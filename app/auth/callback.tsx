import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallbackScreen() {
  const { token, refreshToken } = useLocalSearchParams<{
    token?: string;
    refreshToken?: string;
  }>();
  const { loginWithTokens } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!token || !refreshToken) {
        router.replace("/auth/login");
        return;
      }

      try {
        await loginWithTokens(String(token), String(refreshToken));
        router.replace("/(tabs)");
      } catch {
        router.replace("/auth/login");
      }
    };

    void run().catch(() => router.replace("/auth/login"));
  }, [token, refreshToken, loginWithTokens]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#F37021" />
    </View>
  );
}
