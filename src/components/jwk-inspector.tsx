"use client";

import { useState } from "react";
import { inspectJwk, JwkInspectResult } from "@/lib/jwk-tools";

type CopyStatus = "idle" | "copied" | "error";

const VALID_JWK = '{\n  "kty": "RSA",\n  "n": "pKxuoaucQHHXwegHwAuToI40Z7nlTN0wQaudUGCC0bznLXy2EpKjqRt2chGR-rIeGeRkpjnkW29I6gK6gWrB6nJ864ZUAj1nSnxg86Kw1npQu-mRNJa_P14xZ08JR5bx8LcmDF_PkfoNHl5ab0F02dPx_pEJKpQKBSwhopo79xsSDwTxOHU29yY7ohptNNrh9_hcKwYHLjrzKFqmByDk20bBwNwFSdSV2weQ0Y_7So1DlptaOqTXCxDca9vZVPNkBJYeKUBEYl_-fNw6YFM47DXlJ_SFV-7wsAbL_N_YIUZUTguqhWNbkxJt9AVHJznHAFr3ezKWA5OC2j1CmSjvjQ",\n  "e": "AQAB",\n  "alg": "RS256",\n  "kid": "demo-rsa"\n}';
const INVALID_JWKS = '{\n  "keys": []\n}';

export function JwkInspector() {
  const [input, setInput] = useState(VALID_JWK);
  const [result, setResult] = useState<JwkInspectResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleInspect() {
    setCopyStatus("idle");
    setResult(await inspectJwk(input));
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
      await navigator.clipboard.writeText(result.summary.thumbprint);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">JWK 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_JWK}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>JWK 해석</button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>지우기</button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          유효 예시: <code>single RSA/EC JWK object</code>
        </p>
        <p className="section-desc">
          거절 예시: <code>{INVALID_JWKS}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.summary.kty}</strong><span>kty</span></div>
                <div className="kpi"><strong>{result.summary.visibility === "private" ? "contains private members" : "public-only"}</strong><span>visibility</span></div>
                <div className="kpi"><strong>{result.summary.keyDetail}</strong><span>detail</span></div>
              </div>

              <div className="query-parser-list">
                <div className="query-parser-row"><strong>kid</strong><span>{result.summary.kid ?? "없음"}</span></div>
                <div className="query-parser-row"><strong>alg</strong><span>{result.summary.alg ?? "없음"}</span></div>
                <div className="query-parser-row"><strong>use</strong><span>{result.summary.use ?? "없음"}</span></div>
                <div className="query-parser-row"><strong>key_ops</strong><span>{result.summary.keyOps.length > 0 ? result.summary.keyOps.join(", ") : "없음"}</span></div>
                <div className="query-parser-row"><strong>x5c count</strong><span>{result.summary.x5cCount}</span></div>
              </div>

              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>thumbprint 복사</button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">RFC 7638 thumbprint를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 thumbprint를 복사할 수 없습니다.</p> : null}

              <div className="query-parser-list">
                <div className="query-parser-row"><strong>thumbprint input</strong><span>{result.summary.thumbprintInput}</span></div>
              </div>
              <pre className="json-formatter-output">{result.summary.thumbprint}</pre>
            </>
          ) : (
            <>
              <h3>JWK를 해석할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
