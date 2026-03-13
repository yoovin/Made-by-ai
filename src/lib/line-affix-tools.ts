export type LineAffixResult =
  | {
      ok: true;
      output: string;
      totalLines: number;
      transformedLines: number;
      emptyLinesPreserved: number;
      outputLength: number;
    }
  | {
      ok: false;
      error: string;
    };

export function applyLineAffixes(source: string, prefix: string, suffix: string): LineAffixResult {
  if (!source.trim()) {
    return {
      ok: false,
      error: "접두/접미를 적용할 텍스트를 입력해 주세요.",
    };
  }

  if (!prefix && !suffix) {
    return {
      ok: false,
      error: "접두나 접미 중 하나는 입력해 주세요.",
    };
  }

  const lines = source.split(/\r?\n/);
  let transformedLines = 0;
  let emptyLinesPreserved = 0;

  const output = lines
    .map((line) => {
      if (!line.trim()) {
        emptyLinesPreserved += 1;
        return line;
      }
      transformedLines += 1;
      return `${prefix}${line}${suffix}`;
    })
    .join("\n");

  return {
    ok: true,
    output,
    totalLines: lines.length,
    transformedLines,
    emptyLinesPreserved,
    outputLength: output.length,
  };
}
