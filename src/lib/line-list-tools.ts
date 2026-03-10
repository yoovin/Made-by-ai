export type LineListResult =
  | {
      ok: true;
      totalLines: number;
      nonEmptyLines: number;
      uniqueLines: number;
      duplicatesRemoved: number;
      orderedUnique: string;
      sortedUnique: string;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeLines(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function sortDeterministically(lines: string[]) {
  return [...lines].sort((left, right) => {
    if (left < right) {
      return -1;
    }
    if (left > right) {
      return 1;
    }
    return 0;
  });
}

export function analyzeLineList(input: string): LineListResult {
  const totalLines = input.split(/\r?\n/).length;
  const normalizedLines = normalizeLines(input);

  if (normalizedLines.length === 0) {
    return {
      ok: false,
      error: "정리할 텍스트를 입력해 주세요.",
    };
  }

  const seen = new Set<string>();
  const orderedUniqueLines = normalizedLines.filter((line) => {
    if (seen.has(line)) {
      return false;
    }
    seen.add(line);
    return true;
  });

  const sortedUniqueLines = sortDeterministically(orderedUniqueLines);

  return {
    ok: true,
    totalLines,
    nonEmptyLines: normalizedLines.length,
    uniqueLines: orderedUniqueLines.length,
    duplicatesRemoved: normalizedLines.length - orderedUniqueLines.length,
    orderedUnique: orderedUniqueLines.join("\n"),
    sortedUnique: sortedUniqueLines.join("\n"),
  };
}
