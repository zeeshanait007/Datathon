import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { I18nProvider } from "@/components/i18n-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "CrimeLens AI",
  description: "AI-Powered Investigative Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <div className="h-screen flex overflow-hidden bg-gray-50 text-gray-900 dark:bg-[#020817] dark:text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
              {/* Ambient Background Glow (Only in Dark Mode) */}
              <div className="hidden dark:block fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020817] to-[#020817] pointer-events-none"></div>
              
              <div className="hidden md:flex md:w-64 md:flex-col fixed md:inset-y-0 z-[80] bg-white dark:bg-[#0f172a]/95 backdrop-blur-xl border-r border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl">
                <Sidebar />
              </div>
              <main className="md:pl-64 flex flex-col w-full relative z-10">
                <Header />
                <div className="flex-1 overflow-auto bg-transparent p-6">
                  {children}
                </div>
              </main>
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
