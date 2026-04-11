import { AssetManagement } from "@/components/management/asset-management";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/sections/page-header";
import { getAssetItems } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export default async function AsetPage() {
  const items = await getAssetItems();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Aset Cafe"
          title="Kelola inventaris, kondisi aset, dan foto peralatan cafe"
          description="Modul aset kini mendukung tambah, edit, hapus, upload foto, serta tampilan card view dan table view untuk membantu audit inventaris operasional cafe."
        />
        <AssetManagement initialItems={items} />
      </div>
    </AppShell>
  );
}
