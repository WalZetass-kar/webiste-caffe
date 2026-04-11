import "server-only";

import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  attendanceActionPayloadSchema,
  type AttendanceActionPayload,
  type AttendanceRecord,
  type EmployeePosition,
} from "@/lib/models";
import { attendanceSeedData } from "@/lib/data";
import { createCheckInRecord, createCheckOutRecord, getTodayDateString, isLateCheckIn, sortAttendanceRecords, calculateWorkingHours } from "@/lib/services/attendance";
import { getEmployeeItems } from "@/lib/server/data-store";
import { appendRealtimeEvent } from "@/lib/server/realtime-events-store";

function getAttendanceFilePath() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "attendance.json");
}

async function ensureAttendanceFile() {
  const filePath = getAttendanceFilePath();

  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, JSON.stringify(attendanceSeedData, null, 2), "utf8");
  }
}

function normalizeAttendanceRecord(
  input: Partial<AttendanceRecord> & {
    id: string;
    employeeId: string;
    employeeName: string;
    position: EmployeePosition;
    branchId: string;
    branchName: string;
    checkIn: string;
    date: string;
  },
): AttendanceRecord {
  const now = new Date().toISOString();
  const totalWorkingHours = Number(
    input.totalWorkingHours ?? calculateWorkingHours(input.checkIn, input.checkOut),
  );

  return {
    id: input.id,
    employeeId: input.employeeId,
    employeeName: input.employeeName,
    position: input.position,
    branchId: input.branchId,
    branchName: input.branchName,
    date: input.date,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    totalWorkingHours,
    method: input.method ?? "Manual",
    isLate: input.isLate ?? isLateCheckIn(input.checkIn),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? input.createdAt ?? now,
  };
}

async function readAttendanceCollection() {
  await ensureAttendanceFile();
  const raw = await readFile(getAttendanceFilePath(), "utf8");
  const items = JSON.parse(raw) as Array<
    Partial<AttendanceRecord> & {
      id: string;
      employeeId: string;
      employeeName: string;
      position: EmployeePosition;
      branchId: string;
      branchName: string;
      checkIn: string;
      date: string;
    }
  >;

  return sortAttendanceRecords(items.map((item) => normalizeAttendanceRecord(item)));
}

async function writeAttendanceCollection(items: AttendanceRecord[]) {
  await writeFile(getAttendanceFilePath(), JSON.stringify(items, null, 2), "utf8");
}

export async function getAttendanceRecords() {
  return readAttendanceCollection();
}

export async function getTodayAttendance(date = getTodayDateString()) {
  const items = await readAttendanceCollection();

  return items.filter((item) => item.date === date);
}

export async function checkInEmployee(input: AttendanceActionPayload) {
  const payload = attendanceActionPayloadSchema.parse(input);
  const [attendance, employees] = await Promise.all([readAttendanceCollection(), getEmployeeItems()]);
  const employee = employees.find((item) => item.id === payload.employeeId);

  if (!employee) {
    throw new Error("Employee tidak ditemukan.");
  }

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const activeRecord = attendance.find(
    (item) => item.employeeId === employee.id && item.date === today && !item.checkOut,
  );

  if (activeRecord) {
    throw new Error("Employee ini sudah check in hari ini.");
  }

  const record = createCheckInRecord(employee, payload.method, now);

  await writeAttendanceCollection(sortAttendanceRecords([record, ...attendance]));
  await appendRealtimeEvent({
    type: "attendance",
    tone: "info",
    title: `Karyawan atas nama ${employee.employeeName} mulai shift`,
    message: `${employee.employeeName} check in di ${employee.branchName} menggunakan ${payload.method}.`,
    href: "/staff/attendance",
  });

  return record;
}

export async function checkOutEmployee(input: AttendanceActionPayload) {
  const payload = attendanceActionPayloadSchema.parse(input);
  const attendance = await readAttendanceCollection();
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const current = attendance.find(
    (item) => item.employeeId === payload.employeeId && item.date === today && !item.checkOut,
  );

  if (!current) {
    throw new Error("Check in hari ini belum ditemukan untuk employee ini.");
  }

  const updated = createCheckOutRecord(current, payload.method ?? current.method, now);

  await writeAttendanceCollection(sortAttendanceRecords(attendance.map((item) => (item.id === current.id ? updated : item))));

  return updated;
}
