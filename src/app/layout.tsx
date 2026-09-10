import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { ColorSchemeProvider } from "@/components/providers/color-scheme-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { TaskDetailModal } from "@/components/tasks/task-detail/task-detail-modal";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "A SaaS platform for development teams",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const store = await cookies();
  const colorScheme = store.get("color-scheme")?.value;
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ColorSchemeProvider
            attribute="class"
            defaultTheme={colorScheme ?? "system"}
            enableSystem
          >
            <QueryProvider>
              <TooltipProvider>
                {children}
                <Suspense fallback={null}>
                  <TaskDetailModal />
                </Suspense>
              </TooltipProvider>
            </QueryProvider>
            <Toaster />
          </ColorSchemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
