import {
    View,
    TextInput,
    StyleSheet,
} from "react-native";

import { useTheme } from "@/constants/theme/ThemeProvider";

export default function Input({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    leftIcon,
}: any) {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.input,
                    borderColor:
                        theme.border,
                },
            ]}
        >
            {leftIcon}

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                secureTextEntry={secureTextEntry}
                style={[
                    styles.input,
                    {
                        color: theme.text,
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

        borderWidth: 1,

        borderRadius: 28,

        height: 56,

        paddingHorizontal: 18,
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
});