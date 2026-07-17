import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
    Platform,
} from "react-native";

import { useTheme } from "@/constants/theme/ThemeProvider";

type InputProps = TextInputProps & {
    leftIcon?: React.ReactNode;
};

export default function Input({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    leftIcon,
    multiline,
    style,
    textAlignVertical,
    ...rest
}: InputProps) {
    const { theme } = useTheme();
    const resolvedAlign =
        textAlignVertical ?? (multiline ? "center" : "center");

    return (
        <View
            style={[
                styles.container,
                multiline && styles.containerMultiline,
                {
                    backgroundColor: theme.input,
                    borderColor: theme.border,
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
                multiline={multiline}
                textAlignVertical={resolvedAlign}
                style={[
                    styles.input,
                    multiline && styles.inputMultiline,
                    leftIcon ? styles.inputWithIcon : null,
                    { color: theme.text },
                    style,
                ]}
                {...rest}
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
    containerMultiline: {
        height: undefined,
        minHeight: 80,
        alignItems: "stretch",
        paddingVertical: Platform.OS === "ios" ? 14 : 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
        textAlignVertical: "center",
    },
    inputWithIcon: {
        marginLeft: 12,
    },
    inputMultiline: {
        minHeight: 52,
        lineHeight: 22,
        ...(Platform.OS === "ios"
            ? { paddingTop: 4, paddingBottom: 4 }
            : { paddingVertical: 0 }),
    },
});