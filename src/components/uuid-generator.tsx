"use client";

import { useState } from "react";
import { generateUuid, UuidResult } from "@/lib/uuid-tools";

export function UuidGenerator() {
  const [result, setResult] = useState<UuidResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">UUID 생성</h2>
      <p className="section-desc">버튼을 누를 때마다 브라우저에서 새 UUID v4를 생성합니다.</p>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(generateUuid())}>
          UUID 생성
        </button>
        <button className="bookmark-remove" type="button" onClick={() => setResult(null)}>
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
