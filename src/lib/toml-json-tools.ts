import { parse, stringify } from "@iarna/toml";

type TomlDocument = Parameters<typeof stringify>[0];
type TomlValue = TomlDocument[string];

export type TomlJsonAction = "toml-to-json" | "json-to-toml";
export type TomlJsonRootType = "object";

export type TomlJsonResult =
  | {
      ok: true;
      action: TomlJsonAction;
      output: string;
      rootType: TomlJsonRootType;
      lineCount: number;
      topLevelKeys: number;
    }
  | {
      ok: false;
      action: TomlJsonAction;
      error: string;
    };

type JsonPrimitive = string | number | boolean;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonPrimitive[] | JsonObject[];
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

function normalizeInput(input: string) {
  return input.trim();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function sortJsonValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map((item) => (isPlainObject(item) ? sortJsonObject(item as JsonObject) : item)) as JsonArray;
  }

  if (isPlainObject(value)) {
    return sortJsonObject(value as JsonObject);
  }

  return value;
}

function sortJsonObject(value: JsonObject): JsonObject {
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, current]) => [key, sortJsonValue(current)])
  );
}

function isTomlDatetimeCandidate(value: unknown) {
  return value instanceof Date;
}

function validateTomlCompatibleJson(value: unknown): value is JsonValue {
  if (typeof value === "string") {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "boolean") {
    return true;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return true;
    }

    if (value.every((item) => typeof item === "string")) {
      return true;
    }

    if (value.every((item) => isFiniteNumber(item))) {
      return true;
    }

    if (value.every((item) => typeof item === "boolean")) {
      return true;
    }

    if (value.every((item) => isPlainObject(item) && validateTomlCompatibleJson(item))) {
      return true;
    }

    return false;
  }

  if (isPlainObject(value)) {
    return Object.values(value).every((item) => validateTomlCompatibleJson(item));
  }

  return false;
}

function toTomlValue(value: JsonValue): TomlValue {
  if (Array.isArray(value)) {
    if (value.every((item) => isPlainObject(item))) {
      return value.map((item) => toTomlDocument(item as JsonObject));
    }

    if (value.every((item) => typeof item === "string")) {
      return value as string[];
    }

    if (value.every((item) => isFiniteNumber(item))) {
      return value as number[];
    }

    if (value.every((item) => typeof item === "boolean")) {
      return value as boolean[];
    }

    throw new Error("이번 단계에서는 mixed array를 TOML로 변환할 수 없습니다.");
  }

  if (isPlainObject(value)) {
    return toTomlDocument(value as JsonObject);
  }

  return value;
}

function toTomlDocument(value: JsonObject): TomlDocument {
  const document: TomlDocument = {};

  Object.entries(value).forEach(([key, current]) => {
    document[key] = toTomlValue(current);
  });

  return document;
}

function validateJsonCompatibleToml(value: unknown): value is JsonValue | { [key: string]: JsonValue } {
  if (isTomlDatetimeCandidate(value)) {
    return false;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return Number.isFinite(value as number) || typeof value !== "number";
  }

  if (Array.isArray(value)) {
    return value.every((item) => validateJsonCompatibleToml(item));
  }

  if (isPlainObject(value)) {
    return Object.values(value).every((item) => validateJsonCompatibleToml(item));
  }

  return false;
}

export function convertTomlToJson(input: string): TomlJsonResult {
  const normalized = normalizeInput(input);

  if (!normalized) {
    return {
      ok: false,
      action: "toml-to-json",
      error: "변환할 TOML을 입력해 주세요.",
    };
  }

  try {
    const parsed = parse(normalized) as unknown;

    if (!isPlainObject(parsed)) {
      return {
        ok: false,
        action: "toml-to-json",
        error: "이번 단계에서는 TOML document root object만 지원합니다.",
      };
    }

    if (!validateJsonCompatibleToml(parsed)) {
      return {
        ok: false,
        action: "toml-to-json",
        error: "이번 단계에서는 TOML datetime/date/time과 JSON 비호환 값을 지원하지 않습니다.",
      };
    }

    const sorted = sortJsonObject(parsed as JsonObject);
    const output = JSON.stringify(sorted, null, 2);

    return {
      ok: true,
      action: "toml-to-json",
      output,
      rootType: "object",
      lineCount: output.split(/\r?\n/).length,
      topLevelKeys: Object.keys(sorted).length,
    };
  } catch (error) {
    return {
      ok: false,
      action: "toml-to-json",
      error: error instanceof Error ? `유효하지 않은 TOML입니다. ${error.message}` : "유효하지 않은 TOML입니다.",
    };
  }
}

export function convertJsonToToml(input: string): TomlJsonResult {
  const normalized = normalizeInput(input);

  if (!normalized) {
    return {
      ok: false,
      action: "json-to-toml",
      error: "변환할 JSON을 입력해 주세요.",
    };
  }

  try {
    const parsed = JSON.parse(normalized) as unknown;

    if (!isPlainObject(parsed)) {
      return {
        ok: false,
        action: "json-to-toml",
        error: "이번 단계에서는 JSON object root만 TOML로 변환할 수 있습니다.",
      };
    }

    if (!validateTomlCompatibleJson(parsed)) {
      return {
        ok: false,
        action: "json-to-toml",
        error: "JSON null, non-finite number, 또는 TOML 비호환 값은 이번 단계에서 지원하지 않습니다.",
      };
    }

    const sorted = sortJsonObject(parsed as JsonObject);
    const output = stringify(toTomlDocument(sorted)).trim();

    return {
      ok: true,
      action: "json-to-toml",
      output,
      rootType: "object",
      lineCount: output.split(/\r?\n/).length,
      topLevelKeys: Object.keys(sorted).length,
    };
  } catch (error) {
    return {
      ok: false,
      action: "json-to-toml",
      error: error instanceof Error ? `유효하지 않은 JSON입니다. ${error.message}` : "유효하지 않은 JSON입니다.",
    };
  }
}
