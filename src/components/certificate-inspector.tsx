"use client";

import { useState } from "react";
import { CertificateInspectResult, inspectCertificate } from "@/lib/certificate-tools";

type CopyStatus = "idle" | "copied" | "error";

const VALID_CERTIFICATE = `-----BEGIN CERTIFICATE-----
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

const INVALID_CERTIFICATE = `-----BEGIN CERTIFICATE REQUEST-----
MIICWTCCAUECAQAwDzENMAsGA1UEAwwEVGVzdDCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAL1n9JztVxFs/m3p2/dW/hjbRDqXR7pAXpRXH8XhZHMTt06M
i+aGNhB2RZd3MUUzzaXCk2Ge0VE6boyEomA1BcSK9OaIoNzW0tUcvo90wyK0vSrl
97CORh+Tx3k7UCoB3cDcKdFKxBqLhmVpc5yJj4tLS8Xty41y6fHZFAWkXTsvp yvA
T1SsR1lhF1DmGi+lS3crLQ+Z6tlhGC0Yd0ng7CAqGeoqzCF42vuiRmb3hxZDYxHD
Vnn9/eEdrUHjPnP34vdbSG6fwSlCn+aRcHIQLgvFvYwKuepPe194Enc/LET/+iA3
Z4d6FzCqQFXHGoSYDfc3qbNrKJzEinMJMQECAwEAAaAAMA0GCSqGSIb3DQEBCwUA
A4IBAQATest
-----END CERTIFICATE REQUEST-----`;

export function CertificateInspector() {
  const [input, setInput] = useState(VALID_CERTIFICATE);
  const [result, setResult] = useState<CertificateInspectResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleInspect() {
    setCopyStatus("idle");
    setResult(await inspectCertificate(input));
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
      await navigator.clipboard.writeText(result.summary.sha256Fingerprint);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">PEM 인증서 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_CERTIFICATE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>
          인증서 해석
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          유효 예시: <code>BEGIN CERTIFICATE</code> 단일 PEM
        </p>
        <p className="section-desc">
          거절 예시: <code>{INVALID_CERTIFICATE.slice(0, 60)}...</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.summary.validityStatus}</strong>
                  <span>상태</span>
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
                  <strong>issuer</strong>
                  <span>{result.summary.issuer}</span>
                </div>
                <div className="query-parser-row">
                  <strong>serial</strong>
                  <span>{result.summary.serialNumber}</span>
                </div>
                <div className="query-parser-row">
                  <strong>notBefore</strong>
                  <span>{result.summary.notBeforeIso}</span>
                </div>
                <div className="query-parser-row">
                  <strong>notAfter</strong>
                  <span>{result.summary.notAfterIso}</span>
                </div>
                <div className="query-parser-row">
                  <strong>public key detail</strong>
                  <span>{result.summary.publicKeyDetail ?? "추가 정보 없음"}</span>
                </div>
              </div>

              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  fingerprint 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">SHA-256 fingerprint를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 fingerprint를 복사할 수 없습니다.</p> : null}

              <pre className="json-formatter-output">{result.summary.sha256Fingerprint}</pre>

              {result.summary.sans.length > 0 ? (
                <div className="query-parser-list">
                  {result.summary.sans.map((san) => (
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
              <h3>인증서를 해석할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
