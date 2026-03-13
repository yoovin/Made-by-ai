export type HashResult =
  | {
      ok: true;
      digest: string;
      characterCount: number;
      byteCount: number;
    }
  | {
      ok: false;
      error: string;
    };

export type HashVerifyResult =
  | {
      ok: true;
      match: boolean;
      computedDigest: string;
      normalizedExpectedDigest: string;
      characterCount: number;
      byteCount: number;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeInput(input: string) {
  return input.trim();
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeExpectedDigest(input: string) {
  if (/\r|\n/.test(input)) {
    return {
      ok: false as const,
      error: "비교 해시는 한 줄짜리 hex 문자열만 지원합니다.",
    };
  }

  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return {
      ok: false as const,
      error: "비교할 SHA-256 해시를 입력해 주세요.",
    };
  }

  if (normalized.length !== 64) {
    return {
      ok: false as const,
      error: "SHA-256 해시는 64자리 hex 문자열이어야 합니다.",
    };
  }

  if (!/^[0-9a-f]{64}$/.test(normalized)) {
    return {
      ok: false as const,
      error: "SHA-256 해시는 0-9, a-f만 포함한 hex 문자열이어야 합니다.",
    };
  }

  return {
    ok: true as const,
    value: normalized,
  };
}

export async function hashTextWithSha256(input: string): Promise<HashResult> {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "해시할 텍스트를 입력해 주세요.",
    };
  }

  const encoded = new TextEncoder().encode(normalized);
  const digestBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const digest = bytesToHex(new Uint8Array(digestBuffer));

  return {
    ok: true,
    digest,
    characterCount: normalized.length,
    byteCount: encoded.byteLength,
  };
}

export async function verifySha256Digest(input: string, expectedDigest: string): Promise<HashVerifyResult> {
  const hashResult = await hashTextWithSha256(input);
  if (!hashResult.ok) {
    return hashResult;
  }

  const normalizedExpectedDigest = normalizeExpectedDigest(expectedDigest);
  if (!normalizedExpectedDigest.ok) {
    return normalizedExpectedDigest;
  }

  return {
    ok: true,
    match: hashResult.digest === normalizedExpectedDigest.value,
    computedDigest: hashResult.digest,
    normalizedExpectedDigest: normalizedExpectedDigest.value,
    characterCount: hashResult.characterCount,
    byteCount: hashResult.byteCount,
  };
}
