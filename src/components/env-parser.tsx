"use client";

import { useState } from "react";
import { EnvParseResult, parseEnvInput } from "@/lib/env-parser-tools";

const VALID_EXAMPLE = `# database
DB_HOST=localhost
DB_PORT=5432
EMPTY=
GREETING="hello world"
URL=https://a.com?q=1=2`;

const DUPLICATE_EXAMPLE = `PORT=4000
PORT=80`;

const INVALID_EXAMPLE = `NAME="unterminated`;

type CopyStatus = "idle" | "copied" | "error";

export function EnvParser() {
  const [input, setInput] = useState(VALID_EXAMPLE);
  const [result, setResult] = useState<EnvParseResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleParse() {
    setCopyStatus("idle");
    setResult(parseEnvInput(input));
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
      <h2 className="section-title">ENV 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={VALID_EXAMPLE}
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
        <p className="section-desc">기본 예시: <code>{VALID_EXAMPLE}</code></p>
        <p className="section-desc">중복 키 예시: <code>{DUPLICATE_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.variableCount}</strong>
                  <span>파싱된 변수</span>
                </div>
                <div className="kpi">
                  <strong>{result.duplicateCount}</strong>
                  <span>중복 키</span>
                </div>
                <div className="kpi">
                  <strong>{result.sourceLineCount}</strong>
                  <span>원본 줄 수</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  Copy JSON
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">JSON preview를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.jsonPreview}</pre>
              <div className="query-parser-list">
                {result.rows.map((row) => (
                  <div className="query-parser-row" key={`${row.key}-${row.line}`}>
                    <strong>
                      {row.key}
                      {row.duplicate ? " (duplicate)" : ""}
                    </strong>
                    <span>
                      {row.value || "(empty value)"} · line {row.line}
                    </span>
                  </div>
                ))}
              </div>
              <pre className="json-formatter-output">{result.normalizedOutput}</pre>
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
