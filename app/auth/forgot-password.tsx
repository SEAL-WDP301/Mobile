import AuthHeader from "@/components/auth/AuthHeader";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Card from "@/components/ui/Card";
import { useTheme } from "@/constants/theme/ThemeProvider";

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
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
                title="Forgot Password"
                subtitle="Enter your email to reset password"
            />

            <Card>
                <ForgotPasswordForm />
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