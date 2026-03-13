export type JsonCsvAction = "json-to-csv" | "csv-to-json";

export type JsonCsvResult =
  | {
      ok: true;
      action: JsonCsvAction;
      output: string;
      rowCount: number;
      columnCount: number;
      columns: string[];
    }
  | {
      ok: false;
      action: JsonCsvAction;
      error: string;
    };

type JsonScalar = string | number | boolean;
type JsonRecord = Record<string, JsonScalar | undefined>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeInput(input: string) {
  return input.trim();
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function stringifyScalar(value: JsonScalar) {
  return String(value);
}

function parseJsonRecords(input: string): { records: JsonRecord[]; columns: string[] } | { error: string } {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input) as unknown;
  } catch (error) {
    return {
      error: error instanceof Error ? `유효하지 않은 JSON입니다. ${error.message}` : "유효하지 않은 JSON입니다.",
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      error: "최상위 JSON은 평면 객체 배열이어야 합니다.",
    };
  }

  if (parsed.length === 0) {
    return {
      error: "최소 한 개 이상의 객체가 있는 JSON 배열을 입력해 주세요.",
    };
  }

  const columns: string[] = [];
  const seenColumns = new Set<string>();
  const records: JsonRecord[] = [];

  for (const [index, item] of parsed.entries()) {
    if (!isPlainObject(item)) {
      return {
        error: `${index + 1}번째 항목이 객체가 아닙니다. 평면 객체 배열만 지원합니다.`,
      };
    }

    const record: JsonRecord = {};

    for (const [key, value] of Object.entries(item)) {
      if (!key) {
        return {
          error: `${index + 1}번째 항목에 빈 키가 있습니다.`,
        };
      }

      if (value === null || Array.isArray(value) || isPlainObject(value)) {
        return {
          error: `${index + 1}번째 항목의 \`${key}\` 값은 문자열/숫자/불리언만 지원합니다.`,
        };
      }

      if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
        return {
          error: `${index + 1}번째 항목의 \`${key}\` 값 형식은 지원하지 않습니다.`,
        };
      }

      record[key] = value;

      if (!seenColumns.has(key)) {
        seenColumns.add(key);
        columns.push(key);
      }
    }

    records.push(record);
  }

  if (columns.length === 0) {
    return {
      error: "최소 한 개 이상의 키가 있는 객체 배열을 입력해 주세요.",
    };
  }

  return { records, columns };
}

function parseCsvRows(input: string): { headers: string[]; rows: string[][] } | { error: string } {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (inQuotes) {
    return {
      error: "CSV 따옴표가 닫히지 않았습니다.",
    };
  }

  row.push(field);
  rows.push(row);

  const filteredRows = rows.filter((currentRow, index) => {
    if (index === rows.length - 1) {
      return currentRow.some((cell) => cell.length > 0);
    }
    return true;
  });

  if (filteredRows.length < 2) {
    return {
      error: "헤더와 한 개 이상의 데이터 행이 있는 CSV를 입력해 주세요.",
    };
  }

  const headers = filteredRows[0].map((header) => header.trim());
  const seenHeaders = new Set<string>();

  for (const header of headers) {
    if (!header) {
      return {
        error: "CSV 헤더에는 빈 열 이름을 사용할 수 없습니다.",
      };
    }

    if (seenHeaders.has(header)) {
      return {
        error: `CSV 헤더 \`${header}\` 가 중복되었습니다.`,
      };
    }

    seenHeaders.add(header);
  }

  const dataRows = filteredRows.slice(1);

  for (const [index, dataRow] of dataRows.entries()) {
    if (dataRow.length !== headers.length) {
      return {
        error: `${index + 1}번째 데이터 행의 열 수가 헤더와 다릅니다.`,
      };
    }
  }

  return { headers, rows: dataRows };
}

export function convertJsonToCsv(input: string): JsonCsvResult {
  const normalized = normalizeInput(input);

  if (!normalized) {
    return {
      ok: false,
      action: "json-to-csv",
      error: "변환할 JSON을 입력해 주세요.",
    };
  }

  const parsed = parseJsonRecords(normalized);

  if ("error" in parsed) {
    return {
      ok: false,
      action: "json-to-csv",
      error: parsed.error,
    };
  }

  const csvRows = [
    parsed.columns.map(escapeCsvCell).join(","),
    ...parsed.records.map((record) =>
      parsed.columns
        .map((column) => escapeCsvCell(column in record && record[column] !== undefined ? stringifyScalar(record[column] as JsonScalar) : ""))
        .join(",")
    ),
  ];

  return {
    ok: true,
    action: "json-to-csv",
    output: csvRows.join("\n"),
    rowCount: parsed.records.length,
    columnCount: parsed.columns.length,
    columns: parsed.columns,
  };
}

export function convertCsvToJson(input: string): JsonCsvResult {
  const normalized = normalizeInput(input);

  if (!normalized) {
    return {
      ok: false,
      action: "csv-to-json",
      error: "변환할 CSV를 입력해 주세요.",
    };
  }

  const parsed = parseCsvRows(input);

  if ("error" in parsed) {
    return {
      ok: false,
      action: "csv-to-json",
      error: parsed.error,
    };
  }

  const records = parsed.rows.map((row) => {
    const record: Record<string, string> = {};
    parsed.headers.forEach((header, index) => {
      record[header] = row[index];
    });
    return record;
  });

  return {
    ok: true,
    action: "csv-to-json",
    output: JSON.stringify(records, null, 2),
    rowCount: records.length,
    columnCount: parsed.headers.length,
    columns: parsed.headers,
  };
}
