import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import { useTheme } from "@/constants/theme/ThemeProvider";

interface DividerProps {
    text?: string;
}

export default function Divider({
    text,
}: DividerProps) {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.line,
                    {
                        backgroundColor:
                            theme.border,
                    },
                ]}
            />

            {text && (
                <Text
                    style={[
                        styles.text,
                        {
                            color:
                                theme.textSecondary,
                        },
                    ]}
                >
                    {text}
                </Text>
            )}

            <View
                style={[
                    styles.line,
                    {
                        backgroundColor:
                            theme.border,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",

        alignItems: "center",

        marginVertical: 10,
    },

    line: {
        flex: 1,
        height: 1,
    },

    text: {
        marginHorizontal: 12,
        fontSize: 12,
    },
});