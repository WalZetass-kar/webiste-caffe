"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageDropzone } from "@/components/management/image-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { requestJson, uploadImage } from "@/lib/client-api";
import {
  employeePositionOptions,
  type AttendanceRecord,
  type BranchRecord,
  type EmployeePayload,
  type EmployeePosition,
  type EmployeeRecord,
} from "@/lib/models";
import { formatDate, formatDateTime, formatWorkingHours } from "@/lib/utils";

type EmployeeManagementProps = {
  initialItems: EmployeeRecord[];
  branches: BranchRecord[];
  attendance: AttendanceRecord[];
};

type EmployeeFormState = {
  branchId: string;
  employeeName: string;
  position: EmployeePosition;
  phoneNumber: string;
  email: string;
  photo: string;
};

const selectClassName =
  "min-h-12 w-full rounded-[22px] border border-[#eadfce] bg-[#fffaf5] px-4 py-3 text-sm text-cafe-text outline-none shadow-inner focus:border-cafe-primary/70 focus:ring-2 focus:ring-cafe-primary/20";

const leaveRequests = [
  {
    name: "Ayu Maharani",
    type: "Cuti Tahunan",
    period: "10 Apr - 12 Apr",
    status: "Menunggu Persetujuan",
  },
  {
    name: "Rizal Hidayat",
    type: "Izin Sakit",
    period: "8 Apr",
    status: "Disetujui",
  },
];

const payrollOverview = [
  {
    label: "Payroll berikutnya",
    value: "28 April 2026",
  },
  {
    label: "Komponen tetap",
    value: "Gaji pokok + tunjangan shift",
  },
  {
    label: "Insentif aktif",
    value: "Service bonus & penjualan menu spesial",
  },
];

const recruitmentPipeline = [
  {
    role: "Barista",
    stage: "Interview User",
    count: "3 kandidat",
  },
  {
    role: "Kitchen Crew",
    stage: "Seleksi CV",
    count: "5 kandidat",
  },
];

const bonusHighlights = [
  {
    title: "Monthly Sales Bonus",
    detail: "Bonus cair saat target omzet bulanan tercapai 100%.",
  },
  {
    title: "Service Excellence",
    detail: "Reward tambahan untuk staff dengan rating pelayanan terbaik.",
  },
];

function createEmptyForm(branchId: string): EmployeeFormState {
  return {
    branchId,
    employeeName: "",
    position: "Barista",
    phoneNumber: "",
    email: "",
    photo: "",
  };
}

function toFormState(item: EmployeeRecord): EmployeeFormState {
  return {
    branchId: item.branchId,
    employeeName: item.employeeName,
    position: item.position,
    phoneNumber: item.phoneNumber,
    email: item.email,
    photo: item.photo,
  };
}

function getLeaveTone(status: string) {
  return status === "Disetujui" ? "green" : "cream";
}

export function EmployeeManagement({ initialItems, branches, attendance }: EmployeeManagementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultBranchId = branches[0]?.id ?? "";
  const [items, setItems] = useState(initialItems);
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<EmployeeRecord | null>(null);
  const [editingItem, setEditingItem] = useState<EmployeeRecord | null>(null);
  const [form, setForm] = useState<EmployeeFormState>(createEmptyForm(defaultBranchId));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const filteredItems = useMemo(
    () => items.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [items, selectedBranchId],
  );
  const filteredAttendance = useMemo(
    () => attendance.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [attendance, selectedBranchId],
  );
  const todayAttendance = filteredAttendance.filter((item) => item.date === today);
  const presentIds = new Set(todayAttendance.map((item) => item.employeeId));
  const activeAttendance = new Map(
    todayAttendance.filter((item) => !item.checkOut).map((item) => [item.employeeId, item]),
  );
  const latestAttendanceByEmployee = new Map<string, AttendanceRecord>();

  filteredAttendance.forEach((record) => {
    if (!latestAttendanceByEmployee.has(record.employeeId)) {
      latestAttendanceByEmployee.set(record.employeeId, record);
    }
  });

  const lateCount = todayAttendance.filter((item) => item.isLate).length;
  const absentCount = Math.max(filteredItems.length - presentIds.size, 0);
  const managerCount = filteredItems.filter((item) => item.position === "Manager").length;
  const frontlineCount = filteredItems.filter((item) => item.position !== "Kitchen").length;
  const recentAttendance = filteredAttendance.slice(0, 4);
  const selectedEmployeeId = searchParams.get("employee");

  useEffect(() => {
    if (!selectedEmployeeId) {
      return;
    }

    const targetItem = items.find((item) => item.id === selectedEmployeeId);

    if (targetItem) {
      setDetailItem(targetItem);
    }
  }, [items, selectedEmployeeId]);

  const closeDetailModal = () => {
    setDetailItem(null);

    if (!selectedEmployeeId) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("employee");
    router.replace(params.toString() ? `/staff?${params.toString()}` : "/staff", { scroll: false });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(createEmptyForm(selectedBranchId === "all" ? defaultBranchId : selectedBranchId));
    setPhotoFile(null);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item: EmployeeRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setPhotoFile(null);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setPhotoFile(null);
    setError("");
  };

  const saveItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const photo = photoFile ? await uploadImage(photoFile, "employees") : form.photo;
      const payload: EmployeePayload = {
        branchId: form.branchId,
        employeeName: form.employeeName,
        position: form.position,
        phoneNumber: form.phoneNumber,
        email: form.email,
        photo,
      };

      const savedItem = editingItem
        ? await requestJson<EmployeeRecord>(`/api/employees/${editingItem.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await requestJson<EmployeeRecord>("/api/employees", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

      setItems((current) => {
        if (editingItem) {
          return current.map((item) => (item.id === savedItem.id ? savedItem : item));
        }

        return [savedItem, ...current];
      });
      closeModal();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal menyimpan karyawan.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (item: EmployeeRecord) => {
    const confirmed = window.confirm(`Hapus data karyawan "${item.employeeName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await requestJson<void>(`/api/employees/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));

      if (detailItem?.id === item.id) {
        closeDetailModal();
      }
    } catch (requestError) {
      window.alert(requestError instanceof Error ? requestError.message : "Gagal menghapus karyawan.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Employee manager</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">
                Kelola profil tim cafe per branch dengan kontak, foto, dan status shift
              </h3>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <select
                className={selectClassName}
                value={selectedBranchId}
                onChange={(event) => setSelectedBranchId(event.target.value)}
              >
                <option value="all">Semua Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                Add Employee
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Total team", value: String(filteredItems.length) },
              { label: "Manager", value: String(managerCount) },
              { label: "Frontline", value: String(frontlineCount) },
              { label: "On shift", value: String(activeAttendance.size) },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-cafe-text">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Attendance overview</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Ringkasan hadir hari ini per branch</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Present", value: String(presentIds.size), tone: "green" as const },
              { label: "Absent", value: String(absentCount), tone: "slate" as const },
              { label: "Late", value: String(lateCount), tone: "rose" as const },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                <Badge tone={item.tone}>{item.label}</Badge>
                <p className="mt-3 text-2xl font-semibold text-cafe-text">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-7 text-cafe-accent/78">
            Dashboard absensi terpisah mendukung check in manual, QR attendance, check out, dan tabel jam kerja.
          </p>
          <Link
            href="/staff/attendance"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfce] bg-white px-5 py-3 text-sm font-semibold text-cafe-accent transition hover:bg-[#fbf0e2]"
          >
            Open Attendance Dashboard
          </Link>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.length === 0 ? (
          <Card className="bg-[#fffaf5] md:col-span-2 xl:col-span-3">
            <p className="text-sm text-cafe-accent/75">Belum ada employee untuk branch yang dipilih.</p>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const activeRecord = activeAttendance.get(item.id);
            const latestRecord = latestAttendanceByEmployee.get(item.id);

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[32px] border border-white/75 bg-white/85 shadow-soft"
              >
                <div className="relative h-72">
                  <Image src={item.photo} alt={item.employeeName} fill className="object-cover" />
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-cafe-text">{item.employeeName}</h3>
                      <p className="mt-1 text-sm text-cafe-accent/72">
                        {item.position} | {item.branchName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge tone="slate">{item.position}</Badge>
                      {activeRecord ? <Badge tone="green">On Shift</Badge> : <Badge tone="cream">Off Shift</Badge>}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-cafe-accent/78">
                    <p>{item.phoneNumber}</p>
                    <p>{item.email}</p>
                    <p className="text-xs text-cafe-accent/68">
                      {latestRecord
                        ? `Last attendance ${formatDate(latestRecord.date)}`
                        : "Belum ada histori absensi"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="glass" className="min-h-10 px-4 py-2 text-xs" onClick={() => setDetailItem(item)}>
                      View Details
                    </Button>
                    <Button
                      variant="secondary"
                      className="min-h-10 px-4 py-2 text-xs"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </Button>
                    <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => deleteItem(item)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-4 bg-[#fffaf5]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Recent attendance</p>
              <h3 className="mt-2 text-xl font-semibold text-cafe-text">Kehadiran terbaru tim cafe</h3>
            </div>
            <Badge tone="slate">{recentAttendance.length} records</Badge>
          </div>
          <div className="space-y-3">
            {recentAttendance.length === 0 ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Belum ada data absensi untuk branch yang dipilih.
              </div>
            ) : (
              recentAttendance.map((record) => (
                <div key={record.id} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-cafe-text">{record.employeeName}</p>
                      <p className="mt-1 text-xs text-cafe-accent/68">
                        {record.position} | {record.branchName}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={record.checkOut ? "green" : "cream"}>
                        {record.checkOut ? "Completed" : "Open Shift"}
                      </Badge>
                      {record.isLate ? <Badge tone="rose">Late</Badge> : null}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cafe-accent/58">Date</p>
                      <p className="mt-1 text-sm font-semibold text-cafe-text">{formatDate(record.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cafe-accent/58">Check in</p>
                      <p className="mt-1 text-sm font-semibold text-cafe-text">{formatDateTime(record.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cafe-accent/58">Working hours</p>
                      <p className="mt-1 text-sm font-semibold text-cafe-text">
                        {record.checkOut ? formatWorkingHours(record.totalWorkingHours) : "Sedang berjalan"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Admin workflow</p>
          {[
            "Pisahkan staff per branch agar penjadwalan, absensi, dan payroll lebih mudah dipantau.",
            "Gunakan foto terbaru supaya dashboard tim lebih personal dan mudah dikenali saat shift.",
            "Buka dashboard absensi untuk check in manual atau simulasi scan QR saat operasional berjalan.",
          ].map((item, index) => (
            <div key={item} className="rounded-[24px] bg-[#fbf4ec] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">0{index + 1}</p>
              <p className="mt-2 text-sm leading-7 text-cafe-text">{item}</p>
            </div>
          ))}
        </Card>
      </section>

      <section id="cuti" className="scroll-mt-28 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Cuti</p>
          <h3 className="mt-2 text-2xl font-semibold text-cafe-text">Permintaan cuti dan izin staff</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {leaveRequests.map((item) => (
            <Card key={`${item.name}-${item.period}`} className="bg-[#fffaf5]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-cafe-text">{item.name}</p>
                  <p className="mt-1 text-sm text-cafe-accent/75">{item.type}</p>
                </div>
                <Badge tone={getLeaveTone(item.status)}>{item.status}</Badge>
              </div>
              <p className="mt-4 text-sm text-cafe-accent/75">{item.period}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="gaji" className="scroll-mt-28 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Penggajian</p>
          <h3 className="mt-2 text-2xl font-semibold text-cafe-text">Jadwal payroll dan komponen kompensasi</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {payrollOverview.map((item) => (
            <Card key={item.label} className="bg-[#fffaf5]">
              <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
              <p className="mt-2 text-base font-semibold text-cafe-text">{item.value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="rekrutmen" className="scroll-mt-28 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Rekrutmen</p>
          <h3 className="mt-2 text-2xl font-semibold text-cafe-text">Pipeline perekrutan yang sedang berjalan</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {recruitmentPipeline.map((item) => (
            <Card key={item.role} className="bg-[#fffaf5]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-cafe-text">{item.role}</p>
                  <p className="mt-1 text-sm text-cafe-accent/75">{item.stage}</p>
                </div>
                <Badge tone="slate">{item.count}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="bonus" className="scroll-mt-28 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Bonus Bulanan</p>
          <h3 className="mt-2 text-2xl font-semibold text-cafe-text">Skema bonus yang aktif untuk tim cafe</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {bonusHighlights.map((item) => (
            <Card key={item.title} className="bg-[#fffaf5]">
              <p className="font-semibold text-cafe-text">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-cafe-accent/78">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Employee" : "Add Employee"}
        onClose={closeModal}
        className="sm:max-w-3xl"
      >
        <form className="space-y-5" onSubmit={saveItem}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Branch</label>
              <select
                className={selectClassName}
                value={form.branchId}
                onChange={(event) => setForm((current) => ({ ...current, branchId: event.target.value }))}
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Employee Name</label>
              <Input
                value={form.employeeName}
                onChange={(event) => setForm((current) => ({ ...current, employeeName: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Position</label>
              <select
                className={selectClassName}
                value={form.position}
                onChange={(event) =>
                  setForm((current) => ({ ...current, position: event.target.value as EmployeePosition }))
                }
              >
                {employeePositionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Phone Number</label>
              <Input
                value={form.phoneNumber}
                onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </div>
            <div className="md:col-span-2">
              <ImageDropzone
                label="Photo Upload"
                description="Foto karyawan ditampilkan di preview sebelum diunggah ke storage lokal dashboard."
                initialImage={form.photo}
                onChange={setPhotoFile}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : editingItem ? "Update Employee" : "Simpan Employee"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(detailItem)}
        title={detailItem?.employeeName ?? "Detail Employee"}
        onClose={closeDetailModal}
      >
        {detailItem ? (
          <div className="space-y-5">
            <div className="relative h-80 overflow-hidden rounded-[28px]">
              <Image src={detailItem.photo} alt={detailItem.employeeName} fill className="object-cover" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Branch</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.branchName}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Position</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.position}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Phone</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.phoneNumber}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Latest Attendance</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">
                  {latestAttendanceByEmployee.has(detailItem.id)
                    ? formatDateTime(latestAttendanceByEmployee.get(detailItem.id)!.checkIn)
                    : "Belum ada data"}
                </p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Email</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.email}</p>
              </Card>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
