export type SecretFormat = "hex" | "base64url" | "base64";

export type SecretGeneratorOptions = {
  byteLengthInput: string;
  format: SecretFormat;
  randomBytes?: Uint8Array;
};

export type SecretGeneratorResult =
  | {
      ok: true;
      secret: string;
      format: SecretFormat;
      byteLength: number;
      outputLength: number;
    }
  | {
      ok: false;
      error: string;
    };

const MIN_SECRET_BYTES = 16;
const MAX_SECRET_BYTES = 64;
const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const DEFAULT_SECRET_OPTIONS: SecretGeneratorOptions = {
  byteLengthInput: "32",
  format: "base64url",
};

function parseByteLength(byteLengthInput: string) {
  const trimmed = byteLengthInput.trim();
  if (!trimmed) {
    return {
      ok: false as const,
      error: `바이트 길이는 ${MIN_SECRET_BYTES}부터 ${MAX_SECRET_BYTES} 사이의 숫자로 입력해 주세요.`,
    };
  }

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) {
    return {
      ok: false as const,
      error: `바이트 길이는 ${MIN_SECRET_BYTES}부터 ${MAX_SECRET_BYTES} 사이의 정수만 입력할 수 있습니다.`,
    };
  }

  if (parsed < MIN_SECRET_BYTES || parsed > MAX_SECRET_BYTES) {
    return {
      ok: false as const,
      error: `바이트 길이는 ${MIN_SECRET_BYTES}부터 ${MAX_SECRET_BYTES} 사이여야 합니다.`,
    };
  }

  return {
    ok: true as const,
    value: parsed,
  };
}

function getRandomBytes(expectedLength: number, injected?: Uint8Array) {
  if (injected) {
    if (injected.length !== expectedLength) {
      return {
        ok: false as const,
        error: "주입한 random bytes 길이가 요청한 바이트 길이와 다릅니다.",
      };
    }

    return {
      ok: true as const,
      value: injected,
    };
  }

  if (typeof crypto === "undefined" || typeof crypto.getRandomValues !== "function") {
    return {
      ok: false as const,
      error: "현재 환경에서는 시크릿을 생성할 수 없습니다.",
    };
  }

  return {
    ok: true as const,
    value: crypto.getRandomValues(new Uint8Array(expectedLength)),
  };
}

function encodeHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function encodeBase64(bytes: Uint8Array) {
  let output = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const second = bytes[index + 1] ?? 0;
    const third = bytes[index + 2] ?? 0;
    const chunk = (first << 16) | (second << 8) | third;

    output += BASE64_ALPHABET[(chunk >> 18) & 63];
    output += BASE64_ALPHABET[(chunk >> 12) & 63];
    output += index + 1 < bytes.length ? BASE64_ALPHABET[(chunk >> 6) & 63] : "=";
    output += index + 2 < bytes.length ? BASE64_ALPHABET[chunk & 63] : "=";
  }

  return output;
}

function encodeSecret(bytes: Uint8Array, format: SecretFormat) {
  if (format === "hex") {
    return encodeHex(bytes);
  }

  const base64 = encodeBase64(bytes);
  if (format === "base64") {
    return base64;
  }

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function isSecretFormat(value: string): value is SecretFormat {
  return value === "hex" || value === "base64url" || value === "base64";
}

export function generateSecret(options: SecretGeneratorOptions): SecretGeneratorResult {
  if (!isSecretFormat(options.format)) {
    return {
      ok: false,
      error: "지원하지 않는 출력 형식입니다.",
    };
  }

  const byteLength = parseByteLength(options.byteLengthInput);
  if (!byteLength.ok) {
    return byteLength;
  }

  const randomBytes = getRandomBytes(byteLength.value, options.randomBytes);
  if (!randomBytes.ok) {
    return randomBytes;
  }

  const secret = encodeSecret(randomBytes.value, options.format);

  return {
    ok: true,
    secret,
    format: options.format,
    byteLength: byteLength.value,
    outputLength: secret.length,
  };
}

export { MAX_SECRET_BYTES, MIN_SECRET_BYTES };
