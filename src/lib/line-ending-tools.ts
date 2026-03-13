export type LineEndingMode = "lf" | "crlf";

export type LineEndingResult =
  | {
      ok: true;
      output: string;
      escapedPreview: string;
      mode: LineEndingMode;
      lineCount: number;
      crlfCount: number;
      lfCount: number;
      crCount: number;
    }
  | {
      ok: false;
      error: string;
    };

function countLineEndings(input: string) {
  const crlfCount = (input.match(/\r\n/g) ?? []).length;
  const sanitized = input.replace(/\r\n/g, "");
  const crCount = (sanitized.match(/\r/g) ?? []).length;
  const lfCount = (sanitized.match(/\n/g) ?? []).length;
  return { crlfCount, crCount, lfCount };
}

function escapePreview(input: string) {
  return input.replace(/\r/g, "\\r").replace(/\n/g, "\\n\n").trimEnd();
}

export function normalizeLineEndings(input: string, mode: LineEndingMode): LineEndingResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: "변환할 텍스트를 입력해 주세요.",
    };
  }

  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const output = mode === "lf" ? normalized : normalized.replace(/\n/g, "\r\n");
  const lineCount = normalized.split("\n").length;
  const counts = countLineEndings(input);

  return {
    ok: true,
    output,
    escapedPreview: escapePreview(output),
    mode,
    lineCount,
    ...counts,
  };
}
