"use client";

import { useState } from "react";
import { generateLoremIpsum, LoremIpsumResult, LoremMode } from "@/lib/lorem-ipsum-tools";

type CopyStatus = "idle" | "copied" | "error";

const MODES: Array<{ value: LoremMode; label: string }> = [
  { value: "paragraphs", label: "문단" },
  { value: "sentences", label: "문장" },
  { value: "words", label: "단어" },
];

export function LoremIpsumGenerator() {
  const [mode, setMode] = useState<LoremMode>("paragraphs");
  const [count, setCount] = useState("2");
  const [result, setResult] = useState<LoremIpsumResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleGenerate() {
    setCopyStatus("idle");
    setResult(generateLoremIpsum(mode, count));
  }

  function handleClear() {
    setMode("paragraphs");
    setCount("2");
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
      <h2 className="section-title">생성 설정</h2>
      <div className="query-parser-list">
        <label className="query-parser-row">
          <strong>단위</strong>
          <select value={mode} onChange={(event) => setMode(event.target.value as LoremMode)}>
            {MODES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="query-parser-row">
          <strong>개수</strong>
          <input value={count} onChange={(event) => setCount(event.target.value)} inputMode="numeric" />
        </label>
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          생성
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
                  <strong>{result.mode}</strong>
                  <span>단위</span>
                </div>
                <div className="kpi">
                  <strong>{result.count}</strong>
                  <span>개수</span>
                </div>
                <div className="kpi">
                  <strong>{result.characterCount}</strong>
                  <span>문자 수</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 Lorem Ipsum을 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.output}</pre>
            </>
          ) : (
            <>
              <h3>생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
