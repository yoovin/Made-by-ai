export type UrlToolResult =
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

export function encodeUrlInput(input: string): UrlToolResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "인코딩할 텍스트를 입력해 주세요.",
    };
  }

  const output = encodeURIComponent(normalized);
  return {
    ok: true,
    output,
    action: "encode",
    characterCount: output.length,
  };
}

export function decodeUrlInput(input: string): UrlToolResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "디코딩할 텍스트를 입력해 주세요.",
    };
  }

  try {
    const output = decodeURIComponent(normalized);
    return {
      ok: true,
      output,
      action: "decode",
      characterCount: output.length,
    };
  } catch {
    return {
      ok: false,
      error: "유효하지 않은 URL 인코딩 문자열입니다.",
    };
  }
}
