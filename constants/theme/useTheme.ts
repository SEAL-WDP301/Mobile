import { useTheme as useThemeContext } from "./ThemeProvider";

export function useTheme() {
    const context = useThemeContext();
    if (!context) {
        return {
            isDark: false,
            theme: {} as any,
            toggle: () => {},
        };
    }
    return {
        isDark: context.dark,
        theme: context.theme,
        toggle: context.toggleTheme,
    };
}
