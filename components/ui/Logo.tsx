import React from "react";

import { View, Text, StyleSheet, } from "react-native";

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
            circle: 40,
            title: 20,
            subtitle: 10,
            letter: 18,
        },

        md: {
            circle: 50,
            title: 24,
            subtitle: 11,
            letter: 22,
        },

        lg: {
            circle: 64,
            title: 28,
            subtitle: 12,
            letter: 28,
        },
    };

    const current = sizes[size];

    return (
        <View style={styles.container}>
            {/* Circle */}

            <View
                style={[
                    styles.circle,
                    {
                        width:
                            current.circle,

                        height:
                            current.circle,

                        borderRadius:
                            current.circle / 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.letter,
                        {
                            fontSize:
                                current.letter,
                        },
                    ]}
                >
                    S
                </Text>
            </View>

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

    circle: {
        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#F97316",

        borderWidth: 1,

        borderColor:
            "rgba(249,115,22,0.3)",

        shadowColor: "#F97316",

        shadowOpacity: 0.3,

        shadowRadius: 20,

        elevation: 10,
    },

    letter: {
        fontWeight: "700",

        color: "#000",
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