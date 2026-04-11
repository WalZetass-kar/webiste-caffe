import { PageHeader } from "@/components/sections/page-header";
import { AuditLogViewer } from "@/components/management/audit-log-viewer";
import { DataExport } from "@/components/management/data-export";

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-cafe-background">
      <PageHeader
        title="Audit & Export"
        description="Pantau aktivitas sistem dan export data"
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Export Data</h2>
          <DataExport />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Audit Logs</h2>
          <AuditLogViewer />
        </section>
      </div>
    </div>
  );
}
