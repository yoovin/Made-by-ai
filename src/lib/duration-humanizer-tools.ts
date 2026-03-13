export type DurationUnit = "milliseconds" | "seconds" | "minutes" | "hours" | "days";

export type DurationHumanizerResult =
  | {
      ok: true;
      output: string;
      totalMilliseconds: number;
      totalSeconds: number;
      breakdown: Array<{ label: string; value: number }>;
      unit: DurationUnit;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

const UNIT_TO_MILLISECONDS: Record<DurationUnit, number> = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 60_000,
  hours: 3_600_000,
  days: 86_400_000,
};

const BREAKDOWN_UNITS = [
  { label: "d", ms: 86_400_000 },
  { label: "h", ms: 3_600_000 },
  { label: "m", ms: 60_000 },
  { label: "s", ms: 1000 },
  { label: "ms", ms: 1 },
] as const;

export function humanizeDurationInput(input: string, unit: DurationUnit): DurationHumanizerResult {
  const normalized = input.trim();

  if (!normalized) {
    return { ok: false, error: "변환할 duration 값을 입력해 주세요." };
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "유효한 숫자 duration 값을 입력해 주세요." };
  }

  if (value < 0) {
    return { ok: false, error: "음수 duration은 이번 단계에서 지원하지 않습니다." };
  }

  const totalMilliseconds = Math.round(value * UNIT_TO_MILLISECONDS[unit]);
  let remaining = totalMilliseconds;
  const breakdown: Array<{ label: string; value: number }> = [];

  for (const part of BREAKDOWN_UNITS) {
    if (part.label !== "ms") {
      const current = Math.floor(remaining / part.ms);
      if (current > 0) {
        breakdown.push({ label: part.label, value: current });
        remaining -= current * part.ms;
      }
      continue;
    }

    if (remaining > 0 || !breakdown.length) {
      breakdown.push({ label: part.label, value: remaining });
    }
  }

  const output = breakdown.map((part) => `${part.value}${part.label}`).join(" ");

  return {
    ok: true,
    output,
    totalMilliseconds,
    totalSeconds: totalMilliseconds / 1000,
    breakdown,
    unit,
    copyText: output,
  };
}
