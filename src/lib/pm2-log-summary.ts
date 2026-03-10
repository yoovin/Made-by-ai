import fs from "node:fs";
import path from "node:path";

export type Pm2LogSummary = {
  available: boolean;
  source: string;
  lastTimestamp: string | null;
  entries: string[];
  groupedEntries: Array<{
    message: string;
    count: number;
    lastSeen: string | null;
  }>;
  repeatedCount: number;
  errorMessage?: string;
};

const MAX_BYTES = 128 * 1024;
const MAX_ENTRIES = 5;

function extractTimestamp(line: string): string | null {
  const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
  return match ? match[1] : null;
}

function normalizeLine(line: string): string {
  return line.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}:\s*/, "");
}

function groupLines(lines: string[]) {
  const grouped = new Map<string, { count: number; lastSeen: string | null }>();

  for (const line of lines) {
    const message = normalizeLine(line);
    const timestamp = extractTimestamp(line);
    const current = grouped.get(message) ?? { count: 0, lastSeen: null };
    current.count += 1;
    current.lastSeen = timestamp ?? current.lastSeen;
    grouped.set(message, current);
  }

  return Array.from(grouped.entries())
    .map(([message, meta]) => ({ message, count: meta.count, lastSeen: meta.lastSeen }))
    .sort(
      (left, right) =>
        right.count - left.count ||
        (right.lastSeen ?? "").localeCompare(left.lastSeen ?? "") ||
        left.message.localeCompare(right.message),
    );
}

export function getPm2ErrorLogSummary(): Pm2LogSummary {
  const source = path.join(process.cwd(), "ops/logs/pm2-error.log");

  try {
    if (!fs.existsSync(source)) {
      return {
        available: false,
        source,
        lastTimestamp: null,
        entries: [],
        groupedEntries: [],
        repeatedCount: 0,
      };
    }

    const stats = fs.statSync(source);
    const start = Math.max(0, stats.size - MAX_BYTES);
    const descriptor = fs.openSync(source, "r");
    const buffer = Buffer.alloc(stats.size - start);
    fs.readSync(descriptor, buffer, 0, buffer.length, start);
    fs.closeSync(descriptor);

    const content = buffer.toString("utf-8");
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(-MAX_ENTRIES);
    const groupedEntries = groupLines(lines);

    return {
      available: true,
      source,
      lastTimestamp: lines.length > 0 ? extractTimestamp(lines[lines.length - 1]) : null,
      entries: lines,
      groupedEntries,
      repeatedCount: lines.length - groupedEntries.length,
    };
  } catch (error) {
    return {
      available: false,
      source,
      lastTimestamp: null,
      entries: [],
      groupedEntries: [],
      repeatedCount: 0,
      errorMessage: error instanceof Error ? error.message : "unknown error",
    };
  }
}
