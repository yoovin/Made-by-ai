"use client";

import { useState } from "react";
import { compareTextInputs, TextDiffResult } from "@/lib/text-diff-tools";

const LEFT_FIXTURE = "alpha\nbeta\ncharlie";
const RIGHT_FIXTURE = "alpha\nbetX\ncharlie";

export function TextDiffChecker() {
  const [left, setLeft] = useState(LEFT_FIXTURE);
  const [right, setRight] = useState(RIGHT_FIXTURE);
  const [result, setResult] = useState<TextDiffResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">텍스트 입력</h2>
      <div className="text-diff-grid">
        <textarea
          className="json-formatter-textarea"
          value={left}
          onChange={(event) => setLeft(event.target.value)}
          placeholder={LEFT_FIXTURE}
        />
        <textarea
          className="json-formatter-textarea"
          value={right}
          onChange={(event) => setRight(event.target.value)}
          placeholder={RIGHT_FIXTURE}
        />
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(compareTextInputs(left, right))}>
          비교
        </button>
        <button
          className="bookmark-remove"
          type="button"
          onClick={() => {
            setLeft("");
            setRight("");
            setResult(null);
          }}
        >
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          비교 예시 left: <code>{LEFT_FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
        <p className="section-desc">
          비교 예시 right: <code>{RIGHT_FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.identical ? "same" : "different"}</strong><span>비교 결과</span></div>
                <div className="kpi"><strong>{result.leftLines}</strong><span>왼쪽 줄 수</span></div>
                <div className="kpi"><strong>{result.rightLines}</strong><span>오른쪽 줄 수</span></div>
                <div className="kpi"><strong>{result.leftCharacters}/{result.rightCharacters}</strong><span>문자 수</span></div>
              </div>
              {result.firstDifference ? (
                <div className="query-parser-list">
                  <div className="query-parser-row">
                    <strong>첫 차이 위치</strong>
                    <span>line {result.firstDifference.line}, column {result.firstDifference.column}</span>
                  </div>
                  <div className="query-parser-row">
                    <strong>왼쪽 줄</strong>
                    <span>{result.firstDifference.leftLine || "(empty)"}</span>
                  </div>
                  <div className="query-parser-row">
                    <strong>오른쪽 줄</strong>
                    <span>{result.firstDifference.rightLine || "(empty)"}</span>
                  </div>
                </div>
              ) : null}
              <div className="text-diff-result-list">
                {result.rows.map((row) => (
                  <article className={`text-diff-result-row text-diff-result-row-${row.type}`} key={`diff-row-${row.line}`}>
                    <div className="text-diff-result-meta">
                      <strong>line {row.line}</strong>
                      <span>{row.type}</span>
                    </div>
                    <div className="text-diff-result-columns">
                      <pre className="json-formatter-output">{row.leftLine || "(empty)"}</pre>
                      <pre className="json-formatter-output">{row.rightLine || "(empty)"}</pre>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3>비교할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
