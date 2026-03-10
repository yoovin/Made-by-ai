export type HtmlEntityResult =
  | {
      ok: true;
      output: string;
      action: "encode" | "decode";
      characterCount: number;
    }
  | {
      ok: false;
      error: string;
    };

const encodeMap: Array<[RegExp, string]> = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&#39;"],
];

const namedEntities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  '#39': "'",
};

function normalizeInput(input: string) {
  return input.trim();
}

function decodeNumericEntity(entity: string) {
  const decimal = entity.match(/^#(\d+)$/);
  if (decimal) {
    return String.fromCodePoint(Number.parseInt(decimal[1], 10));
  }
  const hex = entity.match(/^#x([0-9a-f]+)$/i);
  if (hex) {
    return String.fromCodePoint(Number.parseInt(hex[1], 16));
  }
  return null;
}

export function encodeHtmlEntities(input: string): HtmlEntityResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "인코딩할 텍스트를 입력해 주세요.",
    };
  }

  let output = normalized;
  for (const [pattern, replacement] of encodeMap) {
    output = output.replace(pattern, replacement);
  }

  return {
    ok: true,
    output,
    action: "encode",
    characterCount: output.length,
  };
}

export function decodeHtmlEntities(input: string): HtmlEntityResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "디코딩할 텍스트를 입력해 주세요.",
    };
  }

  const output = normalized.replace(/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g, (match, entity) => {
    if (entity in namedEntities) {
      return namedEntities[entity];
    }
    const numeric = decodeNumericEntity(entity);
    return numeric ?? match;
  });

  return {
    ok: true,
    output,
    action: "decode",
    characterCount: output.length,
  };
}
