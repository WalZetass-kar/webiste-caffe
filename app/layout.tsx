import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChartProvider } from "@/components/providers/chart-provider";
import { FontAwesomeProvider } from "@/components/providers/fontawesome-provider";
import { GlobalSearchProvider } from "@/components/providers/global-search-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { RealtimeProvider } from "@/components/providers/realtime-provider";
import { RoleProvider } from "@/components/providers/role-provider";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { normalizeUserRole } from "@/lib/auth/roles";
import { getCafeSettings } from "@/lib/server/settings-store";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CafeFlow - Sistem Manajemen Cafe Modern",
  description: "Sistem manajemen cafe lengkap dengan fitur order online, inventory management, staff management, dan reporting. Template website cafe profesional untuk bisnis F&B.",
  manifest: "/manifest.webmanifest",
  applicationName: "CafeFlow",
  keywords: ["cafe management", "restaurant system", "pos system", "inventory management", "cafe website", "online ordering", "sistem cafe", "manajemen restoran"],
  authors: [{ name: "CafeFlow" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CafeFlow",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5F2",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialRole = normalizeUserRole(cookieStore.get("cafeflow-role")?.value);
  const initialSettings = await getCafeSettings();

  return (
    <html lang="id">
      <body className={`${inter.variable} bg-cafe-background font-sans text-cafe-text antialiased`}>
        <SettingsProvider initialSettings={initialSettings}>
          <RoleProvider initialRole={initialRole}>
            <ToastProvider>
              <GlobalSearchProvider>
                <RealtimeProvider>
                  <FontAwesomeProvider />
                  <ChartProvider />
                  <PwaProvider />
                  {children}
                </RealtimeProvider>
              </GlobalSearchProvider>
            </ToastProvider>
          </RoleProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
