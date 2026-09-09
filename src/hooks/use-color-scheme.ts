import { useTheme } from "next-themes";

export function useColorScheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  return {
    colorScheme: theme as "light" | "dark" | "system" | undefined,
    setColorScheme: setTheme,
    resolvedColorScheme: resolvedTheme as "light" | "dark" | undefined,
    systemColorScheme: systemTheme as "light" | "dark" | undefined,
  };
}
