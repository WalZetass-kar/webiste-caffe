import { SupplyManagement } from "@/components/management/supply-management";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/sections/page-header";
import { getBranchItems } from "@/lib/server/branch-store";
import { getStockHistory, getSupplyItems } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export default async function SupplyPage() {
  const [items, stockHistory, branches] = await Promise.all([
    getSupplyItems(),
    getStockHistory(20),
    getBranchItems(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Supply Bahan"
          title="Pantau stok bahan baku, supplier, dan restock secara penuh"
          description="Supply Management kini mendukung CRUD lengkap untuk bahan baku cafe, lengkap dengan quantity, satuan, harga beli, dan tanggal restock terakhir dalam table layout yang rapi."
        />
        <SupplyManagement initialItems={items} initialHistory={stockHistory} branches={branches} />
      </div>
    </AppShell>
  );
}
