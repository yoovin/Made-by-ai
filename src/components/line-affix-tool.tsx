"use client";

import { useState } from "react";
import { applyLineAffixes, LineAffixResult } from "@/lib/line-affix-tools";

const QUOTED_FIXTURE = "apple\nbanana\n\ncarrot";
const BULLET_FIXTURE = "alpha\nbeta\ngamma";

export function LineAffixTool() {
  const [source, setSource] = useState(QUOTED_FIXTURE);
  const [prefix, setPrefix] = useState('"');
  const [suffix, setSuffix] = useState('",');
  const [result, setResult] = useState<LineAffixResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">줄 목록 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder={QUOTED_FIXTURE}
      />

      <div className="bookmark-form">
        <input
          className="search-input"
          type="text"
          value={prefix}
          onChange={(event) => setPrefix(event.target.value)}
          placeholder="접두"
        />
        <input
          className="search-input"
          type="text"
          value={suffix}
          onChange={(event) => setSuffix(event.target.value)}
          placeholder="접미"
        />
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(applyLineAffixes(source, prefix, suffix))}>
          적용
        </button>
        <button
          className="bookmark-remove"
          type="button"
          onClick={() => {
            setSource("");
            setPrefix("");
            setSuffix("");
            setResult(null);
          }}
        >
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          따옴표 목록 예시: <code>{QUOTED_FIXTURE.replace(/\n/g, "\\n")}</code>
        </p>
        <p className="section-desc">
          불릿 예시: <code>{BULLET_FIXTURE.replace(/\n/g, "\\n")}</code> + prefix <code>- </code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.totalLines}</strong><span>전체 줄 수</span></div>
                <div className="kpi"><strong>{result.transformedLines}</strong><span>변환된 줄</span></div>
                <div className="kpi"><strong>{result.emptyLinesPreserved}</strong><span>유지된 빈 줄</span></div>
                <div className="kpi"><strong>{result.outputLength}</strong><span>출력 길이</span></div>
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
