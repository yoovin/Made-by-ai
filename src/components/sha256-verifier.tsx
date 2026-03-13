"use client";

import { useState } from "react";
import { HashVerifyResult, verifySha256Digest } from "@/lib/hash-tools";

const VALID_TEXT = "abc";
const VALID_DIGEST = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

type CopyStatus = "idle" | "copied" | "error";

export function Sha256Verifier() {
  const [input, setInput] = useState(VALID_TEXT);
  const [expectedDigest, setExpectedDigest] = useState(VALID_DIGEST);
  const [result, setResult] = useState<HashVerifyResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleVerify() {
    setCopyStatus("idle");
    setResult(await verifySha256Digest(input, expectedDigest));
  }

  function handleClear() {
    setInput("");
    setExpectedDigest("");
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
      await navigator.clipboard.writeText(result.computedDigest);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">텍스트와 기대 해시 입력</h2>

      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_TEXT}
      />

      <input
        className="text-input"
        value={expectedDigest}
        onChange={(event) => {
          setExpectedDigest(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_DIGEST}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleVerify}>
          SHA-256 검증
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          예시 텍스트: <code>{VALID_TEXT}</code>
        </p>
        <p className="section-desc">
          예시 해시: <code>{VALID_DIGEST}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? (result.match ? "ok" : "error") : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.match ? "match" : "mismatch"}</strong>
                  <span>비교 결과</span>
                </div>
                <div className="kpi">
                  <strong>{result.characterCount}</strong>
                  <span>문자 수</span>
                </div>
                <div className="kpi">
                  <strong>{result.byteCount}</strong>
                  <span>바이트 수</span>
                </div>
              </div>

              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>expected</strong>
                  <span>{result.normalizedExpectedDigest}</span>
                </div>
                <div className="query-parser-row">
                  <strong>computed</strong>
                  <span>{result.computedDigest}</span>
                </div>
              </div>

              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  계산 해시 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">계산된 SHA-256 해시를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
            </>
          ) : (
            <>
              <h3>SHA-256 검증을 수행할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
