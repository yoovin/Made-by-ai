"use client";

import { useState } from "react";
import {
  DEFAULT_HMAC_ALGORITHM,
  DEFAULT_HMAC_MESSAGE,
  DEFAULT_HMAC_SECRET,
  generateHmac,
  HmacAlgorithm,
  HmacResult,
} from "@/lib/hmac-tools";

type CopyStatus = "idle" | "copied" | "error";

const ALGORITHMS: HmacAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

export function HmacGenerator() {
  const [message, setMessage] = useState(DEFAULT_HMAC_MESSAGE);
  const [secret, setSecret] = useState(DEFAULT_HMAC_SECRET);
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>(DEFAULT_HMAC_ALGORITHM);
  const [result, setResult] = useState<HmacResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleGenerate() {
    setCopyStatus("idle");
    setResult(await generateHmac({ message, secret, algorithm }));
  }

  function handleClear() {
    setMessage(DEFAULT_HMAC_MESSAGE);
    setSecret(DEFAULT_HMAC_SECRET);
    setAlgorithm(DEFAULT_HMAC_ALGORITHM);
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
      await navigator.clipboard.writeText(result.digest);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">HMAC 입력</h2>
      <p className="section-desc">메시지와 시크릿의 공백, 줄바꿈, 유니코드 문자를 그대로 유지한 UTF-8 바이트로 계산합니다.</p>

      <textarea
        className="json-formatter-textarea"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder="메시지를 그대로 입력하세요"
      />

      <textarea
        className="json-formatter-textarea"
        value={secret}
        onChange={(event) => {
          setSecret(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder="시크릿을 그대로 입력하세요"
      />

      <label className="query-parser-row">
        <strong>알고리즘</strong>
        <select
          value={algorithm}
          onChange={(event) => {
            setAlgorithm(event.target.value as HmacAlgorithm);
            setCopyStatus("idle");
          }}
        >
          {ALGORITHMS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <span>이번 단계에서는 hex 출력만 지원합니다.</span>
      </label>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          HMAC 생성
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
                  <strong>{result.algorithm}</strong>
                  <span>algorithm</span>
                </div>
                <div className="kpi">
                  <strong>{result.messageByteCount}</strong>
                  <span>message bytes</span>
                </div>
                <div className="kpi">
                  <strong>{result.secretByteCount}</strong>
                  <span>secret bytes</span>
                </div>
              </div>
              <p className="section-desc">출력 길이: {result.outputLength}자 hex digest</p>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 HMAC 결과를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.digest}</pre>
            </>
          ) : (
            <>
              <h3>HMAC를 생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
