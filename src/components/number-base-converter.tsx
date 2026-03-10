"use client";

import { useState } from "react";
import { convertNumberBase, NumberBaseResult } from "@/lib/number-base-tools";

const DECIMAL_EXAMPLE = "42";
const HEX_EXAMPLE = "0xff";
const NEGATIVE_EXAMPLE = "-15";
const INVALID_EXAMPLE = "0b102";

export function NumberBaseConverter() {
  const [input, setInput] = useState(DECIMAL_EXAMPLE);
  const [result, setResult] = useState<NumberBaseResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">숫자 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={DECIMAL_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(convertNumberBase(input))}>
          변환
        </button>
        <button
          className="bookmark-remove"
          type="button"
          onClick={() => {
            setInput("");
            setResult(null);
          }}
        >
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">10진수 예시: <code>{DECIMAL_EXAMPLE}</code></p>
        <p className="section-desc">16진수 예시: <code>{HEX_EXAMPLE}</code></p>
        <p className="section-desc">음수 예시: <code>{NEGATIVE_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <div className="case-result-grid">
              <div className="kpi"><strong>{result.inputBase}</strong><span>입력 진법</span></div>
              <div className="kpi"><strong>{result.binary}</strong><span>2진수</span></div>
              <div className="kpi"><strong>{result.octal}</strong><span>8진수</span></div>
              <div className="kpi"><strong>{result.decimal}</strong><span>10진수</span></div>
              <div className="kpi"><strong>{result.hexadecimal}</strong><span>16진수</span></div>
            </div>
          ) : (
            <>
              <h3>변환할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
