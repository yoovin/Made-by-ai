"use client";

import { useState } from "react";
import { inspectSshPublicKey, SshKeyInspectResult } from "@/lib/ssh-key-tools";

type CopyStatus = "idle" | "copied" | "error";

const VALID_KEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHQ5J1p8W9j9l56k97X3gSdz8sRP6IDdnh3oXMKpAVcc made-by-ai@local";
const INVALID_KEY = "-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A -----END PUBLIC KEY-----";

export function SshKeyFingerprint() {
  const [input, setInput] = useState(VALID_KEY);
  const [result, setResult] = useState<SshKeyInspectResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleInspect() {
    setCopyStatus("idle");
    setResult(await inspectSshPublicKey(input));
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
      <h2 className="section-title">OpenSSH 공개키 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_KEY}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>
          SSH 키 해석
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          유효 예시: <code>ssh-ed25519 ... comment</code>
        </p>
        <p className="section-desc">
          거절 예시: <code>{INVALID_KEY.slice(0, 60)}...</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.summary.keyType}</strong>
                  <span>key type</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.keyDetail}</strong>
                  <span>detail</span>
                </div>
                <div className="kpi">
                  <strong>{result.summary.rawBlobLength}</strong>
                  <span>blob bytes</span>
                </div>
              </div>

              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>comment</strong>
                  <span>{result.summary.comment ?? "없음"}</span>
                </div>
              </div>

              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  fingerprint 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">SSH key fingerprint를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 fingerprint를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.summary.sha256Fingerprint}</pre>
            </>
          ) : (
            <>
              <h3>OpenSSH 공개키를 해석할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
