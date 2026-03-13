"use client";

import { useState } from "react";
import { generateSlug, SlugResult } from "@/lib/slug-tools";

const SLUG_EXAMPLE = "Hello, World! 2026";
const NORMALIZE_EXAMPLE = "Crème Brulee Notes";
const INVALID_EXAMPLE = "###";

type CopyStatus = "idle" | "copied" | "error";

export function SlugGenerator() {
  const [input, setInput] = useState(SLUG_EXAMPLE);
  const [result, setResult] = useState<SlugResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleGenerate() {
    setCopyStatus("idle");
    setResult(generateSlug(input));
  }

  function handleClear() {
    setInput("");
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
      await navigator.clipboard.writeText(result.slug);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

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
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          생성
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
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
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? (
                <p className="section-desc">생성된 슬러그를 클립보드에 복사했습니다.</p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
              <pre className="json-formatter-output">{result.slug}</pre>
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
