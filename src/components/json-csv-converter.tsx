"use client";

import { useState } from "react";
import { convertCsvToJson, convertJsonToCsv, JsonCsvResult } from "@/lib/json-csv-tools";

const JSON_EXAMPLE = '[{"name":"alpha","role":"admin","active":true},{"name":"beta","role":"editor","active":false}]';
const CSV_EXAMPLE = 'name,role,active\nalpha,admin,true\nbeta,editor,false';
const INVALID_EXAMPLE = '[{"name":"alpha","meta":{"team":"ops"}}]';

type CopyStatus = "idle" | "copied" | "error";

export function JsonCsvConverter() {
  const [input, setInput] = useState(JSON_EXAMPLE);
  const [result, setResult] = useState<JsonCsvResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleJsonToCsv() {
    setCopyStatus("idle");
    setResult(convertJsonToCsv(input));
  }

  function handleCsvToJson() {
    setCopyStatus("idle");
    setResult(convertCsvToJson(input));
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
      await navigator.clipboard.writeText(result.output);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">JSON 또는 CSV 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={JSON_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleJsonToCsv}>
          JSON → CSV
        </button>
        <button className="bookmark-submit" type="button" onClick={handleCsvToJson}>
          CSV → JSON
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          JSON 예시: <code>{JSON_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          CSV 예시: <code>{CSV_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          지원하지 않는 예시: <code>{INVALID_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.action === "json-to-csv" ? "JSON → CSV 완료" : "CSV → JSON 완료"}</strong>
                  <span>실행 결과</span>
                </div>
                <div className="kpi">
                  <strong>{result.rowCount}</strong>
                  <span>데이터 행 수</span>
                </div>
                <div className="kpi">
                  <strong>{result.columnCount}</strong>
                  <span>열 수</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? (
                <p className="section-desc">
                  {result.action === "json-to-csv"
                    ? "CSV 결과를 클립보드에 복사했습니다."
                    : "JSON 결과를 클립보드에 복사했습니다."}
                </p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
              <pre className="json-formatter-output">{result.output}</pre>
              <div className="query-parser-list">
                {result.columns.map((column) => (
                  <div className="query-parser-row" key={column}>
                    <strong>열</strong>
                    <span>{column}</span>
                  </div>
                ))}
              </div>
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
