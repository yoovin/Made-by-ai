export type JwtDecodeSuccess = {
  ok: true;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signatureState: "present" | "empty";
  timeClaims: Array<{ key: string; iso: string }>;
};

export type JwtDecodeFailure = {
  ok: false;
  error: string;
};

export type JwtDecodeResult = JwtDecodeSuccess | JwtDecodeFailure;

function normalizeInput(input: string) {
  return input.trim();
}

function decodeBase64Url(segment: string) {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJsonObject(segment: string, label: string): Record<string, unknown> {
  let value: unknown;
  try {
    value = JSON.parse(segment);
  } catch {
    throw new Error(`${label}은(는) 유효한 JSON 객체가 아닙니다.`);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}은(는) JSON 객체여야 합니다.`);
  }

  return value as Record<string, unknown>;
}

function extractTimeClaims(payload: Record<string, unknown>) {
  return ["iat", "nbf", "exp"]
    .filter((key) => typeof payload[key] === "number")
    .map((key) => ({
      key,
      iso: new Date((payload[key] as number) * 1000).toISOString(),
    }));
}

export function decodeJwt(input: string): JwtDecodeResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "디코딩할 JWT를 입력해 주세요.",
    };
  }

  const segments = normalized.split(".");
  if (segments.length !== 3) {
    return {
      ok: false,
      error: "JWT는 header.payload.signature 3개 세그먼트여야 합니다.",
    };
  }

  try {
    const header = parseJsonObject(decodeBase64Url(segments[0]), "헤더");
    const payload = parseJsonObject(decodeBase64Url(segments[1]), "페이로드");

    return {
      ok: true,
      header,
      payload,
      signatureState: segments[2] ? "present" : "empty",
      timeClaims: extractTimeClaims(payload),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "JWT를 디코딩할 수 없습니다.",
    };
  }
}
