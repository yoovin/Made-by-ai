"use client";

import { useState } from "react";
import { escapeRegexInput, RegexEscapeResult } from "@/lib/regex-tools";

const MAIN_EXAMPLE = "hello.*(world)?";
const SLASH_EXAMPLE = "a/b";

export function RegexEscape() {
  const [input, setInput] = useState(MAIN_EXAMPLE);
  const [result, setResult] = useState<RegexEscapeResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={MAIN_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(escapeRegexInput(input))}>
          이스케이프
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
        <p className="section-desc">
          일반 예시: <code>{MAIN_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          slash 예시: <code>{SLASH_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.characterCount}</strong>
                  <span>출력 길이</span>
                </div>
              </div>
              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>Regex source</strong>
                  <span>{result.escapedSource}</span>
                </div>
                <div className="query-parser-row">
                  <strong>JavaScript regex literal preview</strong>
                  <span>{result.jsLiteralPreview}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3>이스케이프할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
