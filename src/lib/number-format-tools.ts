export type NumberFormatAction = "decimal" | "percent" | "currency";

export type NumberFormatResult =
  | {
      ok: true;
      action: NumberFormatAction;
      output: string;
      locale: string;
      fractionDigits: number;
      currency?: string;
    }
  | {
      ok: false;
      action: NumberFormatAction;
      error: string;
    };

const SUPPORTED_LOCALES = ["en-US", "ko-KR", "de-DE"] as const;
export type NumberFormatLocale = (typeof SUPPORTED_LOCALES)[number];

const SUPPORTED_CURRENCIES = ["USD", "KRW", "EUR", "JPY"] as const;
export type NumberFormatCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function getSupportedNumberLocales() {
  return [...SUPPORTED_LOCALES];
}

export function getSupportedCurrencies() {
  return [...SUPPORTED_CURRENCIES];
}

function parseNumericInput(input: string): { value: number } | { error: string } {
  const normalized = input.trim();

  if (!normalized) {
    return { error: "포맷할 숫자를 입력해 주세요." };
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return { error: "유효한 숫자를 입력해 주세요." };
  }

  return { value };
}

export function formatNumberInput(
  input: string,
  action: NumberFormatAction,
  locale: NumberFormatLocale,
  fractionDigits: number,
  currency?: NumberFormatCurrency
): NumberFormatResult {
  const parsed = parseNumericInput(input);

  if ("error" in parsed) {
    return {
      ok: false,
      action,
      error: parsed.error,
    };
  }

  if (!Number.isInteger(fractionDigits) || fractionDigits < 0 || fractionDigits > 6) {
    return {
      ok: false,
      action,
      error: "소수 자릿수는 0부터 6 사이의 정수만 지원합니다.",
    };
  }

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  };

  if (action === "percent") {
    options.style = "percent";
  }

  if (action === "currency") {
    if (!currency) {
      return {
        ok: false,
        action,
        error: "통화 형식을 선택해 주세요.",
      };
    }

    options.style = "currency";
    options.currency = currency;
  }

  const formatter = new Intl.NumberFormat(locale, options);
  const output = formatter.format(parsed.value);

  return {
    ok: true,
    action,
    output,
    locale,
    fractionDigits,
    currency,
  };
}
