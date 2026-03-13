export type LineTrimMode = "start" | "end" | "both";

export type LineTrimResult =
  | {
      ok: true;
      output: string;
      totalLines: number;
      changedLines: number;
      blankLinesPreserved: number;
      mode: LineTrimMode;
    }
  | {
      ok: false;
      error: string;
    };

export function trimLineInput(source: string, mode: LineTrimMode): LineTrimResult {
  if (!source.trim()) {
    return {
      ok: false,
      error: "공백을 정리할 텍스트를 입력해 주세요.",
    };
  }

  const lines = source.split(/\r?\n/);
  let changedLines = 0;
  let blankLinesPreserved = 0;

  const output = lines
    .map((line) => {
      if (line.length === 0) {
        blankLinesPreserved += 1;
        return line;
      }

      let next = line;
      if (mode === "start") {
        next = line.replace(/^\s+/, "");
      } else if (mode === "end") {
        next = line.replace(/\s+$/, "");
      } else {
        next = line.trim();
      }

      if (next === "") {
        blankLinesPreserved += 1;
      }
      if (next !== line) {
        changedLines += 1;
      }
      return next;
    })
    .join("\n");

  return {
    ok: true,
    output,
    totalLines: lines.length,
    changedLines,
    blankLinesPreserved,
    mode,
  };
}
