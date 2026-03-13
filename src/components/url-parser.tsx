"use client";

import { useState } from "react";
import { parseUrlInput, UrlParserResult } from "@/lib/url-parser-tools";

const URL_EXAMPLE = "https://example.com/docs?page=1&tag=hub&tag=local#details";
const ZERO_QUERY_EXAMPLE = "https://example.com/docs";
const INVALID_EXAMPLE = "example.com/docs";

type CopyStatus = "idle" | "copied" | "error";

export function UrlParser() {
  const [input, setInput] = useState(URL_EXAMPLE);
  const [result, setResult] = useState<UrlParserResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleParse() {
    setCopyStatus("idle");
    setResult(parseUrlInput(input));
  }

  function handleClear() {
    setInput("");
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
      await navigator.clipboard.writeText(result.copyText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">URL 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={URL_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleParse}>
          파싱
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">URL 예시: <code>{URL_EXAMPLE}</code></p>
        <p className="section-desc">query 없는 예시: <code>{ZERO_QUERY_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.query.totalParams}</strong>
                  <span>전체 파라미터</span>
                </div>
                <div className="kpi">
                  <strong>{result.query.uniqueKeys}</strong>
                  <span>고유 키 수</span>
                </div>
              </div>
              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>origin</strong>
                  <span>{result.origin}</span>
                </div>
                <div className="query-parser-row">
                  <strong>pathname</strong>
                  <span>{result.pathname}</span>
                </div>
                <div className="query-parser-row">
                  <strong>hash</strong>
                  <span>{result.hash || "(empty hash)"}</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">정규화된 URL을 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.normalizedUrl}</pre>
              <pre className="json-formatter-output">{result.query.normalizedQuery || "(empty query)"}</pre>
              <div className="query-parser-list">
                {result.query.rows.map((row, index) => (
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
