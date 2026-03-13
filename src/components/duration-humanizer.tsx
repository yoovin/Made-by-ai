"use client";

import { useState } from "react";
import { DurationHumanizerResult, DurationUnit, humanizeDurationInput } from "@/lib/duration-humanizer-tools";

const SUPPORTED_UNITS: DurationUnit[] = ["milliseconds", "seconds", "minutes", "hours", "days"];

type CopyStatus = "idle" | "copied" | "error";

export function DurationHumanizer() {
  const [input, setInput] = useState("93784");
  const [unit, setUnit] = useState<DurationUnit>("seconds");
  const [result, setResult] = useState<DurationHumanizerResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleHumanize() {
    setCopyStatus("idle");
    setResult(humanizeDurationInput(input, unit));
  }

  function handleClear() {
    setInput("");
    setUnit("seconds");
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
      <h2 className="section-title">Duration 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="93784"
      />

      <div className="query-parser-list">
        <label className="query-parser-row">
          <strong>단위</strong>
          <select value={unit} onChange={(event) => setUnit(event.target.value as DurationUnit)}>
            {SUPPORTED_UNITS.map((currentUnit) => (
              <option key={currentUnit} value={currentUnit}>
                {currentUnit}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleHumanize}>
          변환
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">예시: <code>93784 seconds → 1d 2h 3m 4s</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.output}</strong>
                  <span>compact output</span>
                </div>
                <div className="kpi">
                  <strong>{result.totalMilliseconds}</strong>
                  <span>총 ms</span>
                </div>
                <div className="kpi">
                  <strong>{result.totalSeconds}</strong>
                  <span>총 seconds</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">변환 결과를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <div className="query-parser-list">
                {result.breakdown.map((item) => (
                  <div className="query-parser-row" key={item.label}>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
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
