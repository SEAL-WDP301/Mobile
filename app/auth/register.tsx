import { StyleSheet, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Card from "@/components/ui/Card";

import AuthHeader from "@/components/auth/AuthHeader";
import RegisterForm from "@/components/auth/RegisterForm";

import { useTheme } from "@/constants/theme/ThemeProvider";

export default function RegisterScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >
            <AuthHeader
                title="Create Account"
                subtitle="Join SEAL Competition Platform"
            />

            <Card>
                <RegisterForm />
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        justifyContent: "center",

        padding: 20,
    },
});