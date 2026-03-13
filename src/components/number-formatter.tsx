"use client";

import { useState } from "react";
import {
  formatNumberInput,
  getSupportedCurrencies,
  getSupportedNumberLocales,
  NumberFormatAction,
  NumberFormatCurrency,
  NumberFormatLocale,
  NumberFormatResult,
} from "@/lib/number-format-tools";

const DECIMAL_EXAMPLE = "1234567.89";
const PERCENT_EXAMPLE = "0.256";
const INVALID_EXAMPLE = "abc";

type CopyStatus = "idle" | "copied" | "error";

const locales = getSupportedNumberLocales();
const currencies = getSupportedCurrencies();

export function NumberFormatter() {
  const [input, setInput] = useState(DECIMAL_EXAMPLE);
  const [locale, setLocale] = useState<NumberFormatLocale>("en-US");
  const [fractionDigits, setFractionDigits] = useState("2");
  const [currency, setCurrency] = useState<NumberFormatCurrency>("USD");
  const [result, setResult] = useState<NumberFormatResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function runFormat(action: NumberFormatAction) {
    setCopyStatus("idle");
    setResult(formatNumberInput(input, action, locale, Number(fractionDigits), currency));
  }

  function handleClear() {
    setInput("");
    setLocale("en-US");
    setFractionDigits("2");
    setCurrency("USD");
    setResult(null);
    setCopyStatus("idle");
  }

  async function handleCopy() {
    if (!result?.ok) {
      return;
    }

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(result.output);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">숫자 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={DECIMAL_EXAMPLE}
      />

      <div className="query-parser-list">
        <label className="query-parser-row">
          <strong>Locale</strong>
          <select value={locale} onChange={(event) => setLocale(event.target.value as NumberFormatLocale)}>
            {locales.map((currentLocale) => (
              <option key={currentLocale} value={currentLocale}>
                {currentLocale}
              </option>
            ))}
          </select>
        </label>
        <label className="query-parser-row">
          <strong>소수 자릿수</strong>
          <input value={fractionDigits} onChange={(event) => setFractionDigits(event.target.value)} inputMode="numeric" />
        </label>
        <label className="query-parser-row">
          <strong>통화</strong>
          <select value={currency} onChange={(event) => setCurrency(event.target.value as NumberFormatCurrency)}>
            {currencies.map((currentCurrency) => (
              <option key={currentCurrency} value={currentCurrency}>
                {currentCurrency}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => runFormat("decimal")}>
          Decimal
        </button>
        <button className="bookmark-submit" type="button" onClick={() => runFormat("percent")}>
          Percent
        </button>
        <button className="bookmark-submit" type="button" onClick={() => runFormat("currency")}>
          Currency
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">Decimal 예시: <code>{DECIMAL_EXAMPLE}</code></p>
        <p className="section-desc">Percent 예시: <code>{PERCENT_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.action}</strong>
                  <span>형식</span>
                </div>
                <div className="kpi">
                  <strong>{result.locale}</strong>
                  <span>locale</span>
                </div>
                <div className="kpi">
                  <strong>{result.fractionDigits}</strong>
                  <span>소수 자릿수</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">포맷된 결과를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.output}</pre>
            </>
          ) : (
            <>
              <h3>포맷할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
