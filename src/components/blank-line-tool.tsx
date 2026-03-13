"use client";

import { useState } from "react";
import { BlankLineMode, BlankLineResult, cleanBlankLines } from "@/lib/blank-line-tools";

const FIXTURE = "alpha\n\nbeta\n \n\ngamma";

type CopyStatus = "idle" | "copied" | "error";

export function BlankLineTool() {
  const [input, setInput] = useState(FIXTURE);
  const [mode, setMode] = useState<BlankLineMode>("remove-all");
  const [result, setResult] = useState<BlankLineResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleClean() {
    setCopyStatus("idle");
    setResult(cleanBlankLines(input, mode));
  }

  function handleClear() {
    setInput("");
    setMode("remove-all");
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
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={FIXTURE}
      />

      <div className="bookmark-form">
        <select className="search-input" value={mode} onChange={(event) => setMode(event.target.value as BlankLineMode)}>
          <option value="remove-all">빈 줄 모두 제거</option>
          <option value="collapse-runs">연속 빈 줄 1개만 유지</option>
        </select>
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleClean}>
          정리
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          fixture 예시: <code>{FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.mode}</strong><span>모드</span></div>
                <div className="kpi"><strong>{result.totalLines}</strong><span>전체 줄 수</span></div>
                <div className="kpi"><strong>{result.blankLinesDetected}</strong><span>감지된 빈 줄</span></div>
                <div className="kpi"><strong>{result.removedLines}</strong><span>제거된 빈 줄</span></div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? (
                <p className="section-desc">정리 결과를 클립보드에 복사했습니다.</p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
              <pre className="json-formatter-output">{result.output}</pre>
            </>
          ) : (
            <>
              <h3>정리할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
