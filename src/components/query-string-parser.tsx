"use client";

import { useState } from "react";
import { parseQueryStringInput, QueryParseResult } from "@/lib/query-string-tools";

const URL_EXAMPLE = "https://example.com/search?q=made%20by%20ai&tag=hub&tag=local&empty=";
const RAW_EXAMPLE = "page=1&sort=updated_at&draft=false";
const INVALID_EXAMPLE = "bad=%ZZ";

export function QueryStringParser() {
  const [input, setInput] = useState(URL_EXAMPLE);
  const [result, setResult] = useState<QueryParseResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">URL 또는 쿼리 문자열 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={URL_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(parseQueryStringInput(input))}>
          파싱
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
          URL 예시: <code>{URL_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          raw query 예시: <code>{RAW_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          오류 예시: <code>{INVALID_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.totalParams}</strong>
                  <span>전체 파라미터</span>
                </div>
                <div className="kpi">
                  <strong>{result.uniqueKeys}</strong>
                  <span>고유 키 수</span>
                </div>
              </div>
              <pre className="json-formatter-output">{result.normalizedQuery}</pre>
              <div className="query-parser-list">
                {result.rows.map((row, index) => (
                  <div className="query-parser-row" key={`${row.key}-${row.value}-${index}`}>
                    <strong>{row.key || "(empty key)"}</strong>
                    <span>{row.value || "(empty value)"}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3>파싱할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
