import {
    createContext,
    useContext,
    useState,
} from "react";

import { LightTheme } from "./light";
import { DarkTheme } from "./dark";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [dark, setDark] = useState(false);

    const theme = dark
        ? DarkTheme
        : LightTheme;

    return (
        <ThemeContext.Provider
            value={{
                dark,
                theme,
                toggleTheme: () =>
                    setDark(!dark),
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme =
    () => useContext(ThemeContext);