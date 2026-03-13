export type BlankLineMode = "remove-all" | "collapse-runs";

export type BlankLineResult =
  | {
      ok: true;
      output: string;
      totalLines: number;
      blankLinesDetected: number;
      removedLines: number;
      mode: BlankLineMode;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeNewlines(input: string) {
  return input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function isBlank(line: string) {
  return line.trim().length === 0;
}

export function cleanBlankLines(input: string, mode: BlankLineMode): BlankLineResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: "정리할 텍스트를 입력해 주세요.",
    };
  }

  const normalized = normalizeNewlines(input);
  const lines = normalized.split("\n");
  const blankLinesDetected = lines.filter(isBlank).length;

  const outputLines: string[] = [];
  let previousWasBlank = false;
  let removedLines = 0;

  for (const line of lines) {
    const blank = isBlank(line);
    if (!blank) {
      outputLines.push(line);
      previousWasBlank = false;
      continue;
    }

    if (mode === "remove-all") {
      removedLines += 1;
      continue;
    }

    if (previousWasBlank) {
      removedLines += 1;
      continue;
    }

    outputLines.push("");
    previousWasBlank = true;
  }

  return {
    ok: true,
    output: outputLines.join("\n"),
    totalLines: lines.length,
    blankLinesDetected,
    removedLines,
    mode,
  };
}
