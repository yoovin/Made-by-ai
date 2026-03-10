"use client";

import { useState } from "react";
import { formatJsonInput, JsonFormatResult } from "@/lib/json-tools";

const VALID_EXAMPLE = '{"name":"Made by AI","items":[1,true,null]}';
const INVALID_EXAMPLE = '{"name":}';

export function JsonFormatter() {
  const [input, setInput] = useState(VALID_EXAMPLE);
  const [result, setResult] = useState<JsonFormatResult | null>(null);

  function handleFormat() {
    setResult(formatJsonInput(input));
  }

  function handleValidate() {
    setResult(formatJsonInput(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  return (
    <section className="panel">
      <h2 className="section-title">JSON 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={VALID_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleFormat}>
          포맷
        </button>
        <button className="bookmark-submit" type="button" onClick={handleValidate}>
          검증
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">유효 예시: <code>{VALID_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>유효한 JSON</strong>
                  <span>검증 상태</span>
                </div>
                <div className="kpi">
                  <strong>{result.rootType}</strong>
                  <span>루트 타입</span>
                </div>
                <div className="kpi">
                  <strong>{result.lineCount}</strong>
                  <span>줄 수</span>
                </div>
                <div className="kpi">
                  <strong>{result.characterCount}</strong>
                  <span>문자 수</span>
                </div>
              </div>
              <pre className="json-formatter-output">{result.formatted}</pre>
            </>
          ) : (
            <>
              <h3>유효하지 않은 JSON</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
