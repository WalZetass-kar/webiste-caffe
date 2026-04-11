"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requestJson } from "@/lib/client-api";
import type { AttendanceMethod, AttendanceRecord, BranchRecord, EmployeeRecord } from "@/lib/models";
import { formatDate, formatDateTime, formatWorkingHours } from "@/lib/utils";

type AttendanceManagementProps = {
  employees: EmployeeRecord[];
  branches: BranchRecord[];
  initialRecords: AttendanceRecord[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

const selectClassName =
  "min-h-12 w-full rounded-[22px] border border-[#eadfce] bg-[#fffaf5] px-4 py-3 text-sm text-cafe-text outline-none shadow-inner focus:border-cafe-primary/70 focus:ring-2 focus:ring-cafe-primary/20";

function formatClock(value?: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getMethodTone(method: AttendanceMethod) {
  return method === "QR Attendance" ? "cream" : "slate";
}

export function AttendanceManagement({
  employees,
  branches,
  initialRecords,
  eyebrow = "Absensi",
  title = "Employee attendance dengan check in, check out, dan rekap jam kerja",
  description = "Admin dapat memonitor kehadiran harian per branch, menjalankan check in manual, dan menyimpan jejak kerja yang rapi untuk operasional cafe modern.",
}: AttendanceManagementProps) {
  const [records, setRecords] = useState(initialRecords);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [submittingEmployeeId, setSubmittingEmployeeId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const filteredEmployees = useMemo(
    () => employees.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [employees, selectedBranchId],
  );
  const filteredRecords = useMemo(
    () => records.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [records, selectedBranchId],
  );
  const todayRecords = filteredRecords.filter((item) => item.date === today);
  const presentEmployeeIds = new Set(todayRecords.map((item) => item.employeeId));
  const activeAttendance = new Map(
    todayRecords.filter((item) => !item.checkOut).map((item) => [item.employeeId, item]),
  );
  const presentCount = presentEmployeeIds.size;
  const lateCount = todayRecords.filter((item) => item.isLate).length;
  const absentCount = Math.max(filteredEmployees.length - presentCount, 0);

  const sortedRecentRecords = [...filteredRecords].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  const runAttendanceAction = async (employeeId: string, method: AttendanceMethod, mode: "checkin" | "checkout") => {
    setSubmittingEmployeeId(employeeId);
    setError("");

    try {
      const url = mode === "checkin" ? "/api/attendance" : "/api/attendance/checkout";
      const record = await requestJson<AttendanceRecord>(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId, method }),
      });

      setRecords((current) => {
        const existingIndex = current.findIndex((item) => item.id === record.id);

        if (existingIndex >= 0) {
          return current.map((item) => (item.id === record.id ? record : item));
        }

        return [record, ...current];
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal menyimpan absensi.");
    } finally {
      setSubmittingEmployeeId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">{eyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">{title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-cafe-accent/78">{description}</p>
            </div>
            <div className="w-full lg:w-72">
              <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Branch filter</label>
              <select className={selectClassName} value={selectedBranchId} onChange={(event) => setSelectedBranchId(event.target.value)}>
                <option value="all">Semua Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Employees Present Today", value: String(presentCount), detail: "Sudah check in hari ini" },
              { label: "Total Employees Absent", value: String(absentCount), detail: "Belum ada check in" },
              { label: "Late Arrivals", value: String(lateCount), detail: "Datang setelah 08:15" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-cafe-text">{item.value}</p>
                <p className="mt-2 text-xs text-cafe-accent/72">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">QR attendance</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Mode scan cepat untuk shift cafe</h3>
          </div>
          <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm leading-7 text-cafe-accent/78">
            Sistem sudah mendukung metode <span className="font-semibold text-cafe-text">QR Attendance</span>.
            Admin bisa memakainya sebagai tombol simulasi scan saat onboarding scanner QR yang lebih lanjut.
          </div>
          <div className="space-y-3">
            {filteredEmployees.slice(0, 3).map((employee) => (
              <div key={employee.id} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-cafe-text">{employee.employeeName}</p>
                    <p className="mt-1 text-xs text-cafe-accent/68">{employee.branchName}</p>
                  </div>
                  <Badge tone="cream">QR-{employee.id.slice(0, 6).toUpperCase()}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="min-h-10 px-4 py-2 text-xs"
                    disabled={submittingEmployeeId === employee.id || activeAttendance.has(employee.id)}
                    onClick={() => runAttendanceAction(employee.id, "QR Attendance", "checkin")}
                  >
                    {submittingEmployeeId === employee.id ? "Memproses..." : "Check In via QR"}
                  </Button>
                  <Button
                    className="min-h-10 px-4 py-2 text-xs"
                    disabled={submittingEmployeeId === employee.id || !activeAttendance.has(employee.id)}
                    onClick={() => runAttendanceAction(employee.id, "QR Attendance", "checkout")}
                  >
                    Check Out via QR
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Manual attendance</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Check in dan check out dari dashboard</h3>
          </div>
          <div className="space-y-3">
            {filteredEmployees.length === 0 ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Belum ada employee untuk branch ini.
              </div>
            ) : (
              filteredEmployees.map((employee) => {
                const activeRecord = activeAttendance.get(employee.id);

                return (
                  <div key={employee.id} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-cafe-text">{employee.employeeName}</p>
                        <p className="mt-1 text-sm text-cafe-accent/72">
                          {employee.position} | {employee.branchName}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {activeRecord ? <Badge tone="green">Checked In</Badge> : <Badge tone="slate">Belum hadir</Badge>}
                        {activeRecord?.isLate ? <Badge tone="rose">Late</Badge> : null}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        className="min-h-10 px-4 py-2 text-xs"
                        disabled={submittingEmployeeId === employee.id || Boolean(activeRecord)}
                        onClick={() => runAttendanceAction(employee.id, "Manual", "checkin")}
                      >
                        {submittingEmployeeId === employee.id ? "Memproses..." : "Check In"}
                      </Button>
                      <Button
                        className="min-h-10 px-4 py-2 text-xs"
                        disabled={submittingEmployeeId === employee.id || !activeRecord}
                        onClick={() => runAttendanceAction(employee.id, "Manual", "checkout")}
                      >
                        Check Out
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Today summary</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Kehadiran shift hari ini</h3>
          </div>
          <div className="space-y-3">
            {todayRecords.length === 0 ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Belum ada absensi tercatat untuk hari ini.
              </div>
            ) : (
              todayRecords.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-cafe-text">{item.employeeName}</p>
                      <p className="mt-1 text-xs text-cafe-accent/68">{item.position}</p>
                    </div>
                    <Badge tone={getMethodTone(item.method)}>{item.method}</Badge>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cafe-accent/58">Check in</p>
                      <p className="mt-1 text-sm font-semibold text-cafe-text">{formatClock(item.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cafe-accent/58">Check out</p>
                      <p className="mt-1 text-sm font-semibold text-cafe-text">{formatClock(item.checkOut)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cafe-accent/58">Working hours</p>
                      <p className="mt-1 text-sm font-semibold text-cafe-text">
                        {item.checkOut ? formatWorkingHours(item.totalWorkingHours) : "Sedang berjalan"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <Card className="space-y-4 bg-[#fffaf5]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Attendance table</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Riwayat absensi per employee dan branch</h3>
          </div>
          <Badge tone="slate">{sortedRecentRecords.length} records</Badge>
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <div className="overflow-x-auto rounded-[28px] border border-[#efe2d2] bg-[#fffaf5] shadow-inner">
          <table className="min-w-[880px] w-full text-left text-sm text-cafe-text">
            <thead className="bg-[#f6ede4] text-xs uppercase tracking-[0.24em] text-[#8d7b66]">
              <tr>
                <th className="px-4 py-4 font-semibold">Employee</th>
                <th className="px-4 py-4 font-semibold">Branch</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Check In</th>
                <th className="px-4 py-4 font-semibold">Check Out</th>
                <th className="px-4 py-4 font-semibold">Hours</th>
                <th className="px-4 py-4 font-semibold">Method</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecentRecords.map((item) => (
                <tr key={item.id} className="border-t border-[#f1e5d7] transition hover:bg-[#fdf6ee]">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-cafe-text">{item.employeeName}</p>
                    <p className="mt-1 text-xs text-cafe-accent/68">{item.position}</p>
                  </td>
                  <td className="px-4 py-4">{item.branchName}</td>
                  <td className="px-4 py-4">
                    <p>{formatDate(item.date)}</p>
                    {item.isLate ? <p className="mt-1 text-xs text-rose-600">Late arrival</p> : null}
                  </td>
                  <td className="px-4 py-4">{formatDateTime(item.checkIn)}</td>
                  <td className="px-4 py-4">{item.checkOut ? formatDateTime(item.checkOut) : "-"}</td>
                  <td className="px-4 py-4">{item.checkOut ? formatWorkingHours(item.totalWorkingHours) : "Open shift"}</td>
                  <td className="px-4 py-4">
                    <Badge tone={getMethodTone(item.method)}>{item.method}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
