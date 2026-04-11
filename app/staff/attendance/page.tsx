import { AppShell } from "@/components/layout/app-shell";
import { AttendanceManagement } from "@/components/management/attendance-management";
import { PageHeader } from "@/components/sections/page-header";
import { getAttendanceRecords } from "@/lib/server/attendance-store";
import { getBranchItems } from "@/lib/server/branch-store";
import { getEmployeeItems } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export default async function StaffAttendancePage() {
  const [employees, attendance, branches] = await Promise.all([
    getEmployeeItems(),
    getAttendanceRecords(),
    getBranchItems(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Employee Attendance"
          title="Pantau check in, check out, dan jam kerja staff per branch"
          description="Attendance dashboard ini mendukung check in manual, mode QR attendance, dan tabel riwayat kerja yang mudah dibaca oleh owner maupun manager operasional."
        />
        <AttendanceManagement employees={employees} branches={branches} initialRecords={attendance} />
      </div>
    </AppShell>
  );
}
