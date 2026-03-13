export type TotpAlgorithm = "SHA1" | "SHA256" | "SHA512";

export type TotpConfig = {
  label: string;
  issuer: string | null;
  accountName: string;
  secret: string;
  algorithm: TotpAlgorithm;
  digits: 6 | 8;
  period: number;
};

export type TotpParseResult =
  | {
      ok: true;
      config: TotpConfig;
    }
  | {
      ok: false;
      error: string;
    };

export type TotpCodeResult =
  | {
      ok: true;
      code: string;
      counter: number;
      timeRemaining: number;
      generatedAtIso: string;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeInput(input: string) {
  return input.trim();
}

function parsePositiveInteger(value: string | null, label: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} 값이 유효하지 않습니다.`);
  }

  return parsed;
}

function decodeLabel(pathname: string) {
  const rawLabel = pathname.replace(/^\//, "");
  if (!rawLabel) {
    throw new Error("TOTP label이 비어 있습니다.");
  }

  const decoded = decodeURIComponent(rawLabel);
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    return {
      label: decoded,
      issuerFromLabel: null,
      accountName: decoded,
    };
  }

  const issuerFromLabel = decoded.slice(0, separatorIndex).trim();
  const accountName = decoded.slice(separatorIndex + 1).trim();

  if (!accountName) {
    throw new Error("TOTP account name이 비어 있습니다.");
  }

  return {
    label: decoded,
    issuerFromLabel: issuerFromLabel || null,
    accountName,
  };
}

function decodeBase32(secret: string) {
  const normalized = secret.replace(/\s+/g, "").replace(/=+$/g, "").toUpperCase();
  if (!normalized) {
    throw new Error("TOTP secret이 비어 있습니다.");
  }

  if ([1, 3, 6].includes(normalized.length % 8)) {
    throw new Error("TOTP secret은 유효한 Base32 길이여야 합니다.");
  }

  if (!/^[A-Z2-7]+$/.test(normalized)) {
    throw new Error("TOTP secret은 유효한 Base32여야 합니다.");
  }

  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const character of normalized) {
    const alphabetIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(character);
    value = (value << 5) | alphabetIndex;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  if (bits > 0 && (value & ((1 << bits) - 1)) !== 0) {
    throw new Error("TOTP secret은 유효한 Base32 padding 규칙을 따라야 합니다.");
  }

  if (bytes.length === 0) {
    throw new Error("TOTP secret이 유효한 바이트를 만들지 못했습니다.");
  }

  return new Uint8Array(bytes);
}

function getAlgorithm(value: string | null): TotpAlgorithm {
  const normalized = (value ?? "SHA1").toUpperCase();
  if (normalized === "SHA1" || normalized === "SHA256" || normalized === "SHA512") {
    return normalized;
  }

  throw new Error("지원하지 않는 TOTP algorithm입니다.");
}

function getDigits(value: string | null): 6 | 8 {
  if (!value || value === "6") {
    return 6;
  }

  if (value === "8") {
    return 8;
  }

  throw new Error("TOTP digits는 6 또는 8만 지원합니다.");
}

export function parseTotpUri(input: string): TotpParseResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "해석할 otpauth URI를 입력해 주세요.",
    };
  }

  try {
    const url = new URL(normalized);
    if (url.protocol !== "otpauth:") {
      throw new Error("otpauth:// 형식만 지원합니다.");
    }

    if (url.hostname.toLowerCase() !== "totp") {
      if (url.hostname.toLowerCase() === "hotp") {
        throw new Error("이번 단계에서는 HOTP가 아니라 TOTP만 지원합니다.");
      }

      throw new Error("otpauth://totp/... 형식만 지원합니다.");
    }

    const label = decodeLabel(url.pathname);
    const secret = url.searchParams.get("secret")?.trim() ?? "";
    if (!secret) {
      throw new Error("TOTP secret이 없습니다.");
    }

    decodeBase32(secret);

    const issuerQuery = url.searchParams.get("issuer")?.trim() ?? "";
    const period = parsePositiveInteger(url.searchParams.get("period"), "period") ?? 30;
    const algorithm = getAlgorithm(url.searchParams.get("algorithm"));
    const digits = getDigits(url.searchParams.get("digits"));

    return {
      ok: true,
      config: {
        label: label.label,
        issuer: issuerQuery || label.issuerFromLabel,
        accountName: label.accountName,
        secret,
        algorithm,
        digits,
        period,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "TOTP URI를 해석할 수 없습니다.",
    };
  }
}

function toBigEndianCounter(counter: number) {
  const bytes = new Uint8Array(8);
  let current = BigInt(counter);

  for (let index = 7; index >= 0; index -= 1) {
    bytes[index] = Number(current & 255n);
    current >>= 8n;
  }

  return bytes;
}

function getSubtleCrypto() {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    return null;
  }

  return subtle;
}

function getWebCryptoHashName(algorithm: TotpAlgorithm) {
  if (algorithm === "SHA1") {
    return "SHA-1";
  }

  if (algorithm === "SHA256") {
    return "SHA-256";
  }

  return "SHA-512";
}

export async function generateTotpCode(config: TotpConfig, timestampMs = Date.now()): Promise<TotpCodeResult> {
  try {
    if (!Number.isFinite(timestampMs) || timestampMs < 0) {
      throw new Error("생성 시각이 유효하지 않습니다.");
    }

    const subtle = getSubtleCrypto();
    if (!subtle) {
      throw new Error("현재 환경에서는 TOTP 코드를 생성할 수 없습니다.");
    }

    const secretBytes = decodeBase32(config.secret);
    const counter = Math.floor(timestampMs / 1000 / config.period);
    const counterBytes = toBigEndianCounter(counter);

    const key = await subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: getWebCryptoHashName(config.algorithm) },
      false,
      ["sign"],
    );

    const signature = new Uint8Array(await subtle.sign("HMAC", key, counterBytes));
    const offset = signature[signature.length - 1] & 15;
    const binary =
      ((signature[offset] & 127) << 24) |
      ((signature[offset + 1] & 255) << 16) |
      ((signature[offset + 2] & 255) << 8) |
      (signature[offset + 3] & 255);
    const code = String(binary % 10 ** config.digits).padStart(config.digits, "0");
    const elapsedSeconds = Math.floor(timestampMs / 1000) % config.period;
    const timeRemaining = config.period - elapsedSeconds;

    return {
      ok: true,
      code,
      counter,
      timeRemaining,
      generatedAtIso: new Date(timestampMs).toISOString(),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "TOTP 코드를 생성할 수 없습니다.",
    };
  }
}
