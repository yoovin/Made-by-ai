export type QueryStringBuilderRow = {
  key: string;
  value: string;
};

export type QueryStringBuilderResult =
  | {
      ok: true;
      rows: QueryStringBuilderRow[];
      output: string;
      prefixedOutput: string;
      paramCount: number;
      uniqueKeys: number;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeRows(rows: QueryStringBuilderRow[]) {
  return rows
    .map((row) => ({
      key: row.key.trim(),
      value: row.value,
    }))
    .filter((row) => row.key || row.value);
}

export function buildQueryString(rows: QueryStringBuilderRow[]): QueryStringBuilderResult {
  const normalizedRows = normalizeRows(rows);

  if (!normalizedRows.length) {
    return {
      ok: false,
      error: "최소 한 개 이상의 key/value 행을 입력해 주세요.",
    };
  }

  for (const [index, row] of normalizedRows.entries()) {
    if (!row.key) {
      return {
        ok: false,
        error: `${index + 1}번째 행의 key를 입력해 주세요.`,
      };
    }

    if (row.key.includes("\n") || row.key.includes("\r") || row.value.includes("\n") || row.value.includes("\r")) {
      return {
        ok: false,
        error: `${index + 1}번째 행은 single-line key/value만 지원합니다.`,
      };
    }
  }

  const output = normalizedRows.map((row) => `${encodeURIComponent(row.key)}=${encodeURIComponent(row.value)}`).join("&");
  const uniqueKeys = new Set(normalizedRows.map((row) => row.key)).size;

  return {
    ok: true,
    rows: normalizedRows,
    output,
    prefixedOutput: `?${output}`,
    paramCount: normalizedRows.length,
    uniqueKeys,
    copyText: output,
  };
}
