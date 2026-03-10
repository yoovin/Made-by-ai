export type TimestampInputType = "unix-seconds" | "unix-milliseconds" | "iso-utc";

export type TimestampResult =
  | {
      ok: true;
      inputType: TimestampInputType;
      unixSeconds: number;
      unixMilliseconds: number;
      isoUtc: string;
    }
  | {
      ok: false;
      error: string;
    };

function parseNumeric(value: string): TimestampResult {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return {
      ok: false,
      error: "유효한 타임스탬프를 입력해 주세요.",
    };
  }

  const normalized = value.trim();
  const isMilliseconds = normalized.length >= 13;
  const unixMilliseconds = isMilliseconds ? numeric : numeric * 1000;
  const unixSeconds = isMilliseconds ? Math.floor(numeric / 1000) : numeric;

  return {
    ok: true,
    inputType: isMilliseconds ? "unix-milliseconds" : "unix-seconds",
    unixSeconds,
    unixMilliseconds,
    isoUtc: new Date(unixMilliseconds).toISOString(),
  };
}

function parseIsoUtc(value: string): TimestampResult {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return {
      ok: false,
      error: "유효한 ISO 8601 UTC 문자열을 입력해 주세요.",
    };
  }

  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value.trim());
  if (!hasTimezone) {
    return {
      ok: false,
      error: "타임존이 포함된 ISO 8601 UTC 문자열만 지원합니다.",
    };
  }

  const unixMilliseconds = parsed.getTime();
  return {
    ok: true,
    inputType: "iso-utc",
    unixSeconds: Math.floor(unixMilliseconds / 1000),
    unixMilliseconds,
    isoUtc: parsed.toISOString(),
  };
}

export function convertTimestampInput(input: string): TimestampResult {
  const normalized = input.trim();
  if (!normalized) {
    return {
      ok: false,
      error: "변환할 타임스탬프를 입력해 주세요.",
    };
  }

  if (/^\d+$/.test(normalized)) {
    return parseNumeric(normalized);
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(normalized)) {
    return parseIsoUtc(normalized);
  }

  return {
    ok: false,
    error: "Unix 초/밀리초 또는 타임존이 포함된 ISO 8601 UTC 문자열만 지원합니다.",
  };
}
