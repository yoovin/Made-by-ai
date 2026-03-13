"use client";

import { useState } from "react";
import { adjustLineIndentation, LineIndentResult } from "@/lib/line-indent-tools";

const INDENT_FIXTURE = "alpha\nbeta\n\ngamma";
const OUTDENT_FIXTURE = "    alpha\n  beta\n\ngamma";

export function LineIndentTool() {
  const [source, setSource] = useState(INDENT_FIXTURE);
  const [mode, setMode] = useState<"indent" | "outdent">("indent");
  const [width, setWidth] = useState("2");
  const [result, setResult] = useState<LineIndentResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder={INDENT_FIXTURE}
      />

      <div className="bookmark-form">
        <select className="search-input" value={mode} onChange={(event) => setMode(event.target.value as "indent" | "outdent")}>
          <option value="indent">들여쓰기</option>
          <option value="outdent">내어쓰기</option>
        </select>
        <input
          className="search-input"
          type="number"
          min="1"
          value={width}
          onChange={(event) => setWidth(event.target.value)}
          placeholder="2"
        />
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(adjustLineIndentation(source, mode, width))}>
          적용
        </button>
        <button
          className="bookmark-remove"
          type="button"
          onClick={() => {
            setSource("");
            setMode("indent");
            setWidth("2");
            setResult(null);
          }}
        >
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          들여쓰기 예시: <code>{INDENT_FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
        <p className="section-desc">
          내어쓰기 예시: <code>{OUTDENT_FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.mode}</strong><span>모드</span></div>
                <div className="kpi"><strong>{result.width}</strong><span>폭</span></div>
                <div className="kpi"><strong>{result.transformedLines}</strong><span>변환된 줄</span></div>
                <div className="kpi"><strong>{result.blankLinesPreserved}</strong><span>유지된 빈 줄</span></div>
              </div>
              <pre className="json-formatter-output">{result.output}</pre>
            </>
          ) : (
            <>
              <h3>조정할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
