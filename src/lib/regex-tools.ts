export type RegexEscapeResult =
  | {
      ok: true;
      escapedSource: string;
      jsLiteralPreview: string;
      characterCount: number;
    }
  | {
      ok: false;
      error: string;
    };

function escapeRegexSource(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function escapeRegexInput(input: string): RegexEscapeResult {
  if (input.length === 0) {
    return {
      ok: false,
      error: "이스케이프할 텍스트를 입력해 주세요.",
    };
  }

  const escapedSource = escapeRegexSource(input);
  return {
    ok: true,
    escapedSource,
    jsLiteralPreview: `/${escapedSource.replace(/\//g, "\\/")}/`,
    characterCount: escapedSource.length,
  };
}
