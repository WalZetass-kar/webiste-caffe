
import type { MetadataRoute } from "next";
import { getCafeSettings } from "@/lib/server/settings-store";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getCafeSettings();

  return {
    name: settings.cafeName,
    short_name: settings.cafeName,
    description: `${settings.cafeName} - cafe POS, QR ordering, dan mobile ordering platform dengan dashboard cafe modern.`,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F2",
    theme_color: "#102126",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/cafeflow-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
