"use client";

import { useState } from "react";
import { QueryStringBuilderRow } from "@/lib/query-string-builder-tools";
import { buildFullUrl, UrlBuilderResult } from "@/lib/url-builder-tools";

const INITIAL_ROWS: QueryStringBuilderRow[] = [
  { key: "page", value: "1" },
  { key: "sort", value: "updated_at" },
  { key: "tag", value: "hub" },
];

type CopyStatus = "idle" | "copied" | "error";

export function UrlBuilder() {
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [path, setPath] = useState("/docs");
  const [hash, setHash] = useState("details");
  const [rows, setRows] = useState<QueryStringBuilderRow[]>(INITIAL_ROWS);
  const [result, setResult] = useState<UrlBuilderResult | null>(null);
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
    setResult(
      buildFullUrl({
        baseUrl,
        path,
        hash,
        rows,
      })
    );
  }

  function handleClear() {
    setBaseUrl("");
    setPath("");
    setHash("");
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
      <h2 className="section-title">URL 입력</h2>
      <div className="query-parser-list">
        <label className="query-parser-row">
          <strong>Base URL</strong>
          <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://example.com" />
        </label>
        <label className="query-parser-row">
          <strong>Path</strong>
          <input value={path} onChange={(event) => setPath(event.target.value)} placeholder="/docs" />
        </label>
        <label className="query-parser-row">
          <strong>Hash</strong>
          <input value={hash} onChange={(event) => setHash(event.target.value)} placeholder="details" />
        </label>
      </div>

      <h3 className="section-title">Query rows</h3>
      <div className="query-parser-list">
        {rows.map((row, index) => (
          <div className="query-parser-row" key={`url-query-row-${index}`}>
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
                  <strong>{result.query.paramCount}</strong>
                  <span>query rows</span>
                </div>
                <div className="kpi">
                  <strong>{result.query.uniqueKeys}</strong>
                  <span>고유 query key</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 URL을 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.output}</pre>
              <pre className="json-formatter-output">{result.query.output}</pre>
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
