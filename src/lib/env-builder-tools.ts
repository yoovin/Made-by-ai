export type EnvBuilderRow = {
  key: string;
  value: string;
};

export type EnvBuilderResult =
  | {
      ok: true;
      rows: EnvBuilderRow[];
      variableCount: number;
      output: string;
      jsonPreview: string;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

const ENV_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

function escapeEnvValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function buildEnvOutput(rows: EnvBuilderRow[]): EnvBuilderResult {
  const normalizedRows = rows
    .map((row) => ({
      key: row.key.trim(),
      value: row.value,
    }))
    .filter((row) => row.key || row.value);

  if (!normalizedRows.length) {
    return {
      ok: false,
      error: "최소 한 개 이상의 key/value 행을 입력해 주세요.",
    };
  }

  const seenKeys = new Set<string>();
  const jsonPreview: Record<string, string> = {};

  for (const [index, row] of normalizedRows.entries()) {
    if (!ENV_KEY_PATTERN.test(row.key)) {
      return {
        ok: false,
        error: `${index + 1}번째 행의 키가 유효하지 않습니다. 키는 영문자 또는 '_' 로 시작해야 합니다.`,
      };
    }

    if (seenKeys.has(row.key)) {
      return {
        ok: false,
        error: `${index + 1}번째 행의 키 \`${row.key}\` 가 중복되었습니다.`,
      };
    }

    if (row.value.includes("\n") || row.value.includes("\r")) {
      return {
        ok: false,
        error: `${index + 1}번째 행의 값은 single-line 문자열만 지원합니다.`,
      };
    }

    seenKeys.add(row.key);
    jsonPreview[row.key] = row.value;
  }

  const output = normalizedRows.map((row) => `${row.key}="${escapeEnvValue(row.value)}"`).join("\n");

  return {
    ok: true,
    rows: normalizedRows,
    variableCount: normalizedRows.length,
    output,
    jsonPreview: JSON.stringify(jsonPreview, null, 2),
    copyText: output,
  };
}
