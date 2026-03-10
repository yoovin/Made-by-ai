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

function normalizeInput(input: string) {
  return input.trim();
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
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
