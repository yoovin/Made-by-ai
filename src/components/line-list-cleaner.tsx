"use client";

import { useState } from "react";
import { analyzeLineList, LineListResult } from "@/lib/line-list-tools";

const FIXTURE = "banana\napple\nbanana\n\ncarrot\napple";

export function LineListCleaner() {
  const [input, setInput] = useState(FIXTURE);
  const [result, setResult] = useState<LineListResult | null>(null);

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
        <button className="bookmark-submit" type="button" onClick={() => setResult(analyzeLineList(input))}>
          정리
        </button>
        <button
          className="bookmark-remove"
          type="button"
          onClick={() => {
            setInput("");
            setResult(null);
          }}
        >
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          검증 예시: <code>{FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
        <p className="section-desc">각 줄은 앞뒤 공백을 제거하고, 빈 줄은 무시한 뒤 비교합니다.</p>
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
                  <pre className="json-formatter-output">{result.orderedUnique}</pre>
                </div>
                <div className="line-list-output-card">
                  <h3>정렬된 결과</h3>
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
