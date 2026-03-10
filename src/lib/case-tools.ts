export type CaseResult =
  | {
      ok: true;
      tokens: string[];
      camelCase: string;
      pascalCase: string;
      snakeCase: string;
      kebabCase: string;
      constantCase: string;
      titleCase: string;
    }
  | {
      ok: false;
      error: string;
    };

function splitCamelBoundaries(input: string) {
  return input.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function tokenize(input: string) {
  return splitCamelBoundaries(input)
    .trim()
    .split(/[^A-Za-z0-9]+/)
    .map((token) => token.toLowerCase())
    .filter(Boolean);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function convertCaseInput(input: string): CaseResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: "변환할 텍스트를 입력해 주세요.",
    };
  }

  const tokens = tokenize(input);
  if (tokens.length === 0) {
    return {
      ok: false,
      error: "영문자 또는 숫자를 포함한 텍스트를 입력해 주세요.",
    };
  }

  const camelCase = tokens[0] + tokens.slice(1).map(capitalize).join("");
  const pascalCase = tokens.map(capitalize).join("");
  const snakeCase = tokens.join("_");
  const kebabCase = tokens.join("-");
  const constantCase = tokens.join("_").toUpperCase();
  const titleCase = tokens.map(capitalize).join(" ");

  return {
    ok: true,
    tokens,
    camelCase,
    pascalCase,
    snakeCase,
    kebabCase,
    constantCase,
    titleCase,
  };
}
