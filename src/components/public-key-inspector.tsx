"use client";

import { useState } from "react";
import { inspectPublicKey, PublicKeyInspectResult } from "@/lib/public-key-tools";

type CopyStatus = "idle" | "copied" | "error";

const VALID_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0YI1w4wEtLr+Zl5l0w6B
LBMZpmjHtkobaN6D+PfYZ7RUTpujISiYDUFxIr05oig3NbS1Ry6j3TDIrS9KuX3s
I5GH5PHeTtQKgHdwNwp0UrEGouGZWlznImPi0tLxe3LjXLp8dkUBaRdOy+nK8BPV
KxHWWEXUOYaL6VLdystD5nq2WEYLRh3SeDsICoZ6irMIXja+6JGZveHFkNjEcNWe
f394R2tQeM+c/fi91tIbp/BKUKf5pFwchAuC8W9jAq56k97X3gSdz8sRP/6IDdnh
3oXMKpAVccahJgN9zeps2sonMSKcwkRA03Gzdh0dX8GZFODdgNpTi27C/medfyqC
wQIDAQAB
-----END PUBLIC KEY-----`;

const INVALID_PUBLIC_KEY = `-----BEGIN CERTIFICATE-----
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

export function PublicKeyInspector() {
  const [input, setInput] = useState(VALID_PUBLIC_KEY);
  const [result, setResult] = useState<PublicKeyInspectResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleInspect() {
    setCopyStatus("idle");
    setResult(await inspectPublicKey(input));
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
      <h2 className="section-title">PEM 공개키 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_PUBLIC_KEY}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>
          공개키 해석
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          유효 예시: <code>BEGIN PUBLIC KEY</code> 단일 PEM
        </p>
        <p className="section-desc">
          거절 예시: <code>{INVALID_PUBLIC_KEY.slice(0, 60)}...</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.summary.publicKeyAlgorithm}</strong>
                  <span>알고리즘</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.publicKeyDetail ?? "추가 정보 없음"}</strong>
                  <span>세부 정보</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.spkiByteLength}</strong>
                  <span>SPKI bytes</span>
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
            </>
          ) : (
            <>
              <h3>공개키를 해석할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
