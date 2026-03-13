"use client";

import { useState } from "react";
import { decodeUrlInput, encodeUrlInput, UrlToolResult } from "@/lib/url-tools";

const ENCODE_EXAMPLE = "hello world?x=1&y=2";
const DECODE_EXAMPLE = "hello%20world%3Fx%3D1%26y%3D2";
const INVALID_EXAMPLE = "%E0%A4%A";

type CopyStatus = "idle" | "copied" | "error";

export function UrlEncoder() {
  const [input, setInput] = useState(ENCODE_EXAMPLE);
  const [result, setResult] = useState<UrlToolResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleEncode() {
    setCopyStatus("idle");
    setResult(encodeUrlInput(input));
  }

  function handleDecode() {
    setCopyStatus("idle");
    setResult(decodeUrlInput(input));
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
      await navigator.clipboard.writeText(result.output);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">URL 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={ENCODE_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleEncode}>
          인코딩
        </button>
        <button className="bookmark-submit" type="button" onClick={handleDecode}>
          디코딩
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          인코딩 예시: <code>{ENCODE_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          디코딩 예시: <code>{DECODE_EXAMPLE}</code>
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
                  <strong>{result.action === "encode" ? "인코딩 완료" : "디코딩 완료"}</strong>
                  <span>실행 결과</span>
                </div>
                <div className="kpi">
                  <strong>{result.characterCount}</strong>
                  <span>출력 길이</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? (
                <p className="section-desc">
                  {result.action === "encode" ? "인코딩 결과를 클립보드에 복사했습니다." : "디코딩 결과를 클립보드에 복사했습니다."}
                </p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
              <pre className="json-formatter-output">{result.output}</pre>
            </>
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
