export type LineIndentResult =
  | {
      ok: true;
      output: string;
      totalLines: number;
      transformedLines: number;
      blankLinesPreserved: number;
      mode: "indent" | "outdent";
      width: number;
    }
  | {
      ok: false;
      error: string;
    };

function parseIndentWidth(widthRaw: string) {
  const trimmed = widthRaw.trim();
  const parsed = Number(trimmed);
  if (!trimmed || !Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export function adjustLineIndentation(
  source: string,
  mode: "indent" | "outdent",
  widthRaw: string,
): LineIndentResult {
  if (!source.trim()) {
    return {
      ok: false,
      error: "들여쓰기를 조정할 텍스트를 입력해 주세요.",
    };
  }

  const width = parseIndentWidth(widthRaw);
  if (width === null) {
    return {
      ok: false,
      error: "들여쓰기 폭은 1 이상의 정수로 입력해 주세요.",
    };
  }

  const indent = " ".repeat(width);
  const lines = source.split(/\r?\n/);
  let transformedLines = 0;
  let blankLinesPreserved = 0;

  const output = lines
    .map((line) => {
      if (!line.trim()) {
        blankLinesPreserved += 1;
        return line;
      }

      transformedLines += 1;
      if (mode === "indent") {
        return `${indent}${line}`;
      }

      let remaining = width;
      let next = line;
      while (remaining > 0 && next.startsWith(" ")) {
        next = next.slice(1);
        remaining -= 1;
      }
      return next;
    })
    .join("\n");

  return {
    ok: true,
    output,
    totalLines: lines.length,
    transformedLines,
    blankLinesPreserved,
    mode,
    width,
  };
}
