"use client";

import { useState } from "react";
import { inspectPrivateKey, PrivateKeyInspectResult } from "@/lib/private-key-tools";

const EXAMPLE = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDO
-----END PRIVATE KEY-----`;
const LEGACY = `-----BEGIN RSA PRIVATE KEY-----
QQ==
-----END RSA PRIVATE KEY-----`;

export function PrivateKeyInspector() {
  const [input, setInput] = useState(EXAMPLE);
  const [result, setResult] = useState<PrivateKeyInspectResult | null>(null);

  async function handleInspect() {
    setResult(await inspectPrivateKey(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  return (
    <section className="panel">
      <h2 className="section-title">PEM 개인키 입력</h2>
      <textarea className="json-formatter-textarea" value={input} onChange={(event) => setInput(event.target.value)} placeholder={EXAMPLE} />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>해석</button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>지우기</button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc"><code>{EXAMPLE}</code></p>
        <p className="section-desc"><code>{LEGACY}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.summary.format}</strong><span>format</span></div>
                <div className="kpi"><strong>{result.summary.keyFamily}</strong><span>family</span></div>
                <div className="kpi"><strong>{result.summary.pkcs8ByteLength}</strong><span>bytes</span></div>
              </div>
              <div className="query-parser-list">
                <div className="query-parser-row"><strong>detail</strong><span>{result.summary.keyDetail}</span></div>
              </div>
            </>
          ) : (
            <>
              <h3>개인키를 해석할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
