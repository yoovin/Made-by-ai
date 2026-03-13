"use client";

import Image from "next/image";
import { useState } from "react";
import { generateQrCode, QrCodeResult } from "@/lib/qr-code-tools";

const URL_EXAMPLE = "https://example.com/docs?page=1&sort=updated_at";
const WIFI_EXAMPLE = "WIFI:T:WPA;S:MadeByAI;P:local-tools;;";
const LONG_EXAMPLE = "x".repeat(520);

type CopyStatus = "idle" | "copied" | "error";

export function QrCodeGenerator() {
  const [input, setInput] = useState(URL_EXAMPLE);
  const [result, setResult] = useState<QrCodeResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleGenerate() {
    setCopyStatus("idle");
    setResult(await generateQrCode(input));
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
      await navigator.clipboard.writeText(result.copyText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  function handleDownload() {
    if (!result?.ok || typeof document === "undefined") {
      return;
    }

    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = "qr-code.png";
    link.click();
  }

  return (
    <section className="panel">
      <h2 className="section-title">QR 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={URL_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          생성
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">URL 예시: <code>{URL_EXAMPLE}</code></p>
        <p className="section-desc">Wi-Fi 예시: <code>{WIFI_EXAMPLE}</code></p>
        <p className="section-desc">제한 예시: <code>{LONG_EXAMPLE.slice(0, 24)}...</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.inputLength}</strong>
                  <span>입력 길이</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  원문 복사
                </button>
                <button className="bookmark-submit" type="button" onClick={handleDownload}>
                  PNG 다운로드
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">QR 원문을 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 원문을 복사할 수 없습니다.</p> : null}
              <div className="qr-code-preview">
                <Image src={result.dataUrl} alt="Generated QR code" width={320} height={320} unoptimized />
              </div>
            </>
          ) : (
            <>
              <h3>생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
