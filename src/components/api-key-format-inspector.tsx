"use client";

import { useState } from "react";
import { ApiKeyFormatResult, identifyApiKeyFormat } from "@/lib/api-key-format-tools";

const VALID_EXAMPLE = "ghp_123456789012345678901234567890123456";
const UNKNOWN_EXAMPLE = "sk-ambiguous-openai-style-value";

export function ApiKeyFormatInspector() {
  const [input, setInput] = useState(VALID_EXAMPLE);
  const [result, setResult] = useState<ApiKeyFormatResult | null>(null);

  function handleInspect() {
    setResult(identifyApiKeyFormat(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  return (
    <section className="panel">
      <h2 className="section-title">키 문자열 입력</h2>
      <p className="section-desc">pattern-based format identification만 수행하며 실제 유효성, 권한, 소유 여부는 검증하지 않습니다.</p>

      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={VALID_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>
          형식 판별
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          예시: <code>{VALID_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          unknown 예시: <code>{UNKNOWN_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.summary.providerLabel}</strong>
                  <span>provider</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.formatLabel}</strong>
                  <span>format</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.confidence}</strong>
                  <span>confidence</span>
                </div>
              </div>

              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>class</strong>
                  <span>{result.summary.tokenClass}</span>
                </div>
                <div className="query-parser-row">
                  <strong>length</strong>
                  <span>{result.summary.length}</span>
                </div>
                <div className="query-parser-row">
                  <strong>preview</strong>
                  <span>{result.summary.prefixPreview}</span>
                </div>
              </div>

              <div className="query-parser-list">
                {result.summary.notes.map((note) => (
                  <div className="query-parser-row" key={note}>
                    <strong>note</strong>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3>형식을 판별할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
