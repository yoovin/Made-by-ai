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

export type JwtEncodeSuccess = {
  ok: true;
  token: string;
  signedHeader: Record<string, unknown>;
  signedPayload: Record<string, unknown>;
  algorithm: "HS256" | "HS384" | "HS512";
};

export type JwtEncodeFailure = {
  ok: false;
  error: string;
};

export type JwtEncodeResult = JwtEncodeSuccess | JwtEncodeFailure;

export type JwtEncodeOptions = {
  headerInput: string;
  payloadInput: string;
  secret: string;
  algorithm: "HS256" | "HS384" | "HS512";
};

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

function encodeUtf8ToBase64Url(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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

function parseJsonObjectInput(input: string, label: string) {
  const normalized = input.trim();
  if (!normalized) {
    throw new Error(`${label} JSON을 입력해 주세요.`);
  }

  return parseJsonObject(normalized, label);
}

function mapJwtAlgorithmToHmac(algorithm: JwtEncodeOptions["algorithm"]) {
  if (algorithm === "HS256") {
    return "SHA-256" as const;
  }

  if (algorithm === "HS384") {
    return "SHA-384" as const;
  }

  return "SHA-512" as const;
}

function encodeBytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function normalizeJwtHeader(header: Record<string, unknown>, algorithm: JwtEncodeOptions["algorithm"]) {
  if ("alg" in header) {
    if (typeof header.alg !== "string") {
      throw new Error("헤더의 alg 값은 문자열이어야 합니다.");
    }

    if (header.alg !== algorithm) {
      throw new Error("헤더의 alg 값과 선택한 알고리즘이 일치해야 합니다.");
    }

    return header;
  }

  return { ...header, alg: algorithm };
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

export async function encodeJwt(options: JwtEncodeOptions): Promise<JwtEncodeResult> {
  try {
    if (options.secret.length === 0) {
      return {
        ok: false,
        error: "JWT 서명용 시크릿을 입력해 주세요.",
      };
    }

    const header = normalizeJwtHeader(parseJsonObjectInput(options.headerInput, "헤더"), options.algorithm);
    const payload = parseJsonObjectInput(options.payloadInput, "페이로드");
    const encodedHeader = encodeUtf8ToBase64Url(JSON.stringify(header));
    const encodedPayload = encodeUtf8ToBase64Url(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const { generateRawHmac } = await import("./hmac-tools");
    const signatureResult = await generateRawHmac({
      message: signingInput,
      secret: options.secret,
      algorithm: mapJwtAlgorithmToHmac(options.algorithm),
    });

    if (!signatureResult.ok) {
      return signatureResult;
    }

    const token = `${signingInput}.${encodeBytesToBase64Url(signatureResult.signature)}`;

    return {
      ok: true,
      token,
      signedHeader: header,
      signedPayload: payload,
      algorithm: options.algorithm,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "JWT를 인코딩할 수 없습니다.",
    };
  }
}
