"use client";

import { useState } from "react";
import { decodeUrlInput, encodeUrlInput, UrlToolResult } from "@/lib/url-tools";

const ENCODE_EXAMPLE = "hello world?x=1&y=2";
const DECODE_EXAMPLE = "hello%20world%3Fx%3D1%26y%3D2";
const INVALID_EXAMPLE = "%E0%A4%A";

export function UrlEncoder() {
  const [input, setInput] = useState(ENCODE_EXAMPLE);
  const [result, setResult] = useState<UrlToolResult | null>(null);

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
        <button className="bookmark-submit" type="button" onClick={() => setResult(encodeUrlInput(input))}>
          인코딩
        </button>
        <button className="bookmark-submit" type="button" onClick={() => setResult(decodeUrlInput(input))}>
          디코딩
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
