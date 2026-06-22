import { View, Text, StyleSheet, TouchableOpacity, } from "react-native";

import Logo from "@/components/ui/Logo";

import { useTheme } from "@/constants/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react-native";

interface Props {
    title: string;
    subtitle: string;
}

export default function AuthHeader({
    title,
    subtitle,
}: Props) {
    const { dark, theme, toggleTheme } = useTheme();

    return (
        <View style={styles.container}>
            <Logo />

            <Text
                style={[
                    styles.title,
                    {
                        color: theme.text,
                    },
                ]}
            >
                {title}
            </Text>

            <Text
                style={[
                    styles.subtitle,
                    {
                        color:
                            theme.textSecondary,
                    },
                ]}
            >
                {subtitle}
            </Text>

            <TouchableOpacity
                style={[
                    styles.themeButton,
                    {
                        borderColor:
                            theme.border,
                    },
                ]}
                onPress={toggleTheme}
            >
                {dark ? (
                    <Sun
                        size={20}
                        color={theme.text}
                    />
                ) : (
                    <Moon
                        size={20}
                        color={theme.text}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",

        marginBottom: 32,
    },

    title: {
        fontSize: 26,

        fontWeight: "700",

        marginTop: 20,
    },

    subtitle: {
        marginTop: 8,

        textAlign: "center",
    },

    themeButton: {
        position: "absolute",
        right: 0,
        top: 0,

        width: 42,
        height: 42,

        borderWidth: 1,
        borderRadius: 21,

        justifyContent: "center",
        alignItems: "center",
    },
});