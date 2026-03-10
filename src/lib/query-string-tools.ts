export type QueryRow = {
  key: string;
  value: string;
};

export type QueryParseResult =
  | {
      ok: true;
      rows: QueryRow[];
      normalizedQuery: string;
      totalParams: number;
      uniqueKeys: number;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeInput(input: string) {
  return input.trim();
}

function extractQueryString(input: string) {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return "";
  }

  if (normalized.includes("?")) {
    const questionMarkIndex = normalized.indexOf("?");
    const hashIndex = normalized.indexOf("#", questionMarkIndex);
    return normalized.slice(questionMarkIndex + 1, hashIndex === -1 ? undefined : hashIndex);
  }

  return normalized.replace(/^\?/, "");
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, "%20"));
  } catch {
    throw new Error("유효하지 않은 퍼센트 인코딩 문자열이 포함되어 있습니다.");
  }
}

export function parseQueryStringInput(input: string): QueryParseResult {
  const query = extractQueryString(input);
  if (!query) {
    return {
      ok: false,
      error: "파싱할 URL 또는 쿼리 문자열을 입력해 주세요.",
    };
  }

  try {
    const rows = query.split("&").filter(Boolean).map((segment) => {
      const [rawKey, ...rest] = segment.split("=");
      return {
        key: safeDecode(rawKey ?? ""),
        value: safeDecode(rest.join("=")),
      };
    });

    const normalizedQuery = rows
      .map((row) => `${encodeURIComponent(row.key)}=${encodeURIComponent(row.value)}`)
      .join("&");

    return {
      ok: true,
      rows,
      normalizedQuery,
      totalParams: rows.length,
      uniqueKeys: new Set(rows.map((row) => row.key)).size,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "쿼리 문자열을 파싱할 수 없습니다.",
    };
  }
}
