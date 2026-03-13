"use client";

import { useState } from "react";
import { generateUlid, UlidResult } from "@/lib/ulid-tools";

type CopyStatus = "idle" | "copied" | "error";

export function UlidGenerator() {
  const [result, setResult] = useState<UlidResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleGenerate() {
    setCopyStatus("idle");
    setResult(generateUlid());
  }

  function handleClear() {
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
      await navigator.clipboard.writeText(result.ulid);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">ULID 생성</h2>
      <p className="section-desc">버튼을 누를 때마다 브라우저에서 새 ULID를 생성합니다.</p>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          ULID 생성
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.length}</strong>
                  <span>길이</span>
                </div>
                <div className="kpi">
                  <strong>{result.timestampMs}</strong>
                  <span>timestamp</span>
                </div>
              </div>
              <p className="section-desc">생성 시각: {result.createdAtIso}</p>
              <p className="section-desc">사전순 정렬이 가능한 식별자 형식을 사용합니다.</p>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 ULID를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.ulid}</pre>
            </>
          ) : (
            <>
              <h3>ULID를 생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
