"use client";

import { useState } from "react";
import { comparePublicKeyArtifacts, PublicKeyMatchResult } from "@/lib/public-key-match-tools";

type CopyStatus = "idle" | "copied" | "error";

const LEFT_EXAMPLE = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtestReplaceWithFixture
-----END PUBLIC KEY-----`;
const RIGHT_EXAMPLE = `-----BEGIN CERTIFICATE REQUEST-----
MIIBVTCBvwIBADANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtestReplaceWithFixture
-----END CERTIFICATE REQUEST-----`;

export function PublicKeyMatchChecker() {
  const [leftInput, setLeftInput] = useState(LEFT_EXAMPLE);
  const [rightInput, setRightInput] = useState(RIGHT_EXAMPLE);
  const [result, setResult] = useState<PublicKeyMatchResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleCompare() {
    setCopyStatus("idle");
    setResult(await comparePublicKeyArtifacts(leftInput, rightInput));
  }

  function handleClear() {
    setLeftInput("");
    setRightInput("");
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
      await navigator.clipboard.writeText(result.left.sha256PublicKeyFingerprint);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">비교할 PEM 입력</h2>
      <div className="text-diff-grid">
        <textarea className="json-formatter-textarea" value={leftInput} onChange={(event) => setLeftInput(event.target.value)} placeholder={LEFT_EXAMPLE} />
        <textarea className="json-formatter-textarea" value={rightInput} onChange={(event) => setRightInput(event.target.value)} placeholder={RIGHT_EXAMPLE} />
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleCompare}>일치 확인</button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>지우기</button>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? (result.match ? "ok" : "error") : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.match ? "match" : "mismatch"}</strong><span>비교 결과</span></div>
                <div className="kpi"><strong>{result.left.artifactType}</strong><span>left</span></div>
                <div className="kpi"><strong>{result.right.artifactType}</strong><span>right</span></div>
              </div>
              <div className="query-parser-list">
                <div className="query-parser-row"><strong>left</strong><span>{result.left.publicKeyAlgorithm} / {result.left.publicKeyDetail ?? "추가 정보 없음"}</span></div>
                <div className="query-parser-row"><strong>right</strong><span>{result.right.publicKeyAlgorithm} / {result.right.publicKeyDetail ?? "추가 정보 없음"}</span></div>
                <div className="query-parser-row"><strong>fingerprint</strong><span>{result.left.sha256PublicKeyFingerprint}</span></div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>left fingerprint 복사</button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">공개키 fingerprint를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
            </>
          ) : (
            <>
              <h3>공개키 일치 확인을 수행할 수 없습니다</h3>
              {result.leftError ? <p>왼쪽 입력: {result.leftError}</p> : null}
              {result.rightError ? <p>오른쪽 입력: {result.rightError}</p> : null}
              {!result.leftError && !result.rightError ? <p>{result.error}</p> : null}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
