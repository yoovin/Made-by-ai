"use client";

import { useState } from "react";
import { parseCronExpression, CronExpressionResult } from "@/lib/cron-expression-tools";

const VALID_EXAMPLE = "*/5 * * * *";
const WORKDAY_EXAMPLE = "0 9 * * 1-5";
const INVALID_EXAMPLE = "@daily";

type CopyStatus = "idle" | "copied" | "error";

export function CronExpressionParser() {
  const [input, setInput] = useState(VALID_EXAMPLE);
  const [result, setResult] = useState<CronExpressionResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleParse() {
    setCopyStatus("idle");
    setResult(parseCronExpression(input));
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
      <h2 className="section-title">Cron 표현식 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={VALID_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleParse}>
          해석
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">기본 예시: <code>{VALID_EXAMPLE}</code></p>
        <p className="section-desc">업무시간 예시: <code>{WORKDAY_EXAMPLE}</code></p>
        <p className="section-desc">지원하지 않는 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.normalizedExpression}</strong>
                  <span>정규화 표현식</span>
                </div>
              </div>
              <p>{result.summary}</p>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">해석 결과를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <div className="query-parser-list">
                {result.fields.map((field) => (
                  <div className="query-parser-row" key={field.key}>
                    <strong>{field.label}</strong>
                    <span>{field.explanation}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3>해석할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
