"use client";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { setCookie } from "@/lib/cookies";

// next-themes injects an inline <script> to set the theme class before paint, which
// React 19 flags with a dev-only false positive: https://github.com/pacocoursey/next-themes/issues/387
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function ColorSchemeProvider({ children, ...props }: React.ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider {...props}>
      <CookieSync />
      {children}
    </ThemeProvider>
  );
}

function CookieSync() {
  const { theme } = useTheme();
  useEffect(() => {
    if (theme) setCookie("color-scheme", theme);
  }, [theme]);
  return null;
}
