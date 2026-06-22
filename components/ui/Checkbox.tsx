import {
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/constants/theme/ThemeProvider";

interface CheckboxProps {
    checked: boolean;
    onChange: (value: boolean) => void;
}

export default function Checkbox({
    checked,
    onChange,
}: CheckboxProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => onChange(!checked)}
            style={[
                styles.container,
                {
                    borderColor: theme.border,
                    backgroundColor: checked
                        ? theme.primary
                        : "transparent",
                },
            ]}
        >
            {checked && (
                <Ionicons
                    name="checkmark"
                    size={14}
                    color="white"
                />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 22,
        height: 22,

        borderWidth: 1,

        borderRadius: 6,

        justifyContent: "center",
        alignItems: "center",
    },
});