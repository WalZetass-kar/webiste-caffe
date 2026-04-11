import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter, Playfair_Display } from "next/font/google";
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
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CafeFlow",
  description: "Cafe POS, mobile ordering, dan dashboard operasional dengan tampilan cafe modern.",
  manifest: "/manifest.webmanifest",
  applicationName: "CafeFlow",
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
      <body className={`${inter.variable} ${playfairDisplay.variable} bg-cafe-background font-sans text-cafe-text antialiased`}>
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
