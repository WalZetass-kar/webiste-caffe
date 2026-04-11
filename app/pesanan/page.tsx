import { OrderManagement } from "@/components/management/order-management";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/sections/page-header";
import { canCreateOrders, roleLabels } from "@/lib/auth/roles";
import { getLowStockSupplies, getMenuItems, getOrders } from "@/lib/server/data-store";
import { getBranchItems } from "@/lib/server/branch-store";
import { getCurrentUserRole } from "@/lib/server/current-role";

export const dynamic = "force-dynamic";

export default async function PesananPage() {
  const [menus, orders, lowStockItems, branches, currentRole] = await Promise.all([
    getMenuItems(),
    getOrders(),
    getLowStockSupplies(),
    getBranchItems(),
    getCurrentUserRole(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Manajemen Pesanan"
          title="Order desk yang otomatis mengurangi stok bahan sesuai resep menu"
          description={`Setiap pesanan baru akan membaca ingredient mapping menu, menghitung kebutuhan bahan, lalu mengurangi stok secara otomatis. Low stock alert dari bahan yang menipis juga langsung ikut terpantau. Role aktif saat ini: ${roleLabels[currentRole]}.`}
          actionLabel={canCreateOrders(currentRole) ? "Buat Order" : undefined}
        />
        <OrderManagement
          menus={menus}
          initialOrders={orders}
          lowStockItems={lowStockItems}
          branches={branches}
          currentRole={currentRole}
        />
      </div>
    </AppShell>
  );
}
