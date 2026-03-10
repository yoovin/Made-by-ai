"use client";

import { useState } from "react";
import { convertTimestampInput, TimestampResult } from "@/lib/timestamp-tools";

const UNIX_SECONDS_EXAMPLE = "1704067200";
const UNIX_MILLISECONDS_EXAMPLE = "1704067200000";
const ISO_EXAMPLE = "2024-01-01T00:00:00Z";
const INVALID_EXAMPLE = "2024-01-01 09:00";

export function TimestampConverter() {
  const [input, setInput] = useState(UNIX_SECONDS_EXAMPLE);
  const [result, setResult] = useState<TimestampResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">타임스탬프 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={UNIX_SECONDS_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(convertTimestampInput(input))}>
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
        <p className="section-desc">Unix 초 예시: <code>{UNIX_SECONDS_EXAMPLE}</code></p>
        <p className="section-desc">Unix 밀리초 예시: <code>{UNIX_MILLISECONDS_EXAMPLE}</code></p>
        <p className="section-desc">ISO 8601 UTC 예시: <code>{ISO_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.inputType}</strong>
                  <span>입력 타입</span>
                </div>
                <div className="kpi">
                  <strong>{result.unixSeconds}</strong>
                  <span>Unix 초</span>
                </div>
                <div className="kpi">
                  <strong>{result.unixMilliseconds}</strong>
                  <span>Unix 밀리초</span>
                </div>
              </div>
              <pre className="json-formatter-output">{result.isoUtc}</pre>
            </>
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
