"use client";

import { useState } from "react";
import { decodeJwt, JwtDecodeResult } from "@/lib/jwt-tools";

const VALID_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const INVALID_JSON_JWT = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.aGVsbG8.";

export function JwtDecoder() {
  const [input, setInput] = useState(VALID_JWT);
  const [result, setResult] = useState<JwtDecodeResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">JWT 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={VALID_JWT}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(decodeJwt(input))}>
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
          유효 예시: <code>{VALID_JWT}</code>
        </p>
        <p className="section-desc">
          JSON 오류 예시: <code>{INVALID_JSON_JWT}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{String(result.header.alg ?? "-")}</strong><span>alg</span></div>
                <div className="kpi"><strong>{String(result.payload.sub ?? "-")}</strong><span>sub</span></div>
                <div className="kpi"><strong>{result.signatureState}</strong><span>signature</span></div>
              </div>
              <pre className="json-formatter-output">{JSON.stringify({ header: result.header, payload: result.payload }, null, 2)}</pre>
              {result.timeClaims.length > 0 ? (
                <div className="query-parser-list">
                  {result.timeClaims.map((claim) => (
                    <div className="query-parser-row" key={claim.key}>
                      <strong>{claim.key}</strong>
                      <span>{claim.iso}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h3>디코딩할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
