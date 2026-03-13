"use client";

import { useState } from "react";
import { formatJsonInput, JsonFormatResult } from "@/lib/json-tools";

const VALID_EXAMPLE = '{"name":"Made by AI","items":[1,true,null]}';
const INVALID_EXAMPLE = '{"name":}';

type CopyStatus = "idle" | "copied" | "error";

export function JsonFormatter() {
  const [input, setInput] = useState(VALID_EXAMPLE);
  const [result, setResult] = useState<JsonFormatResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleFormat() {
    setCopyStatus("idle");
    setResult(formatJsonInput(input));
  }

  function handleValidate() {
    setCopyStatus("idle");
    setResult(formatJsonInput(input));
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
      await navigator.clipboard.writeText(result.formatted);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">JSON 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={VALID_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleFormat}>
          포맷
        </button>
        <button className="bookmark-submit" type="button" onClick={handleValidate}>
          검증
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">유효 예시: <code>{VALID_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>유효한 JSON</strong>
                  <span>검증 상태</span>
                </div>
                <div className="kpi">
                  <strong>{result.rootType}</strong>
                  <span>루트 타입</span>
                </div>
                <div className="kpi">
                  <strong>{result.lineCount}</strong>
                  <span>줄 수</span>
                </div>
               <div className="kpi">
                 <strong>{result.characterCount}</strong>
                 <span>문자 수</span>
               </div>
               </div>
               <div className="json-formatter-actions">
                 <button className="bookmark-submit" type="button" onClick={handleCopy}>
                   결과 복사
                 </button>
               </div>
               {copyStatus === "copied" ? (
                 <p className="section-desc">포맷된 JSON을 클립보드에 복사했습니다.</p>
               ) : null}
               {copyStatus === "error" ? (
                 <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
               ) : null}
               <pre className="json-formatter-output">{result.formatted}</pre>
             </>
           ) : (
            <>
              <h3>유효하지 않은 JSON</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
