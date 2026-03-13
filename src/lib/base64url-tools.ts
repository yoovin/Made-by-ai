export type Base64UrlToolResult =
  | {
      ok: true;
      output: string;
      action: "encode" | "decode";
      characterCount: number;
    }
  | {
      ok: false;
      error: string;
    };

function encodeUtf8ToBase64(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function decodeBase64ToUtf8(input: string) {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function toBase64Url(base64: string) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string) {
  if (/\+|\//.test(input)) {
    throw new Error("표준 Base64 문자는 지원하지 않습니다.");
  }

  if (!/^[A-Za-z0-9\-_]+=*$/.test(input)) {
    throw new Error("유효하지 않은 Base64URL 문자열입니다.");
  }

  const unpadded = input.replace(/=+$/, "");
  const normalized = unpadded.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  return `${normalized}${"=".repeat(paddingLength)}`;
}

export function encodeBase64UrlInput(input: string): Base64UrlToolResult {
  if (input.length === 0) {
    return {
      ok: false,
      error: "인코딩할 텍스트를 입력해 주세요.",
    };
  }

  const output = toBase64Url(encodeUtf8ToBase64(input));
  return {
    ok: true,
    output,
    action: "encode",
    characterCount: output.length,
  };
}

export function decodeBase64UrlInput(input: string): Base64UrlToolResult {
  if (input.length === 0) {
    return {
      ok: false,
      error: "디코딩할 텍스트를 입력해 주세요.",
    };
  }

  try {
    const output = decodeBase64ToUtf8(fromBase64Url(input));
    return {
      ok: true,
      output,
      action: "decode",
      characterCount: output.length,
    };
  } catch {
    return {
      ok: false,
      error: "유효하지 않은 Base64URL 문자열입니다.",
    };
  }
}
