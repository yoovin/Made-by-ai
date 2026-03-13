"use client";

import { useState } from "react";
import { LineSortResult, sortLineList } from "@/lib/line-sort-tools";

const FIXTURE = "beta\nalpha\nbeta\n\ngamma";

type CopyMode = "ascending" | "descending";
type CopyStatus = "idle" | "copied" | "error";

export function LineSortTool() {
  const [input, setInput] = useState(FIXTURE);
  const [result, setResult] = useState<LineSortResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<CopyMode, CopyStatus>>({
    ascending: "idle",
    descending: "idle",
  });

  function resetCopyStatus() {
    setCopyStatus({
      ascending: "idle",
      descending: "idle",
    });
  }

  function handleSort() {
    resetCopyStatus();
    setResult(sortLineList(input));
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

    const value = mode === "ascending" ? result.ascending : result.descending;

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
        <button className="bookmark-submit" type="button" onClick={handleSort}>
          정렬
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          fixture 예시: <code>{FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
        <p className="section-desc">빈 줄은 정렬 대상에서 제외되고, 중복 줄은 그대로 유지됩니다.</p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.totalLines}</strong><span>전체 줄 수</span></div>
                <div className="kpi"><strong>{result.sortableLines}</strong><span>정렬 대상 줄</span></div>
                <div className="kpi"><strong>{result.ignoredBlankLines}</strong><span>무시된 빈 줄</span></div>
              </div>
              <div className="line-list-output-grid">
                <div className="line-list-output-card">
                  <h3>오름차순</h3>
                  <div className="json-formatter-actions">
                    <button className="bookmark-submit" type="button" onClick={() => handleCopy("ascending")}>
                      오름차순 복사
                    </button>
                  </div>
                  {copyStatus.ascending === "copied" ? (
                    <p className="section-desc">오름차순 결과를 클립보드에 복사했습니다.</p>
                  ) : null}
                  {copyStatus.ascending === "error" ? (
                    <p className="section-desc">이 브라우저에서는 오름차순 결과를 복사할 수 없습니다.</p>
                  ) : null}
                  <pre className="json-formatter-output">{result.ascending}</pre>
                </div>
                <div className="line-list-output-card">
                  <h3>내림차순</h3>
                  <div className="json-formatter-actions">
                    <button className="bookmark-submit" type="button" onClick={() => handleCopy("descending")}>
                      내림차순 복사
                    </button>
                  </div>
                  {copyStatus.descending === "copied" ? (
                    <p className="section-desc">내림차순 결과를 클립보드에 복사했습니다.</p>
                  ) : null}
                  {copyStatus.descending === "error" ? (
                    <p className="section-desc">이 브라우저에서는 내림차순 결과를 복사할 수 없습니다.</p>
                  ) : null}
                  <pre className="json-formatter-output">{result.descending}</pre>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3>정렬할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
