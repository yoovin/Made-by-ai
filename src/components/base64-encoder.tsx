"use client";

import { useState } from "react";
import { Base64ToolResult, decodeBase64Input, encodeBase64Input } from "@/lib/base64-tools";

const ENCODE_EXAMPLE = "Made by AI";
const DECODE_EXAMPLE = "TWFkZSBieSBBSQ==";
const INVALID_EXAMPLE = "%%%";
const UTF8_EXAMPLE = "허브 테스트";

type CopyStatus = "idle" | "copied" | "error";

export function Base64Encoder() {
  const [input, setInput] = useState(ENCODE_EXAMPLE);
  const [result, setResult] = useState<Base64ToolResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleEncode() {
    setCopyStatus("idle");
    setResult(encodeBase64Input(input));
  }

  function handleDecode() {
    setCopyStatus("idle");
    setResult(decodeBase64Input(input));
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
      <h2 className="section-title">Base64 입력</h2>
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
          UTF-8 예시: <code>{UTF8_EXAMPLE}</code>
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
