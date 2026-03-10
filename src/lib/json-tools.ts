export type JsonRootType = "object" | "array" | "string" | "number" | "boolean" | "null";

export type JsonFormatResult =
  | {
      ok: true;
      formatted: string;
      rootType: JsonRootType;
      lineCount: number;
      characterCount: number;
    }
  | {
      ok: false;
      error: string;
    };

function getRootType(value: unknown): JsonRootType {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "object";
  }
}

export function formatJsonInput(input: string): JsonFormatResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: "JSON을 입력해 주세요.",
    };
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const formatted = JSON.stringify(parsed, null, 2);
    return {
      ok: true,
      formatted,
      rootType: getRootType(parsed),
      lineCount: formatted.split(/\r?\n/).length,
      characterCount: formatted.length,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? `유효하지 않은 JSON입니다. ${error.message}` : "유효하지 않은 JSON입니다.",
    };
  }
}
