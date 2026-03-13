const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ULID_LENGTH = 26;
const ULID_TIMESTAMP_LENGTH = 10;
const ULID_RANDOM_LENGTH = 16;
const ULID_RANDOM_BYTE_LENGTH = 10;
const MAX_ULID_TIMESTAMP = 281474976710655;

export type UlidGenerationOptions = {
  timestampMs?: number;
  randomBytes?: Uint8Array;
};

export type UlidResult =
  | {
      ok: true;
      ulid: string;
      timestampMs: number;
      createdAtIso: string;
      length: number;
    }
  | {
      ok: false;
      error: string;
    };

function encodeBase32(value: bigint, length: number) {
  let current = value;
  let encoded = "";

  for (let index = 0; index < length; index += 1) {
    const remainder = Number(current % 32n);
    encoded = `${ULID_ALPHABET.charAt(remainder)}${encoded}`;
    current /= 32n;
  }

  return encoded;
}

function getTimestamp(timestampMs?: number) {
  const resolvedTimestamp = timestampMs ?? Date.now();

  if (!Number.isInteger(resolvedTimestamp) || resolvedTimestamp < 0 || resolvedTimestamp > MAX_ULID_TIMESTAMP) {
    return {
      ok: false as const,
      error: "ULID에 사용할 timestamp가 유효하지 않습니다.",
    };
  }

  return {
    ok: true as const,
    value: resolvedTimestamp,
  };
}

function getRandomBytes(randomBytes?: Uint8Array) {
  if (randomBytes) {
    if (randomBytes.length !== ULID_RANDOM_BYTE_LENGTH) {
      return {
        ok: false as const,
        error: "ULID random bytes는 정확히 10바이트여야 합니다.",
      };
    }

    return {
      ok: true as const,
      value: randomBytes,
    };
  }

  if (typeof crypto === "undefined" || typeof crypto.getRandomValues !== "function") {
    return {
      ok: false as const,
      error: "현재 환경에서는 ULID를 생성할 수 없습니다.",
    };
  }

  return {
    ok: true as const,
    value: crypto.getRandomValues(new Uint8Array(ULID_RANDOM_BYTE_LENGTH)),
  };
}

function encodeRandomBytes(randomBytes: Uint8Array) {
  let value = 0n;

  for (const byte of randomBytes) {
    value = (value << 8n) | BigInt(byte);
  }

  return encodeBase32(value, ULID_RANDOM_LENGTH);
}

export function generateUlid(options: UlidGenerationOptions = {}): UlidResult {
  const timestamp = getTimestamp(options.timestampMs);
  if (!timestamp.ok) {
    return timestamp;
  }

  const randomBytes = getRandomBytes(options.randomBytes);
  if (!randomBytes.ok) {
    return randomBytes;
  }

  const encodedTimestamp = encodeBase32(BigInt(timestamp.value), ULID_TIMESTAMP_LENGTH);
  const encodedRandomness = encodeRandomBytes(randomBytes.value);
  const ulid = `${encodedTimestamp}${encodedRandomness}`;

  return {
    ok: true,
    ulid,
    timestampMs: timestamp.value,
    createdAtIso: new Date(timestamp.value).toISOString(),
    length: ulid.length,
  };
}

export function isUlid(value: string) {
  return /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(value);
}

export const ULID_ZERO_VALUE = "00000000000000000000000000";
export { MAX_ULID_TIMESTAMP, ULID_LENGTH, ULID_RANDOM_BYTE_LENGTH };
