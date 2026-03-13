export type HmacAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

export type GenerateHmacOptions = {
  message: string;
  secret: string;
  algorithm: HmacAlgorithm;
  subtleCrypto?: SubtleCrypto | null;
};

export type HmacResult =
  | {
      ok: true;
      digest: string;
      algorithm: HmacAlgorithm;
      messageByteCount: number;
      secretByteCount: number;
      outputLength: number;
    }
  | {
      ok: false;
      error: string;
    };

export type RawHmacResult =
  | {
      ok: true;
      signature: Uint8Array;
      algorithm: HmacAlgorithm;
      messageByteCount: number;
      secretByteCount: number;
    }
  | {
      ok: false;
      error: string;
    };

export const DEFAULT_HMAC_MESSAGE = "what do ya want for nothing?";
export const DEFAULT_HMAC_SECRET = "Jefe";
export const DEFAULT_HMAC_ALGORITHM: HmacAlgorithm = "SHA-256";

function encodeHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getSubtleCrypto(subtleCrypto?: SubtleCrypto | null) {
  if (subtleCrypto !== undefined) {
    return subtleCrypto;
  }

  return globalThis.crypto?.subtle ?? null;
}

function isAlgorithm(value: string): value is HmacAlgorithm {
  return value === "SHA-256" || value === "SHA-384" || value === "SHA-512";
}

export async function generateHmac(options: GenerateHmacOptions): Promise<HmacResult> {
  const rawResult = await generateRawHmac(options);
  if (!rawResult.ok) {
    return rawResult;
  }

  const digest = encodeHex(rawResult.signature);
  return {
    ok: true,
    digest,
    algorithm: rawResult.algorithm,
    messageByteCount: rawResult.messageByteCount,
    secretByteCount: rawResult.secretByteCount,
    outputLength: digest.length,
  };
}

export async function generateRawHmac(options: GenerateHmacOptions): Promise<RawHmacResult> {
  if (!isAlgorithm(options.algorithm)) {
    return {
      ok: false,
      error: "지원하지 않는 HMAC 알고리즘입니다.",
    };
  }

  if (options.message.length === 0) {
    return {
      ok: false,
      error: "메시지를 입력해 주세요.",
    };
  }

  if (options.secret.length === 0) {
    return {
      ok: false,
      error: "시크릿을 입력해 주세요.",
    };
  }

  const subtle = getSubtleCrypto(options.subtleCrypto);
  if (!subtle) {
    return {
      ok: false,
      error: "현재 환경에서는 HMAC를 생성할 수 없습니다.",
    };
  }

  const encoder = new TextEncoder();
  const secretBytes = encoder.encode(options.secret);
  const messageBytes = encoder.encode(options.message);

  try {
    const key = await subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: options.algorithm },
      false,
      ["sign"],
    );

    const signature = new Uint8Array(await subtle.sign("HMAC", key, messageBytes));

    return {
      ok: true,
      signature,
      algorithm: options.algorithm,
      messageByteCount: messageBytes.length,
      secretByteCount: secretBytes.length,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "HMAC를 생성할 수 없습니다.",
    };
  }
}
