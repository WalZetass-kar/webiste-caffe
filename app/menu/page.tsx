import { MenuManagement } from "@/components/management/menu-management";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/sections/page-header";
import { specialMenus } from "@/lib/data";
import { getMenuItems, getRecommendedMenuItems, getSupplyItems } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [items, supplies, recommendedItems] = await Promise.all([
    getMenuItems(),
    getSupplyItems(),
    getRecommendedMenuItems(3),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Manajemen Menu"
          title="Kelola menu, gambar makanan, dan katalog cafe dari satu tempat"
          description="Modul ini sekarang mendukung tambah, edit, hapus, dan upload gambar menu dengan preview sebelum penyimpanan. Semua data menu tersimpan di storage lokal aplikasi dan siap dipakai ulang oleh storefront."
        />
        <MenuManagement
          initialItems={items}
          supplies={supplies}
          specialMenus={specialMenus}
          recommendedItems={recommendedItems}
        />
      </div>
    </AppShell>
  );
}
