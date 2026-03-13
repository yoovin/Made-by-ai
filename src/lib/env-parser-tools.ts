export type EnvParseRow = {
  key: string;
  value: string;
  line: number;
  duplicate: boolean;
  normalizedAssignment: string;
};

export type EnvParseResult =
  | {
      ok: true;
      rows: EnvParseRow[];
      variableCount: number;
      duplicateCount: number;
      sourceLineCount: number;
      normalizedOutput: string;
      jsonPreview: string;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

const ENV_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

function normalizeInput(input: string) {
  return input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function parseLine(rawLine: string, lineNumber: number): { key: string; value: string; normalizedAssignment: string } | { error: string } | null {
  const trimmed = rawLine.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = rawLine.indexOf("=");

  if (separatorIndex === -1) {
    return { error: `line ${lineNumber}: '=' 구분자가 없는 줄은 파싱할 수 없습니다.` };
  }

  const rawKey = rawLine.slice(0, separatorIndex).trim();
  const rawValue = rawLine.slice(separatorIndex + 1).trim();

  if (!ENV_KEY_PATTERN.test(rawKey)) {
    return { error: `line ${lineNumber}: 유효하지 않은 키입니다. 키는 영문자 또는 '_' 로 시작해야 합니다.` };
  }

  if ((rawValue.startsWith('"') && !rawValue.endsWith('"')) || (rawValue.startsWith("'") && !rawValue.endsWith("'"))) {
    return { error: `line ${lineNumber}: 닫히지 않은 인용부호가 있습니다.` };
  }

  let parsedValue = rawValue;

  if ((rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
    parsedValue = rawValue.slice(1, -1);
  }

  return {
    key: rawKey,
    value: parsedValue,
    normalizedAssignment: `${rawKey}=${rawValue}`,
  };
}

export function parseEnvInput(input: string): EnvParseResult {
  const normalized = normalizeInput(input);

  if (!normalized.trim()) {
    return {
      ok: false,
      error: "파싱할 ENV 내용을 입력해 주세요.",
    };
  }

  const lines = normalized.split("\n");
  const rows: EnvParseRow[] = [];
  const duplicates = new Set<string>();
  const seenKeys = new Set<string>();
  const jsonObject: Record<string, string> = {};

  for (const [index, rawLine] of lines.entries()) {
    const parsed = parseLine(rawLine, index + 1);

    if (!parsed) {
      continue;
    }

    if ("error" in parsed) {
      return {
        ok: false,
        error: parsed.error,
      };
    }

    const duplicate = seenKeys.has(parsed.key);
    if (duplicate) {
      duplicates.add(parsed.key);
    }

    seenKeys.add(parsed.key);
    jsonObject[parsed.key] = parsed.value;

    rows.push({
      key: parsed.key,
      value: parsed.value,
      line: index + 1,
      duplicate,
      normalizedAssignment: parsed.normalizedAssignment,
    });
  }

  if (!rows.length) {
    return {
      ok: false,
      error: "파싱 가능한 ENV assignment가 없습니다.",
    };
  }

  const normalizedOutput = rows.map((row) => row.normalizedAssignment).join("\n");
  const jsonPreview = JSON.stringify(jsonObject, null, 2);

  return {
    ok: true,
    rows,
    variableCount: rows.length,
    duplicateCount: duplicates.size,
    sourceLineCount: lines.length,
    normalizedOutput,
    jsonPreview,
    copyText: jsonPreview,
  };
}
