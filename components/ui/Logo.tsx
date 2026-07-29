import React from "react";

import { Image, View, Text, StyleSheet, } from "react-native";

import { useTheme } from "@/constants/theme/ThemeProvider";

interface LogoProps {
    size?: "sm" | "md" | "lg";
}

export default function Logo({
    size = "lg",
}: LogoProps) {
    const { theme } = useTheme();

    const sizes = {
        sm: {
            logo: 58,
            title: 20,
            subtitle: 10,
        },

        md: {
            logo: 72,
            title: 24,
            subtitle: 11,
        },

        lg: {
            logo: 112,
            title: 28,
            subtitle: 12,
        },
    };

    const current = sizes[size];

    return (
        <View style={styles.container}>
            <Image
                source={require("@/assets/images/seal-logo-mark.png")}
                resizeMode="contain"
                style={{
                    width: current.logo,
                    height: current.logo,
                }}
            />

            {/* Text */}

            <View
                style={styles.textContainer}
            >
                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.text,

                            fontSize:
                                current.title,
                        },
                    ]}
                >
                    SEAL
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        {
                            fontSize:
                                current.subtitle,
                        },
                    ]}
                >
                    FPTU · HCMC
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },

    textContainer: {
        marginTop: 12,

        alignItems: "center",
    },

    title: {
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 2,

        color: "#F97316",

        letterSpacing: 2,
    },
});
