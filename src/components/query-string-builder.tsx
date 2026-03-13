"use client";

import { useState } from "react";
import { buildQueryString, QueryStringBuilderResult, QueryStringBuilderRow } from "@/lib/query-string-builder-tools";

const INITIAL_ROWS: QueryStringBuilderRow[] = [
  { key: "page", value: "1" },
  { key: "sort", value: "updated_at" },
  { key: "tag", value: "hub" },
  { key: "tag", value: "local" },
  { key: "empty", value: "" },
];

type CopyStatus = "idle" | "copied" | "error";

export function QueryStringBuilder() {
  const [rows, setRows] = useState<QueryStringBuilderRow[]>(INITIAL_ROWS);
  const [result, setResult] = useState<QueryStringBuilderResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function updateRow(index: number, field: keyof QueryStringBuilderRow, value: string) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  }

  function handleAddRow() {
    setRows((current) => [...current, { key: "", value: "" }]);
  }

  function handleRemoveRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  function handleBuild() {
    setCopyStatus("idle");
    setResult(buildQueryString(rows));
  }

  function handleClear() {
    setRows([{ key: "", value: "" }]);
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
      <h2 className="section-title">쿼리 행 입력</h2>
      <div className="query-parser-list">
        {rows.map((row, index) => (
          <div className="query-parser-row" key={`query-row-${index}`}>
            <input value={row.key} onChange={(event) => updateRow(index, "key", event.target.value)} placeholder="key" />
            <input value={row.value} onChange={(event) => updateRow(index, "value", event.target.value)} placeholder="value" />
            <button className="bookmark-remove" type="button" onClick={() => handleRemoveRow(index)} disabled={rows.length === 1}>
              행 삭제
            </button>
          </div>
        ))}
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleAddRow}>
          행 추가
        </button>
        <button className="bookmark-submit" type="button" onClick={handleBuild}>
          빌드
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.paramCount}</strong>
                  <span>파라미터 수</span>
                </div>
                <div className="kpi">
                  <strong>{result.uniqueKeys}</strong>
                  <span>고유 키 수</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 query string을 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.output}</pre>
              <pre className="json-formatter-output">{result.prefixedOutput}</pre>
            </>
          ) : (
            <>
              <h3>빌드할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
