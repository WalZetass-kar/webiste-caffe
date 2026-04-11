import { randomUUID } from "crypto";
import type { AttendanceMethod, AttendanceRecord, EmployeeRecord } from "@/lib/models";

const operationalTimeZone = "Asia/Jakarta";

export function getTodayDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function calculateWorkingHours(checkIn: string, checkOut?: string) {
  if (!checkOut) {
    return 0;
  }

  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  return Number((Math.max(0, end - start) / (1000 * 60 * 60)).toFixed(2));
}

export function isLateCheckIn(checkIn: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: operationalTimeZone,
  }).formatToParts(new Date(checkIn));
  const hour = Number(parts.find((item) => item.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((item) => item.type === "minute")?.value ?? "0");
  const minutes = hour * 60 + minute;

  return minutes > 8 * 60 + 15;
}

export function sortAttendanceRecords(items: AttendanceRecord[]) {
  return [...items].sort((left, right) => {
    if (right.date !== left.date) {
      return right.date.localeCompare(left.date);
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function createCheckInRecord(employee: EmployeeRecord, method: AttendanceMethod, now = new Date().toISOString()) {
  return {
    id: randomUUID(),
    employeeId: employee.id,
    employeeName: employee.employeeName,
    position: employee.position,
    branchId: employee.branchId,
    branchName: employee.branchName,
    date: now.slice(0, 10),
    checkIn: now,
    totalWorkingHours: 0,
    method,
    isLate: isLateCheckIn(now),
    createdAt: now,
    updatedAt: now,
  } satisfies AttendanceRecord;
}

export function createCheckOutRecord(
  record: AttendanceRecord,
  method: AttendanceMethod,
  now = new Date().toISOString(),
) {
  return {
    ...record,
    checkOut: now,
    totalWorkingHours: calculateWorkingHours(record.checkIn, now),
    method,
    updatedAt: now,
  } satisfies AttendanceRecord;
}
