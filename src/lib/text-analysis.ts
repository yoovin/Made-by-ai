export type TextStats = {
  characters: number;
  nonWhitespaceCharacters: number;
  words: number;
  lines: number;
};

export function analyzeText(input: string): TextStats {
  if (!input) {
    return {
      characters: 0,
      nonWhitespaceCharacters: 0,
      words: 0,
      lines: 0,
    };
  }

  const trimmed = input.trim();

  return {
    characters: input.length,
    nonWhitespaceCharacters: input.replace(/\s/g, "").length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: input.split(/\r?\n/).length,
  };
}
