export type NumberBaseResult =
  | {
      ok: true;
      inputBase: 2 | 8 | 10 | 16;
      binary: string;
      octal: string;
      decimal: string;
      hexadecimal: string;
    }
  | {
      ok: false;
      error: string;
    };

type SupportedBase = 2 | 8 | 10 | 16;

function normalizeInput(input: string) {
  return input.trim();
}

function detectBase(value: string): { sign: string; digits: string; base: SupportedBase } | null {
  const normalized = normalizeInput(value);
  if (!normalized) {
    return null;
  }

  const sign = normalized.startsWith("-") ? "-" : "";
  const unsigned = sign ? normalized.slice(1) : normalized;

  if (/^0[bB][01]+$/.test(unsigned)) {
    return { sign, digits: unsigned.slice(2), base: 2 };
  }
  if (/^0[oO][0-7]+$/.test(unsigned)) {
    return { sign, digits: unsigned.slice(2), base: 8 };
  }
  if (/^0[xX][0-9a-fA-F]+$/.test(unsigned)) {
    return { sign, digits: unsigned.slice(2), base: 16 };
  }
  if (/^[0-9]+$/.test(unsigned)) {
    return { sign, digits: unsigned, base: 10 };
  }
  return null;
}

function parseBigIntFromBase(digits: string, base: SupportedBase) {
  if (base === 10) {
    return BigInt(digits);
  }

  let result = 0n;
  const radix = BigInt(base);
  for (const char of digits.toLowerCase()) {
    const value = Number.parseInt(char, 16);
    if (Number.isNaN(value) || value >= base) {
      throw new Error("지원하지 않는 자릿수가 포함되어 있습니다.");
    }
    result = result * radix + BigInt(value);
  }
  return result;
}

function formatSigned(value: bigint, base: SupportedBase) {
  const sign = value < 0n ? "-" : "";
  const abs = value < 0n ? -value : value;
  return sign + abs.toString(base);
}

export function convertNumberBase(input: string): NumberBaseResult {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      ok: false,
      error: "변환할 숫자를 입력해 주세요.",
    };
  }

  const detected = detectBase(normalized);
  if (!detected) {
    return {
      ok: false,
      error: "정수만 지원하며 0b/0o/0x 접두사 형식 또는 10진수 숫자를 입력해 주세요.",
    };
  }

  try {
    const parsed = parseBigIntFromBase(detected.digits, detected.base);
    const signed = detected.sign === "-" ? -parsed : parsed;
    return {
      ok: true,
      inputBase: detected.base,
      binary: formatSigned(signed, 2),
      octal: formatSigned(signed, 8),
      decimal: formatSigned(signed, 10),
      hexadecimal: formatSigned(signed, 16),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "진법 변환을 수행할 수 없습니다.",
    };
  }
}
