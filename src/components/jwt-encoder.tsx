"use client";

import { useState } from "react";
import { encodeJwt, JwtEncodeResult } from "@/lib/jwt-tools";

const DEFAULT_HEADER = '{\n  "typ": "JWT"\n}';
const DEFAULT_PAYLOAD = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}';
const DEFAULT_SECRET = "secret";

type CopyStatus = "idle" | "copied" | "error";

export function JwtEncoder() {
  const [headerInput, setHeaderInput] = useState(DEFAULT_HEADER);
  const [payloadInput, setPayloadInput] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState(DEFAULT_SECRET);
  const [algorithm, setAlgorithm] = useState<"HS256" | "HS384" | "HS512">("HS256");
  const [result, setResult] = useState<JwtEncodeResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleEncode() {
    setCopyStatus("idle");
    setResult(await encodeJwt({ headerInput, payloadInput, secret, algorithm }));
  }

  function handleClear() {
    setHeaderInput(DEFAULT_HEADER);
    setPayloadInput(DEFAULT_PAYLOAD);
    setSecret(DEFAULT_SECRET);
    setAlgorithm("HS256");
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
      await navigator.clipboard.writeText(result.token);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">JWT 입력</h2>
      <textarea className="json-formatter-textarea" value={headerInput} onChange={(event) => setHeaderInput(event.target.value)} placeholder={DEFAULT_HEADER} />
      <textarea className="json-formatter-textarea" value={payloadInput} onChange={(event) => setPayloadInput(event.target.value)} placeholder={DEFAULT_PAYLOAD} />
      <textarea className="json-formatter-textarea" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder={DEFAULT_SECRET} />

      <label className="query-parser-row">
        <strong>알고리즘</strong>
        <select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as "HS256" | "HS384" | "HS512")}>
          <option value="HS256">HS256</option>
          <option value="HS384">HS384</option>
          <option value="HS512">HS512</option>
        </select>
        <span>이번 단계에서는 HMAC 기반 HS 계열만 지원합니다.</span>
      </label>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleEncode}>JWT 생성</button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>지우기</button>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.algorithm}</strong><span>alg</span></div>
                <div className="kpi"><strong>signed</strong><span>mode</span></div>
                <div className="kpi"><strong>3</strong><span>segments</span></div>
              </div>
              <pre className="json-formatter-output">{result.token}</pre>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>결과 복사</button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">JWT 결과를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
            </>
          ) : (
            <>
              <h3>JWT를 생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
