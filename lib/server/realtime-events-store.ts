import "server-only";

import { randomUUID } from "crypto";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { RealtimeEventRecord, RealtimeEventTone, RealtimeEventType } from "@/lib/models";

function getRealtimeEventsFilePath() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "realtime-events.json");
}

async function ensureRealtimeEventsFile() {
  const filePath = getRealtimeEventsFilePath();

  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, "[]", "utf8");
  }
}

function sortRealtimeEvents(items: RealtimeEventRecord[]) {
  return [...items].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

async function readRealtimeEventsCollection() {
  await ensureRealtimeEventsFile();
  const raw = await readFile(getRealtimeEventsFilePath(), "utf8");

  return sortRealtimeEvents(JSON.parse(raw) as RealtimeEventRecord[]);
}

async function writeRealtimeEventsCollection(items: RealtimeEventRecord[]) {
  await writeFile(getRealtimeEventsFilePath(), JSON.stringify(items, null, 2), "utf8");
}

export async function getRealtimeEvents(limit = 20) {
  const items = await readRealtimeEventsCollection();

  return items.slice(0, limit);
}

export async function appendRealtimeEvent(input: {
  type: RealtimeEventType;
  tone: RealtimeEventTone;
  title: string;
  message: string;
  href?: string;
}) {
  const items = await readRealtimeEventsCollection();
  const event: RealtimeEventRecord = {
    id: randomUUID(),
    type: input.type,
    tone: input.tone,
    title: input.title,
    message: input.message,
    href: input.href,
    createdAt: new Date().toISOString(),
  };

  await writeRealtimeEventsCollection(sortRealtimeEvents([event, ...items]).slice(0, 100));

  return event;
}
