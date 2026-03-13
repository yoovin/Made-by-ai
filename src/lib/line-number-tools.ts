export type LineNumberResult =
  | {
      ok: true;
      output: string;
      totalLines: number;
      numberedLines: number;
      blankLinesPreserved: number;
      startNumber: number;
      endNumber: number;
    }
  | {
      ok: false;
      error: string;
    };

export function addLineNumbers(source: string, startNumberRaw: string, separator: string): LineNumberResult {
  if (!source.trim()) {
    return {
      ok: false,
      error: "번호를 붙일 텍스트를 입력해 주세요.",
    };
  }

  const parsedStartNumber = Number(startNumberRaw.trim());
  if (!startNumberRaw.trim() || !Number.isInteger(parsedStartNumber)) {
    return {
      ok: false,
      error: "시작 번호는 정수로 입력해 주세요.",
    };
  }

  const lines = source.split(/\r?\n/);
  let currentNumber = parsedStartNumber;
  let numberedLines = 0;
  let blankLinesPreserved = 0;

  const output = lines
    .map((line) => {
      if (!line.trim()) {
        blankLinesPreserved += 1;
        return line;
      }

      const numberedLine = `${currentNumber}${separator}${line}`;
      currentNumber += 1;
      numberedLines += 1;
      return numberedLine;
    })
    .join("\n");

  return {
    ok: true,
    output,
    totalLines: lines.length,
    numberedLines,
    blankLinesPreserved,
    startNumber: parsedStartNumber,
    endNumber: currentNumber - 1,
  };
}
