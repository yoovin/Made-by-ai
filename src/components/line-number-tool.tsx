"use client";

import { useState } from "react";
import { addLineNumbers, LineNumberResult } from "@/lib/line-number-tools";

const FIXTURE_SOURCE = "alpha\nbeta\n\ngamma";

export function LineNumberTool() {
  const [source, setSource] = useState(FIXTURE_SOURCE);
  const [startNumber, setStartNumber] = useState("1");
  const [separator, setSeparator] = useState(". ");
  const [result, setResult] = useState<LineNumberResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">줄 목록 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder={FIXTURE_SOURCE}
      />

      <div className="bookmark-form">
        <input
          className="search-input"
          type="number"
          value={startNumber}
          onChange={(event) => setStartNumber(event.target.value)}
          placeholder="1"
        />
        <input
          className="search-input"
          type="text"
          value={separator}
          onChange={(event) => setSeparator(event.target.value)}
          placeholder=". "
        />
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(addLineNumbers(source, startNumber, separator))}>
          적용
        </button>
        <button
          className="bookmark-remove"
          type="button"
          onClick={() => {
            setSource("");
            setStartNumber("1");
            setSeparator(". ");
            setResult(null);
          }}
        >
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          예시 1: <code>alpha\nbeta\n\ngamma</code> + 시작 번호 <code>1</code> + 구분자 <code>. </code>
        </p>
        <p className="section-desc">
          예시 2: <code>alpha\nbeta\n\ngamma</code> + 시작 번호 <code>10</code> + 구분자 <code>) </code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.totalLines}</strong><span>전체 줄 수</span></div>
                <div className="kpi"><strong>{result.numberedLines}</strong><span>번호 적용 줄</span></div>
                <div className="kpi"><strong>{result.blankLinesPreserved}</strong><span>유지된 빈 줄</span></div>
                <div className="kpi"><strong>{`${result.startNumber}~${result.endNumber}`}</strong><span>번호 범위</span></div>
              </div>
              <pre className="json-formatter-output">{result.output}</pre>
            </>
          ) : (
            <>
              <h3>적용할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
