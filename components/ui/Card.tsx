import React from "react";

import {
    View,
    StyleSheet,
} from "react-native";

import { useTheme } from "@/constants/theme/ThemeProvider";

export default function Card({
    children,
}: any) {
    const { theme } = useTheme();

    return (
        <View style={styles.wrapper}>
            <View
                style={[
                    styles.glow,
                    {
                        backgroundColor:
                            theme.primary,
                    },
                ]}
            />

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            theme.surface,

                        borderColor:
                            theme.border,
                    },
                ]}
            >
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
    },

    glow: {
        position: "absolute",
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.15,
        alignSelf: "center",
        top: -80,
    },

    card: {
        backgroundColor: "rgba(15,23,42,0.85)",
        borderColor: "rgba(249,115,22,0.15)",
        borderWidth: 1,
        borderRadius: 32,
        padding: 24,
    },
});