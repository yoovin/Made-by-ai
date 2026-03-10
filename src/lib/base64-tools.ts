export type Base64ToolResult =
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

function normalizeInput(input: string) {
  return input.trim();
}

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
  return new TextDecoder().decode(bytes);
}

export function encodeBase64Input(input: string): Base64ToolResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "인코딩할 텍스트를 입력해 주세요.",
    };
  }

  const output = encodeUtf8ToBase64(normalized);
  return {
    ok: true,
    output,
    action: "encode",
    characterCount: output.length,
  };
}

export function decodeBase64Input(input: string): Base64ToolResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "디코딩할 텍스트를 입력해 주세요.",
    };
  }

  try {
    const output = decodeBase64ToUtf8(normalized);
    return {
      ok: true,
      output,
      action: "decode",
      characterCount: output.length,
    };
  } catch {
    return {
      ok: false,
      error: "유효하지 않은 Base64 문자열입니다.",
    };
  }
}
