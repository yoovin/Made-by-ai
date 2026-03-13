export type LineSortMode = "ascending" | "descending";

export type LineSortResult =
  | {
      ok: true;
      ascending: string;
      descending: string;
      totalLines: number;
      sortableLines: number;
      ignoredBlankLines: number;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeLines(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
}

function prepareLines(input: string) {
  const totalLines = normalizeLines(input);
  const sortable = totalLines.map((line) => line.trim()).filter(Boolean);
  return {
    totalLines: totalLines.length,
    sortable,
    ignoredBlankLines: totalLines.length - sortable.length,
  };
}

function sortAsc(lines: string[]) {
  return [...lines].sort((left, right) => left.localeCompare(right));
}

export function sortLineList(input: string): LineSortResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: "정렬할 텍스트를 입력해 주세요.",
    };
  }

  const prepared = prepareLines(input);
  if (prepared.sortable.length === 0) {
    return {
      ok: false,
      error: "정렬할 텍스트를 입력해 주세요.",
    };
  }

  const ascendingLines = sortAsc(prepared.sortable);
  const descendingLines = [...ascendingLines].reverse();

  return {
    ok: true,
    ascending: ascendingLines.join("\n"),
    descending: descendingLines.join("\n"),
    totalLines: prepared.totalLines,
    sortableLines: prepared.sortable.length,
    ignoredBlankLines: prepared.ignoredBlankLines,
  };
}
