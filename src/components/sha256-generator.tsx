"use client";

import { useState } from "react";
import { HashResult, hashTextWithSha256 } from "@/lib/hash-tools";

const VALID_EXAMPLE = "abc";

export function Sha256Generator() {
  const [input, setInput] = useState(VALID_EXAMPLE);
  const [result, setResult] = useState<HashResult | null>(null);

  async function handleHash() {
    setResult(await hashTextWithSha256(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  return (
    <section className="panel">
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={VALID_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleHash}>
          SHA-256 생성
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          예시 입력: <code>{VALID_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          검증용 기대값: <code>ba7816bf8f01cfea...15ad</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.characterCount}</strong>
                  <span>문자 수</span>
                </div>
                <div className="kpi">
                  <strong>{result.byteCount}</strong>
                  <span>바이트 수</span>
                </div>
              </div>
              <pre className="json-formatter-output">{result.digest}</pre>
            </>
          ) : (
            <>
              <h3>해시를 만들 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
