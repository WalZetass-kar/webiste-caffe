import { AppShell } from "@/components/layout/app-shell";
import { BranchManagement } from "@/components/management/branch-management";
import { PageHeader } from "@/components/sections/page-header";
import { getBranchItems } from "@/lib/server/branch-store";

export const dynamic = "force-dynamic";

export default async function CabangPage() {
  const items = await getBranchItems();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Multi-Branch"
          title="Kelola beberapa cabang cafe dari satu command center"
          description="Setiap branch punya nama, alamat, manager, dan nomor telepon sendiri. Data order, inventory, dan employee bisa difilter per cabang agar operasional tetap rapi saat bisnis bertumbuh."
        />
        <BranchManagement initialItems={items} />
      </div>
    </AppShell>
  );
}
