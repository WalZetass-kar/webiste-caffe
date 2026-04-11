import { EmployeeManagement } from "@/components/management/employee-management";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/sections/page-header";
import { getAttendanceRecords } from "@/lib/server/attendance-store";
import { getBranchItems } from "@/lib/server/branch-store";
import { getEmployeeItems } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const [items, branches, attendance] = await Promise.all([
    getEmployeeItems(),
    getBranchItems(),
    getAttendanceRecords(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Manajemen Employee"
          title="Kelola staff per branch lengkap dengan foto, kontak, dan ringkasan kehadiran"
          description="Halaman staff sekarang mendukung multi-branch employee management. Admin bisa menambah, mengedit, dan menghapus karyawan per cabang, lalu melanjutkan ke dashboard absensi untuk check in, check out, dan rekap jam kerja."
        />
        <EmployeeManagement initialItems={items} branches={branches} attendance={attendance} />
      </div>
    </AppShell>
  );
}
