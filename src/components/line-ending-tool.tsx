"use client";

import { useState } from "react";
import { LineEndingMode, LineEndingResult, normalizeLineEndings } from "@/lib/line-ending-tools";

const FIXTURE = "alpha\r\nbeta\ngamma\rdelta";

type CopyStatus = "idle" | "copied" | "error";

export function LineEndingTool() {
  const [input, setInput] = useState(FIXTURE);
  const [mode, setMode] = useState<LineEndingMode>("lf");
  const [result, setResult] = useState<LineEndingResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleConvert() {
    setCopyStatus("idle");
    setResult(normalizeLineEndings(input, mode));
  }

  function handleClear() {
    setInput("");
    setMode("lf");
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
        <select className="search-input" value={mode} onChange={(event) => setMode(event.target.value as LineEndingMode)}>
          <option value="lf">LF (\n)</option>
          <option value="crlf">CRLF (\r\n)</option>
        </select>
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleConvert}>
          변환
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">혼합 줄바꿈 예시: <code>alpha\r\nbeta\ngamma\rdelta</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.mode.toUpperCase()}</strong><span>출력 형식</span></div>
                <div className="kpi"><strong>{result.lineCount}</strong><span>줄 수</span></div>
                <div className="kpi"><strong>{result.crlfCount}/{result.lfCount}/{result.crCount}</strong><span>CRLF/LF/CR</span></div>
              </div>
              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>Escaped preview</strong>
                  <span>{result.escapedPreview}</span>
                </div>
                <div className="query-parser-row">
                  <strong>Normalized output</strong>
                  <span>{result.output}</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              <p className="section-desc">결과 복사는 escaped preview가 아니라 실제 정규화된 출력값을 복사합니다.</p>
              {copyStatus === "copied" ? (
                <p className="section-desc">정규화된 결과를 클립보드에 복사했습니다.</p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
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
