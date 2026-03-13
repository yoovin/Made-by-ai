import { parseAllDocuments, stringify } from "yaml";

export type YamlJsonAction = "yaml-to-json" | "json-to-yaml";
export type YamlJsonRootType = "object" | "array" | "string" | "number" | "boolean" | "null";

export type YamlJsonResult =
  | {
      ok: true;
      action: YamlJsonAction;
      output: string;
      rootType: YamlJsonRootType;
      lineCount: number;
    }
  | {
      ok: false;
      action: YamlJsonAction;
      error: string;
    };

type JsonCompatibleValue =
  | string
  | number
  | boolean
  | null
  | JsonCompatibleValue[]
  | { [key: string]: JsonCompatibleValue };

function normalizeInput(input: string) {
  return input.trim();
}

function getRootType(value: JsonCompatibleValue): YamlJsonRootType {
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

function sortJsonValue(value: JsonCompatibleValue): JsonCompatibleValue {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, current]) => [key, sortJsonValue(current)])
    );
  }

  return value;
}

function validateJsonCompatible(value: unknown): value is JsonCompatibleValue {
  if (value === null) {
    return true;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => validateJsonCompatible(item));
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).every(([key, current]) => Boolean(key) && validateJsonCompatible(current));
  }

  return false;
}

export function convertJsonToYaml(input: string): YamlJsonResult {
  const normalized = normalizeInput(input);

  if (!normalized) {
    return {
      ok: false,
      action: "json-to-yaml",
      error: "변환할 JSON을 입력해 주세요.",
    };
  }

  try {
    const parsed = JSON.parse(normalized) as unknown;

    if (!validateJsonCompatible(parsed)) {
      return {
        ok: false,
        action: "json-to-yaml",
        error: "JSON 호환 값(object, array, string, number, boolean, null)만 지원합니다.",
      };
    }

    const sorted = sortJsonValue(parsed);
    const output = stringify(sorted, {
      indent: 2,
      sortMapEntries: true,
      defaultStringType: "PLAIN",
    }).trim();

    return {
      ok: true,
      action: "json-to-yaml",
      output,
      rootType: getRootType(sorted),
      lineCount: output.split(/\r?\n/).length,
    };
  } catch (error) {
    return {
      ok: false,
      action: "json-to-yaml",
      error: error instanceof Error ? `유효하지 않은 JSON입니다. ${error.message}` : "유효하지 않은 JSON입니다.",
    };
  }
}

export function convertYamlToJson(input: string): YamlJsonResult {
  const normalized = normalizeInput(input);

  if (!normalized) {
    return {
      ok: false,
      action: "yaml-to-json",
      error: "변환할 YAML을 입력해 주세요.",
    };
  }

  try {
    const documents = parseAllDocuments(normalized);

    if (documents.length !== 1) {
      return {
        ok: false,
        action: "yaml-to-json",
        error: "이번 단계에서는 single-document YAML만 지원합니다.",
      };
    }

    const document = documents[0];

    if (document.errors.length) {
      return {
        ok: false,
        action: "yaml-to-json",
        error: `유효하지 않은 YAML입니다. ${document.errors[0].message}`,
      };
    }

    const parsed = document.toJS() as unknown;

    if (!validateJsonCompatible(parsed)) {
      return {
        ok: false,
        action: "yaml-to-json",
        error: "이번 단계에서는 JSON 호환 YAML만 지원하며, anchors/aliases/custom tags는 포함하지 않습니다.",
      };
    }

    const sorted = sortJsonValue(parsed);
    const output = JSON.stringify(sorted, null, 2);

    return {
      ok: true,
      action: "yaml-to-json",
      output,
      rootType: getRootType(sorted),
      lineCount: output.split(/\r?\n/).length,
    };
  } catch (error) {
    return {
      ok: false,
      action: "yaml-to-json",
      error: error instanceof Error ? `유효하지 않은 YAML입니다. ${error.message}` : "유효하지 않은 YAML입니다.",
    };
  }
}
