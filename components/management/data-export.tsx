"use client";

import { useState } from "react";
import { useUserRole } from "@/components/providers/role-provider";

type ExportEntity =
  | "menus"
  | "supplies"
  | "employees"
  | "assets"
  | "orders"
  | "ratings"
  | "stock-history"
  | "audit-logs";

type ExportOption = {
  value: ExportEntity;
  label: string;
  description: string;
};

const exportOptions: ExportOption[] = [
  { value: "menus", label: "Menu", description: "Daftar semua menu dan resep" },
  { value: "supplies", label: "Bahan Baku", description: "Inventori bahan baku" },
  { value: "employees", label: "Karyawan", description: "Data karyawan" },
  { value: "assets", label: "Aset", description: "Daftar aset cafe" },
  { value: "orders", label: "Pesanan", description: "Riwayat pesanan" },
  { value: "ratings", label: "Penilaian", description: "Rating dan review pelanggan" },
  { value: "stock-history", label: "Riwayat Stok", description: "Histori perubahan stok" },
  { value: "audit-logs", label: "Audit Logs", description: "Log aktivitas sistem" },
];

export function DataExport() {
  const { role } = useUserRole();
  const [selectedEntity, setSelectedEntity] = useState<ExportEntity>("menus");
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        entity: selectedEntity,
        format: "csv",
        userId: `user-${role}`,
        userName: role.charAt(0).toUpperCase() + role.slice(1),
        userRole: role,
      });

      const response = await fetch(`/api/export?${params}`);

      if (!response.ok) {
        throw new Error("Export gagal");
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `export-${selectedEntity}.csv`;

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert("Export berhasil!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Export gagal. Silakan coba lagi.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Export Data ke CSV
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Pilih jenis data yang ingin Anda export. File akan diunduh dalam format CSV yang bisa dibuka di Excel atau Google Sheets.
        </p>

        <div className="space-y-3 mb-6">
          {exportOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedEntity === option.value
                  ? "border-cafe-primary bg-cafe-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="export-entity"
                value={option.value}
                checked={selectedEntity === option.value}
                onChange={(e) => setSelectedEntity(e.target.value as ExportEntity)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full bg-cafe-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-cafe-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {exporting ? "Mengekspor..." : "Export ke CSV"}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• File CSV bisa dibuka dengan Excel, Google Sheets, atau aplikasi spreadsheet lainnya</li>
          <li>• Data yang diexport adalah snapshot saat ini</li>
          <li>• Semua export akan tercatat di audit logs</li>
        </ul>
      </div>
    </div>
  );
}
