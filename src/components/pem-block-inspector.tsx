"use client";

import Link from "next/link";
import { useState } from "react";
import { inspectPemBlocks, PemInspectionResult } from "@/lib/pem-block-tools";

const CERT_EXAMPLE = `-----BEGIN CERTIFICATE-----
QQ==
-----END CERTIFICATE-----`;
const MIXED_EXAMPLE = `-----BEGIN CERTIFICATE-----
QQ==
-----END CERTIFICATE-----
-----BEGIN PRIVATE KEY-----
QQ==
-----END PRIVATE KEY-----`;

export function PemBlockInspector() {
  const [input, setInput] = useState(CERT_EXAMPLE);
  const [result, setResult] = useState<PemInspectionResult | null>(null);

  function handleInspect() {
    setResult(inspectPemBlocks(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  return (
    <section className="panel">
      <h2 className="section-title">PEM 입력</h2>
      <textarea className="json-formatter-textarea" value={input} onChange={(event) => setInput(event.target.value)} placeholder={CERT_EXAMPLE} />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>식별하기</button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>지우기</button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc"><code>{CERT_EXAMPLE}</code></p>
        <p className="section-desc"><code>{MIXED_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.blockCount}</strong><span>block count</span></div>
                <div className="kpi"><strong>{result.sameLabelBundle ? "same-label" : result.mixedBundle ? "mixed" : "single"}</strong><span>composition</span></div>
                <div className="kpi"><strong>{result.issues.length}</strong><span>issues</span></div>
              </div>
              <div className="query-parser-list">
                {result.blocks.map((block, index) => (
                  <div className="query-parser-row" key={`${block.label}-${index}`}>
                    <strong>{block.label}</strong>
                    <span>
                      {block.category}
                      {block.suggestedService ? (
                        <>
                          {" -> "}
                          <Link href={block.suggestedService}>{block.suggestedService}</Link>
                        </>
                      ) : null}
                    </span>
                  </div>
                ))}
                {result.issues.map((issue, index) => (
                  <div className="query-parser-row" key={`${issue.kind}-${index}`}>
                    <strong>{issue.kind}</strong>
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3>PEM 블록을 식별할 수 없습니다</h3>
              <p>{result.error}</p>
              {result.issues.map((issue, index) => (
                <p key={`${issue.kind}-${index}`}>{issue.message}</p>
              ))}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
