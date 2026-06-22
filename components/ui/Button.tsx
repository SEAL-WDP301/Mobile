import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import { useTheme } from "@/constants/theme/ThemeProvider";

export default function Button({
    title,
    onPress,
    loading,
}: any) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor:
                        theme.primary,
                },
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color:
                            theme.primaryText,
                    },
                ]}
            >
                {loading
                    ? "Signing In..."
                    : title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 30,

        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontSize: 16,
        fontWeight: "700",
    },
});