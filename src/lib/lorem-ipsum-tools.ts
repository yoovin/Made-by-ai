export type LoremMode = "paragraphs" | "sentences" | "words";

export type LoremIpsumResult =
  | {
      ok: true;
      mode: LoremMode;
      count: number;
      output: string;
      characterCount: number;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

const CORPUS = [
  "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

const WORDS = CORPUS.join(" ").replace(/\./g, "").split(/\s+/).filter(Boolean);

function validateCount(countInput: string): { value: number } | { error: string } {
  const value = Number(countInput.trim());

  if (!Number.isInteger(value) || value < 1 || value > 20) {
    return { error: "생성 개수는 1부터 20 사이의 정수만 지원합니다." };
  }

  return { value };
}

export function generateLoremIpsum(mode: LoremMode, countInput: string): LoremIpsumResult {
  const validated = validateCount(countInput);

  if ("error" in validated) {
    return { ok: false, error: validated.error };
  }

  const count = validated.value;
  let output = "";

  if (mode === "paragraphs") {
    const paragraphs = Array.from({ length: count }, (_, index) => CORPUS[index % CORPUS.length]);
    output = paragraphs.join("\n\n");
  }

  if (mode === "sentences") {
    const sentences = Array.from({ length: count }, (_, index) => CORPUS[index % CORPUS.length]);
    output = sentences.join(" ");
  }

  if (mode === "words") {
    const words = Array.from({ length: count }, (_, index) => WORDS[index % WORDS.length]);
    output = words.join(" ");
  }

  return {
    ok: true,
    mode,
    count,
    output,
    characterCount: output.length,
    copyText: output,
  };
}
