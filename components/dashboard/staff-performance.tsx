"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmployeeRecord, AttendanceRecord, OrderRecord } from "@/lib/models";

type StaffPerformanceProps = {
  employees: EmployeeRecord[];
  attendance: AttendanceRecord[];
  orders: OrderRecord[];
};

type StaffMetrics = {
  employeeId: string;
  employeeName: string;
  role: string;
  attendanceRate: number;
  lateCount: number;
  ordersHandled: number;
  status: "excellent" | "good" | "needs-improvement";
};

export function StaffPerformance({ employees, attendance, orders }: StaffPerformanceProps) {
  const staffMetrics = useMemo(() => {
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);
    const last30DaysStr = last30Days.toISOString().slice(0, 10);

    return employees.map((employee): StaffMetrics => {
      // Calculate attendance in last 30 days
      const employeeAttendance = attendance.filter(
        (att) => att.employeeId === employee.id && att.date >= last30DaysStr
      );
      
      const totalDays = employeeAttendance.length;
      const lateCount = employeeAttendance.filter((att) => att.isLate).length;
      const attendanceRate = totalDays > 0 ? (totalDays / 30) * 100 : 0;

      // Calculate orders handled (for cashier/barista roles)
      // Note: OrderRecord doesn't have createdBy/updatedBy fields
      // This is a placeholder - you can enhance this by adding those fields to OrderRecord
      const ordersHandled = 0;

      // Determine status
      let status: StaffMetrics["status"] = "good";
      if (attendanceRate >= 90 && lateCount <= 2) {
        status = "excellent";
      } else if (attendanceRate < 70 || lateCount > 5) {
        status = "needs-improvement";
      }

      return {
        employeeId: employee.id,
        employeeName: employee.employeeName,
        role: employee.position,
        attendanceRate: Math.round(attendanceRate),
        lateCount,
        ordersHandled,
        status,
      };
    });
  }, [employees, attendance, orders]);

  const sortedStaff = useMemo(() => {
    return [...staffMetrics].sort((a, b) => {
      // Sort by status first (excellent > good > needs-improvement)
      const statusOrder = { excellent: 0, good: 1, "needs-improvement": 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Then by attendance rate
      return b.attendanceRate - a.attendanceRate;
    });
  }, [staffMetrics]);

  const getStatusBadge = (status: StaffMetrics["status"]) => {
    switch (status) {
      case "excellent":
        return <Badge tone="green">Excellent</Badge>;
      case "good":
        return <Badge tone="blue">Good</Badge>;
      case "needs-improvement":
        return <Badge tone="cream">Needs Improvement</Badge>;
    }
  };

  const getStatusColor = (status: StaffMetrics["status"]) => {
    switch (status) {
      case "excellent":
        return "from-[#00704A] to-[#00A862]";
      case "good":
        return "from-[#1E3932] to-[#2A4F47]";
      case "needs-improvement":
        return "from-[#CBA258] to-[#D4A574]";
    }
  };

  if (employees.length === 0) {
    return null;
  }

  return (
    <Card className="starbucks-card">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#00704A]">
            Staff Performance
          </p>
          <h3 className="mt-1 text-xl font-bold text-[#1E3932]">
            Performa karyawan (30 hari terakhir)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge tone="green">Excellent</Badge>
          <Badge tone="blue">Good</Badge>
          <Badge tone="cream">Needs Improvement</Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {sortedStaff.map((staff) => (
          <div
            key={staff.employeeId}
            className="group rounded-2xl border border-[#D4C5B9]/40 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getStatusColor(staff.status)} text-white font-bold text-lg shadow-md`}>
                  {staff.employeeName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1E3932] truncate">
                    {staff.employeeName}
                  </p>
                  <p className="text-xs text-[#6B5D52] mt-1">
                    {staff.role}
                  </p>
                </div>
              </div>
              {getStatusBadge(staff.status)}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[#F7F5F2] p-3">
                <p className="text-xs text-[#6B5D52] mb-1">Attendance</p>
                <p className="text-lg font-bold text-[#1E3932]">
                  {staff.attendanceRate}%
                </p>
              </div>
              <div className="rounded-lg bg-[#F7F5F2] p-3">
                <p className="text-xs text-[#6B5D52] mb-1">Late</p>
                <p className="text-lg font-bold text-[#1E3932]">
                  {staff.lateCount}x
                </p>
              </div>
              <div className="rounded-lg bg-[#F7F5F2] p-3">
                <p className="text-xs text-[#6B5D52] mb-1">Orders</p>
                <p className="text-lg font-bold text-[#1E3932]">
                  {staff.ordersHandled}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[#6B5D52] mb-1">
                <span>Attendance Rate</span>
                <span>{staff.attendanceRate}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8DDD3]">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getStatusColor(staff.status)}`}
                  style={{ width: `${staff.attendanceRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(30, 57, 50, 0.2);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(30, 57, 50, 0.3);
        }
      `}</style>
    </Card>
  );
}
