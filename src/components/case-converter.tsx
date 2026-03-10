"use client";

import { useState } from "react";
import { CaseResult, convertCaseInput } from "@/lib/case-tools";

const CASE_EXAMPLE = "launch-ready_text 2026";
const CAMEL_EXAMPLE = "helloWorld";

export function CaseConverter() {
  const [input, setInput] = useState(CASE_EXAMPLE);
  const [result, setResult] = useState<CaseResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={CASE_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(convertCaseInput(input))}>
          변환
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
          기본 예시: <code>{CASE_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          camelCase 분리 예시: <code>{CAMEL_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <div className="case-result-grid">
              <div className="kpi"><strong>{result.camelCase}</strong><span>camelCase</span></div>
              <div className="kpi"><strong>{result.pascalCase}</strong><span>PascalCase</span></div>
              <div className="kpi"><strong>{result.snakeCase}</strong><span>snake_case</span></div>
              <div className="kpi"><strong>{result.kebabCase}</strong><span>kebab-case</span></div>
              <div className="kpi"><strong>{result.constantCase}</strong><span>CONSTANT_CASE</span></div>
              <div className="kpi"><strong>{result.titleCase}</strong><span>Title Case</span></div>
            </div>
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
