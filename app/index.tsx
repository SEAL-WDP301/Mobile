import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
<<<<<<< HEAD
=======
import { ActivityIndicator, View } from "react-native";

>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F37021" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}
