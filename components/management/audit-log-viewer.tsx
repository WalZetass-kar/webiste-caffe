"use client";

import { useEffect, useState } from "react";
import type { AuditLogRecord } from "@/lib/models";

type FilterOptions = {
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
};

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    limit: 50,
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.action) params.set("action", filters.action);
      if (filters.entity) params.set("entity", filters.entity);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      if (filters.limit) params.set("limit", String(filters.limit));

      const response = await fetch(`/api/audit-logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getActionBadgeColor(action: string) {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delete":
        return "bg-red-100 text-red-800";
      case "export":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aksi
          </label>
          <select
            value={filters.action || ""}
            onChange={(e) => setFilters({ ...filters, action: e.target.value || undefined })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Semua Aksi</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="export">Export</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entitas
          </label>
          <select
            value={filters.entity || ""}
            onChange={(e) => setFilters({ ...filters, entity: e.target.value || undefined })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Semua Entitas</option>
            <option value="menu">Menu</option>
            <option value="supply">Supply</option>
            <option value="employee">Employee</option>
            <option value="asset">Asset</option>
            <option value="order">Order</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat audit logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Tidak ada audit log ditemukan</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Entitas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">{log.userName}</div>
                    <div className="text-gray-500 text-xs">{log.userRole}</div>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {log.entity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {log.entityName && <div className="font-medium">{log.entityName}</div>}
                    {log.changes && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-xs">
                          Lihat perubahan
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        Menampilkan {logs.length} audit log
      </div>
    </div>
  );
}
