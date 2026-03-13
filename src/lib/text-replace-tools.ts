export type TextReplaceResult =
  | {
      ok: true;
      output: string;
      replacements: number;
      changed: boolean;
      sourceLength: number;
      outputLength: number;
    }
  | {
      ok: false;
      error: string;
    };

function escapeForLiteralMatch(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function replaceTextLiteral(source: string, find: string, replaceWith: string): TextReplaceResult {
  if (!source) {
    return {
      ok: false,
      error: "치환할 원문 텍스트를 입력해 주세요.",
    };
  }

  if (!find) {
    return {
      ok: false,
      error: "찾을 텍스트를 입력해 주세요.",
    };
  }

  const matcher = new RegExp(escapeForLiteralMatch(find), "g");
  const matches = source.match(matcher);
  const replacements = matches ? matches.length : 0;
  const output = source.replace(matcher, replaceWith);

  return {
    ok: true,
    output,
    replacements,
    changed: output !== source,
    sourceLength: source.length,
    outputLength: output.length,
  };
}
