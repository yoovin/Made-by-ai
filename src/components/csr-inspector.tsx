"use client";

import { useState } from "react";
import { CsrInspectResult, inspectCsr } from "@/lib/csr-tools";

type CopyStatus = "idle" | "copied" | "error";

const VALID_CSR = `-----BEGIN CERTIFICATE REQUEST-----
MIICtDCCAZwCAQAwMDEZMBcGA1UEAwwQbWFkZS1ieS1haS5sb2NhbDETMBEGA1UE
CgwKTWFkZSBieSBBSTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOMd
2UQ7LB5Wxz26vsnqbu+MhpChwRZJfAuIfPCMF7SxnsDY8A2M7BmoxFCdGfK4JyTD
GxF74KdIxGx6dJfWaq4mBa/RvH2tk6SpsKKVdd6Cy9ds+mM1vguCvdee6WAF3z0q
hydyupQPfdJeOOfNaMH40rX2Fm96fuP7zmRpylHBC6aeAdgj+/GEX2oFC++ve/0N
sZ+phv3zab4sdnuRBXNvcJy3mcuEWHYtwI+C/LfOH9dM9Sey+AvQqQrgQb1lcdsh
WU0+K1Y+AcN5G5QZb1qgiKotW2U8T8e8lef4VmpyEeuthNLb7dOmPUsVfcRtvjKd
ZdGrwCa/ITx1lO/g4YMCAwEAAaA/MD0GCSqGSIb3DQEJDjEwMC4wLAYDVR0RBCUw
I4IQbWFkZS1ieS1haS5sb2NhbIIJbG9jYWxob3N0hwR/AAABMA0GCSqGSIb3DQEB
CwUAA4IBAQC2DLu0jnqq9jYU9dUyKKp9ISA1Pg+oRxGnB2h1f2+yjD55a/nPdfny
eP1+VTxa2QLPwJ/PZoHMfEvIZrFdJSDhh5wtO3sOLDqIYWOgeOCtAiPvSS8/RGK2
4g4RSEjwgPb8ZIRaHE+Lz4qSlfnJmHGjc3zpJnJsckJnp0YsHjEUB4caQhbxvHZZ
p4bAI+xjpKMo7C4ttbDZqjLGwGdEprOR5yTBKMorxr66MS49FC4Loi+55DfLrEwp
VxFZCvaS4wKR2gZe3TmW0Yb4UtNY6CMtTte/ejqSTAx2+hd+CQtcZtT9D/fkraWJ
Cx9fk8F6bFqZUJa2nLpxeEa/EplBhZZ7
-----END CERTIFICATE REQUEST-----`;

const INVALID_CSR = `-----BEGIN CERTIFICATE-----
MIIDRjCCAi6gAwIBAgIUW+NBCyNnD6a/2T2cXF5gKVDoV6wwDQYJKoZIhvcNAQEL
BQAwGzEZMBcGA1UEAwwQbWFkZS1ieS1haS5sb2NhbDAeFw0yNjAzMTIwMzAzMjla
Fw0yNjAzMTQwMzAzMjlaMBsxGTAXBgNVBAMMEG1hZGUtYnktYWkubG9jYWwwggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCvtxg5SwcEaFLGK57thc/bYGIr
/O42+CJMDuoSzenz0Q1Ev5Of6ZcrxRKzx9gb8jy+v74eeexPslYbdQRXKG6QjKDV
chwnbhE7g7M74/XG3Pw680Aqsw+JdxHqljF9vVeEGchvoMia4wrSYGQ4ETJdJHlk
yab46MhWtVdZdpFcluPRTcLCU41HVMAmOJq7chx7+N1L3VgHus8V+04nCKREDN3e
cNJtYSdpzwgs0QOr0Ob7H+tiQ0U1trQUtX2HkKzdXDiL84eknswYYcm/ODqtuOll
++N4eUL0RaO487m0Z7CLqh6ZvPK0sc7DMTXJ4uEYLqZXoi9a7OXZqk4li5BFAgMB
AAGjgYEwfzAdBgNVHQ4EFgQUz1Up++BU+MeiJRXoIJNEo17XoEwwHwYDVR0jBBgw
FoAUz1Up++BU+MeiJRXoIJNEo17XoEwwDwYDVR0TAQH/BAUwAwEB/zAsBgNVHREE
JTAjghBtYWRlLWJ5LWFpLmxvY2Fsgglsb2NhbGhvc3SHBH8AAAEwDQYJKoZIhvcN
AQELBQADggEBAHCy5R/nSyxbBi3+tthTb1hiKJBqk2zt5Vh4cuRqn1UyuGE/TGuH
Eu8uRel4WhmQT6TBy3q7cO5a576BvYvKGRLheMgF3KTMRgTOUfqsG2FtVehnqwP8
Ik1cbK98r0lewN3Gv/8a6ntqeLAx0Re4yqXaXkXL/W6u+8LSoUW4sUEv4msywum6
u6LIwJpYKkChVrNRdNPJQ50mlYGD1/NwRuCT2FVZdDe1oANljvU0M78xEYydmE3+
q6dam6btjjhnQZB/5A2wwusGkRtbIW4bBAFZUiGg3Ja6cfVu4X+6SCpByD3WIVTw
Na4wnL33fVPKufyMlDSnYG8LETv0sQ/eq0w=
-----END CERTIFICATE-----`;

export function CsrInspector() {
  const [input, setInput] = useState(VALID_CSR);
  const [result, setResult] = useState<CsrInspectResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleInspect() {
    setCopyStatus("idle");
    setResult(await inspectCsr(input));
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
      await navigator.clipboard.writeText(result.summary.sha256PublicKeyFingerprint);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">PEM CSR 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_CSR}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>
          CSR 해석
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          유효 예시: <code>BEGIN CERTIFICATE REQUEST</code> 단일 PEM
        </p>
        <p className="section-desc">
          거절 예시: <code>{INVALID_CSR.slice(0, 60)}...</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.summary.signatureStatus}</strong>
                  <span>서명 상태</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.signatureAlgorithm}</strong>
                  <span>서명 알고리즘</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.publicKeyAlgorithm}</strong>
                  <span>공개키</span>
                </div>
              </div>

              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>subject</strong>
                  <span>{result.summary.subject}</span>
                </div>
                <div className="query-parser-row">
                  <strong>public key detail</strong>
                  <span>{result.summary.publicKeyDetail ?? "추가 정보 없음"}</span>
                </div>
                <div className="query-parser-row">
                  <strong>extensions</strong>
                  <span>{result.summary.extensionCount}</span>
                </div>
              </div>

              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  공개키 fingerprint 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">SHA-256 공개키 fingerprint를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 fingerprint를 복사할 수 없습니다.</p> : null}

              <pre className="json-formatter-output">{result.summary.sha256PublicKeyFingerprint}</pre>

              {result.summary.sanEntries.length > 0 ? (
                <div className="query-parser-list">
                  {result.summary.sanEntries.map((san) => (
                    <div className="query-parser-row" key={san}>
                      <strong>SAN</strong>
                      <span>{san}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h3>CSR을 해석할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
