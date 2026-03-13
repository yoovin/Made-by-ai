export type JwkKeyType = "RSA" | "EC";

export type JwkSummary = {
  kty: JwkKeyType;
  visibility: "public" | "private";
  keyDetail: string;
  kid: string | null;
  alg: string | null;
  use: string | null;
  keyOps: string[];
  x5cCount: number;
  thumbprintInput: string;
  thumbprint: string;
};

export type JwkInspectResult =
  | {
      ok: true;
      summary: JwkSummary;
    }
  | {
      ok: false;
      error: string;
    };

type SupportedJwk =
  | {
      kty: "RSA";
      n: string;
      e: string;
      d?: string;
      p?: string;
      q?: string;
      dp?: string;
      dq?: string;
      qi?: string;
      oth?: unknown;
      kid?: string;
      alg?: string;
      use?: string;
      key_ops?: unknown;
      x5c?: unknown;
    }
  | {
      kty: "EC";
      crv: string;
      x: string;
      y: string;
      d?: string;
      kid?: string;
      alg?: string;
      use?: string;
      key_ops?: unknown;
      x5c?: unknown;
    };

const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;
const PRIVATE_MEMBERS = ["d", "p", "q", "dp", "dq", "qi", "oth", "k"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeInput(input: string) {
  return input.trim();
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function normalizeX5cCount(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function ensureBase64Url(value: unknown, label: string) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} 값이 없습니다.`);
  }

  if (!BASE64URL_PATTERN.test(value)) {
    throw new Error(`${label} 값은 base64url 형식이어야 합니다.`);
  }

  return value;
}

function decodeBase64UrlLength(value: string) {
  const unpadded = value.replace(/=+$/, "");
  const paddingLength = (4 - (unpadded.length % 4)) % 4;
  const normalized = `${unpadded}${"=".repeat(paddingLength)}`.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  return binary.length;
}

function canonicalizeThumbprintInput(fields: Record<string, string>) {
  const sorted = Object.keys(fields)
    .sort()
    .reduce<Record<string, string>>((accumulator, key) => {
      accumulator[key] = fields[key];
      return accumulator;
    }, {});

  return JSON.stringify(sorted);
}

async function sha256Base64Url(input: string) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("현재 환경에서는 JWK thumbprint를 계산할 수 없습니다.");
  }

  const encoded = new TextEncoder().encode(input);
  const digest = new Uint8Array(await subtle.digest("SHA-256", encoded));
  let binary = "";
  for (const byte of digest) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function classifyVisibility(jwk: Record<string, unknown>) {
  return PRIVATE_MEMBERS.some((key) => key in jwk) ? "private" : "public";
}

function parseRsaJwk(jwk: Record<string, unknown>) {
  const n = ensureBase64Url(jwk.n, "RSA n");
  const e = ensureBase64Url(jwk.e, "RSA e");
  const modulusLength = decodeBase64UrlLength(n) * 8;

  return {
    keyDetail: `${modulusLength}-bit RSA`,
    thumbprintFields: { e, kty: "RSA", n },
  };
}

function parseEcJwk(jwk: Record<string, unknown>) {
  const crv = normalizeOptionalString(jwk.crv);
  const x = ensureBase64Url(jwk.x, "EC x");
  const y = ensureBase64Url(jwk.y, "EC y");

  if (!crv) {
    throw new Error("EC crv 값이 없습니다.");
  }

  if (!["P-256", "P-384", "P-521"].includes(crv)) {
    throw new Error("지원하지 않는 EC curve입니다.");
  }

  return {
    keyDetail: crv,
    thumbprintFields: { crv, kty: "EC", x, y },
  };
}

export async function inspectJwk(input: string): Promise<JwkInspectResult> {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "해석할 JWK JSON 객체를 입력해 주세요.",
    };
  }

  if (normalized.startsWith("-----BEGIN")) {
    return {
      ok: false,
      error: "이번 단계에서는 PEM이 아니라 단일 JWK JSON 객체만 지원합니다.",
    };
  }

  try {
    const parsed = JSON.parse(normalized);
    if (!isRecord(parsed)) {
      return {
        ok: false,
        error: "JWK는 JSON object여야 합니다.",
      };
    }

    if ("keys" in parsed) {
      return {
        ok: false,
        error: "이번 단계에서는 JWKS가 아니라 단일 JWK object만 지원합니다.",
      };
    }

    if (parsed.kty === "oct") {
      return {
        ok: false,
        error: "이번 단계에서는 symmetric `oct` JWK를 지원하지 않습니다.",
      };
    }

    if (parsed.kty !== "RSA" && parsed.kty !== "EC") {
      return {
        ok: false,
        error: "이번 단계에서는 RSA/EC JWK만 지원합니다.",
      };
    }

    const visibility = classifyVisibility(parsed);
    const parsedKey = parsed.kty === "RSA" ? parseRsaJwk(parsed) : parseEcJwk(parsed);
    const thumbprintInput = canonicalizeThumbprintInput(parsedKey.thumbprintFields);

    return {
      ok: true,
      summary: {
        kty: parsed.kty,
        visibility,
        keyDetail: parsedKey.keyDetail,
        kid: normalizeOptionalString(parsed.kid),
        alg: normalizeOptionalString(parsed.alg),
        use: normalizeOptionalString(parsed.use),
        keyOps: normalizeStringArray(parsed.key_ops),
        x5cCount: normalizeX5cCount(parsed.x5c),
        thumbprintInput,
        thumbprint: await sha256Base64Url(thumbprintInput),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "JWK를 해석할 수 없습니다.",
    };
  }
}
