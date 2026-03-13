import { CronExpressionResult, parseCronExpression } from "@/lib/cron-expression-tools";

export type CronBuilderMode = "every-n-minutes" | "daily" | "weekdays" | "weekly";

export type CronBuilderInput = {
  mode: CronBuilderMode;
  intervalMinutes: number;
  hour: number;
  minute: number;
  dayOfWeek: number;
};

export type CronBuilderResult =
  | {
      ok: true;
      expression: string;
      explanation: CronExpressionResult & { ok: true };
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

function validateIntegerRange(value: number, min: number, max: number, label: string) {
  if (!Number.isInteger(value) || value < min || value > max) {
    return `${label} 값은 ${min}부터 ${max} 사이의 정수여야 합니다.`;
  }
  return null;
}

export function buildCronExpression(input: CronBuilderInput): CronBuilderResult {
  let expression = "";

  if (input.mode === "every-n-minutes") {
    const intervalError = validateIntegerRange(input.intervalMinutes, 1, 59, "분 간격");
    if (intervalError) {
      return { ok: false, error: intervalError };
    }

    expression = `*/${input.intervalMinutes} * * * *`;
  }

  if (input.mode === "daily") {
    const hourError = validateIntegerRange(input.hour, 0, 23, "시");
    const minuteError = validateIntegerRange(input.minute, 0, 59, "분");
    if (hourError) return { ok: false, error: hourError };
    if (minuteError) return { ok: false, error: minuteError };

    expression = `${input.minute} ${input.hour} * * *`;
  }

  if (input.mode === "weekdays") {
    const hourError = validateIntegerRange(input.hour, 0, 23, "시");
    const minuteError = validateIntegerRange(input.minute, 0, 59, "분");
    if (hourError) return { ok: false, error: hourError };
    if (minuteError) return { ok: false, error: minuteError };

    expression = `${input.minute} ${input.hour} * * 1-5`;
  }

  if (input.mode === "weekly") {
    const hourError = validateIntegerRange(input.hour, 0, 23, "시");
    const minuteError = validateIntegerRange(input.minute, 0, 59, "분");
    const dayError = validateIntegerRange(input.dayOfWeek, 0, 6, "요일");
    if (hourError) return { ok: false, error: hourError };
    if (minuteError) return { ok: false, error: minuteError };
    if (dayError) return { ok: false, error: dayError };

    expression = `${input.minute} ${input.hour} * * ${input.dayOfWeek}`;
  }

  const parsed = parseCronExpression(expression);

  if (!parsed.ok) {
    return {
      ok: false,
      error: parsed.error,
    };
  }

  return {
    ok: true,
    expression,
    explanation: parsed,
    copyText: expression,
  };
}
