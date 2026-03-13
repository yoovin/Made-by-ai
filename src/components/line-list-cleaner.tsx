"use client";

import { useState } from "react";
import { analyzeLineList, LineListResult } from "@/lib/line-list-tools";

const FIXTURE = "banana\napple\nbanana\n\ncarrot\napple";

type CopyMode = "ordered" | "sorted";
type CopyStatus = "idle" | "copied" | "error";

export function LineListCleaner() {
  const [input, setInput] = useState(FIXTURE);
  const [result, setResult] = useState<LineListResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<CopyMode, CopyStatus>>({
    ordered: "idle",
    sorted: "idle",
  });

  function resetCopyStatus() {
    setCopyStatus({
      ordered: "idle",
      sorted: "idle",
    });
  }

  function handleAnalyze() {
    resetCopyStatus();
    setResult(analyzeLineList(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
    resetCopyStatus();
  }

  async function handleCopy(mode: CopyMode) {
    if (!result?.ok) {
      return;
    }

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyStatus((current) => ({
        ...current,
        [mode]: "error",
      }));
      return;
    }

    const value = mode === "ordered" ? result.orderedUnique : result.sortedUnique;

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus((current) => ({
        ...current,
        [mode]: "copied",
      }));
    } catch {
      setCopyStatus((current) => ({
        ...current,
        [mode]: "error",
      }));
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">줄 목록 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={FIXTURE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleAnalyze}>
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
                <div className="kpi"><strong>{result.totalLines}</strong><span>전체 줄 수</span></div>
                <div className="kpi"><strong>{result.nonEmptyLines}</strong><span>비어 있지 않은 줄</span></div>
                <div className="kpi"><strong>{result.uniqueLines}</strong><span>고유 줄 수</span></div>
                <div className="kpi"><strong>{result.duplicatesRemoved}</strong><span>제거된 중복</span></div>
              </div>

              <div className="line-list-output-grid">
                <div className="line-list-output-card">
                  <h3>입력 순서 유지</h3>
                  <div className="json-formatter-actions">
                    <button className="bookmark-submit" type="button" onClick={() => handleCopy("ordered")}>
                      입력 순서 유지 복사
                    </button>
                  </div>
                  {copyStatus.ordered === "copied" ? (
                    <p className="section-desc">입력 순서 유지 결과를 클립보드에 복사했습니다.</p>
                  ) : null}
                  {copyStatus.ordered === "error" ? (
                    <p className="section-desc">이 브라우저에서는 입력 순서 유지 결과를 복사할 수 없습니다.</p>
                  ) : null}
                  <pre className="json-formatter-output">{result.orderedUnique}</pre>
                </div>
                <div className="line-list-output-card">
                  <h3>정렬된 결과</h3>
                  <div className="json-formatter-actions">
                    <button className="bookmark-submit" type="button" onClick={() => handleCopy("sorted")}>
                      정렬 결과 복사
                    </button>
                  </div>
                  {copyStatus.sorted === "copied" ? (
                    <p className="section-desc">정렬된 결과를 클립보드에 복사했습니다.</p>
                  ) : null}
                  {copyStatus.sorted === "error" ? (
                    <p className="section-desc">이 브라우저에서는 정렬된 결과를 복사할 수 없습니다.</p>
                  ) : null}
                  <pre className="json-formatter-output">{result.sortedUnique}</pre>
                </div>
              </div>
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
