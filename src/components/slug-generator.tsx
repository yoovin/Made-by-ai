"use client";

import { useState } from "react";
import { generateSlug, SlugResult } from "@/lib/slug-tools";

const SLUG_EXAMPLE = "Hello, World! 2026";
const NORMALIZE_EXAMPLE = "Crème Brulee Notes";
const INVALID_EXAMPLE = "###";

export function SlugGenerator() {
  const [input, setInput] = useState(SLUG_EXAMPLE);
  const [result, setResult] = useState<SlugResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={SLUG_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(generateSlug(input))}>
          생성
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
          일반 예시: <code>{SLUG_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          정규화 예시: <code>{NORMALIZE_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          오류 예시: <code>{INVALID_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.slug}</strong>
                  <span>생성된 슬러그</span>
                </div>
                <div className="kpi">
                  <strong>{result.length}</strong>
                  <span>길이</span>
                </div>
                <div className="kpi">
                  <strong>{result.segments}</strong>
                  <span>세그먼트 수</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3>슬러그를 만들 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
