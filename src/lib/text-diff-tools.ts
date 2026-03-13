export type TextDiffResult =
  | {
      ok: true;
      identical: boolean;
      leftCharacters: number;
      rightCharacters: number;
      leftLines: number;
      rightLines: number;
      firstDifference:
        | {
            line: number;
            column: number;
            leftLine: string;
            rightLine: string;
          }
        | null;
      rows: Array<{
        line: number;
        type: "same" | "changed" | "added" | "removed";
        leftLine: string;
        rightLine: string;
      }>;
    }
  | {
      ok: false;
      error: string;
    };

type FirstDifference = {
  line: number;
  column: number;
  leftLine: string;
  rightLine: string;
} | null;

function splitLines(value: string) {
  return value.split("\n");
}

function normalizeNewlines(value: string) {
  return value.replace(/\r\n/g, "\n");
}

export function compareTextInputs(left: string, right: string): TextDiffResult {
  if (!left.trim() || !right.trim()) {
    return {
      ok: false,
      error: "비교할 텍스트를 두 칸 모두 입력해 주세요.",
    };
  }

  const normalizedLeft = normalizeNewlines(left);
  const normalizedRight = normalizeNewlines(right);
  const leftLines = splitLines(normalizedLeft);
  const rightLines = splitLines(normalizedRight);
  const maxLines = Math.max(leftLines.length, rightLines.length);
  const rows: Array<{
    line: number;
    type: "same" | "changed" | "added" | "removed";
    leftLine: string;
    rightLine: string;
  }> = [];

  let firstDifference: FirstDifference = null;

  if (normalizedLeft !== normalizedRight) {
    for (let lineIndex = 0; lineIndex < maxLines; lineIndex += 1) {
      const leftLine = leftLines[lineIndex] ?? "";
      const rightLine = rightLines[lineIndex] ?? "";
      if (leftLine === rightLine) {
        continue;
      }

      const maxColumns = Math.max(leftLine.length, rightLine.length);
      let differenceColumn = 1;
      for (let columnIndex = 0; columnIndex < maxColumns; columnIndex += 1) {
        if ((leftLine[columnIndex] ?? "") !== (rightLine[columnIndex] ?? "")) {
          differenceColumn = columnIndex + 1;
          break;
        }
      }

      firstDifference = {
        line: lineIndex + 1,
        column: differenceColumn,
        leftLine,
        rightLine,
      };
      break;
    }
  }

  for (let lineIndex = 0; lineIndex < maxLines; lineIndex += 1) {
    const leftLine = leftLines[lineIndex] ?? "";
    const rightLine = rightLines[lineIndex] ?? "";

    let type: "same" | "changed" | "added" | "removed" = "same";

    if (leftLine === rightLine) {
      type = "same";
    } else if (!leftLine) {
      type = "added";
    } else if (!rightLine) {
      type = "removed";
    } else {
      type = "changed";
    }

    rows.push({
      line: lineIndex + 1,
      type,
      leftLine,
      rightLine,
    });
  }

  return {
    ok: true,
    identical: normalizedLeft === normalizedRight,
    leftCharacters: normalizedLeft.length,
    rightCharacters: normalizedRight.length,
    leftLines: leftLines.length,
    rightLines: rightLines.length,
    firstDifference,
    rows,
  };
}
