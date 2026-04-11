import "server-only";

import { randomUUID } from "crypto";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { auditLogPayloadSchema, type AuditLogPayload, type AuditLogRecord } from "@/lib/models";

const AUDIT_LOG_FILE = path.join(/* turbopackIgnore: true */ process.cwd(), "data", "audit-logs.json");

async function ensureAuditLogFile() {
  await mkdir(path.dirname(AUDIT_LOG_FILE), { recursive: true });

  try {
    await access(AUDIT_LOG_FILE);
  } catch {
    await writeFile(AUDIT_LOG_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

async function readAuditLogs(): Promise<AuditLogRecord[]> {
  await ensureAuditLogFile();
  const content = await readFile(AUDIT_LOG_FILE, "utf8");
  const logs = JSON.parse(content) as AuditLogRecord[];

  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

async function writeAuditLogs(logs: AuditLogRecord[]) {
  await mkdir(path.dirname(AUDIT_LOG_FILE), { recursive: true });
  await writeFile(AUDIT_LOG_FILE, JSON.stringify(logs, null, 2), "utf8");
}

export async function createAuditLog(input: AuditLogPayload) {
  const payload = auditLogPayloadSchema.parse(input);
  const logs = await readAuditLogs();

  const record: AuditLogRecord = {
    id: randomUUID(),
    userId: payload.userId,
    userName: payload.userName,
    userRole: payload.userRole,
    action: payload.action,
    entity: payload.entity,
    entityId: payload.entityId,
    entityName: payload.entityName,
    changes: payload.changes,
    ipAddress: payload.ipAddress,
    userAgent: payload.userAgent,
    timestamp: new Date().toISOString(),
  };

  await writeAuditLogs([record, ...logs]);

  return record;
}

export async function getAuditLogs(filters?: {
  userId?: string;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  let logs = await readAuditLogs();

  if (filters?.userId) {
    logs = logs.filter((log) => log.userId === filters.userId);
  }

  if (filters?.action) {
    logs = logs.filter((log) => log.action === filters.action);
  }

  if (filters?.entity) {
    logs = logs.filter((log) => log.entity === filters.entity);
  }

  if (filters?.startDate) {
    logs = logs.filter((log) => log.timestamp >= filters.startDate);
  }

  if (filters?.endDate) {
    logs = logs.filter((log) => log.timestamp <= filters.endDate);
  }

  if (filters?.limit) {
    logs = logs.slice(0, filters.limit);
  }

  return logs;
}

export async function getAuditLogsByEntity(entity: string, entityId: string) {
  const logs = await readAuditLogs();

  return logs.filter((log) => log.entity === entity && log.entityId === entityId);
}

export async function clearOldAuditLogs(daysToKeep = 90) {
  const logs = await readAuditLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffISO = cutoffDate.toISOString();

  const filteredLogs = logs.filter((log) => log.timestamp >= cutoffISO);

  await writeAuditLogs(filteredLogs);

  return {
    removed: logs.length - filteredLogs.length,
    remaining: filteredLogs.length,
  };
}
