"use client";

import { useState } from "react";
import { generateUuid, UuidResult } from "@/lib/uuid-tools";

type CopyStatus = "idle" | "copied" | "error";

export function UuidGenerator() {
  const [result, setResult] = useState<UuidResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleGenerate() {
    setCopyStatus("idle");
    setResult(generateUuid());
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
      await navigator.clipboard.writeText(result.uuid);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">UUID 생성</h2>
      <p className="section-desc">버튼을 누를 때마다 브라우저에서 새 UUID v4를 생성합니다.</p>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          UUID 생성
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
                  <strong>{result.version}</strong>
                  <span>버전</span>
                </div>
                <div className="kpi">
                  <strong>{result.variant.toUpperCase()}</strong>
                  <span>variant</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? (
                <p className="section-desc">생성된 UUID를 클립보드에 복사했습니다.</p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
              <pre className="json-formatter-output">{result.uuid}</pre>
            </>
          ) : (
            <>
              <h3>UUID를 생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
