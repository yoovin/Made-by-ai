"use client";

import { useEffect, useState } from "react";
import { generateTotpCode, parseTotpUri, TotpCodeResult, TotpParseResult } from "@/lib/totp-tools";

type CopyStatus = "idle" | "copied" | "error";

const VALID_TOTP_URI =
  "otpauth://totp/Made%20by%20AI:demo@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Made%20by%20AI&algorithm=SHA1&digits=6&period=30";
const INVALID_TOTP_URI =
  "otpauth://hotp/Made%20by%20AI:demo@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Made%20by%20AI&counter=1";

export function TotpInspector() {
  const [input, setInput] = useState(VALID_TOTP_URI);
  const [parseResult, setParseResult] = useState<TotpParseResult | null>(null);
  const [codeResult, setCodeResult] = useState<TotpCodeResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (!parseResult?.ok) {
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      const nextResult = await generateTotpCode(parseResult.config);
      if (!cancelled) {
        setCodeResult(nextResult);
      }
    };

    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [parseResult]);

  function handleInspect() {
    setCopyStatus("idle");
    const nextParseResult = parseTotpUri(input);
    setParseResult(nextParseResult);
    setCodeResult(null);
  }

  function handleClear() {
    setInput("");
    setParseResult(null);
    setCodeResult(null);
    setCopyStatus("idle");
  }

  async function handleCopy() {
    if (!codeResult?.ok) {
      return;
    }

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(codeResult.code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">otpauth URI 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setCopyStatus("idle");
        }}
        placeholder={VALID_TOTP_URI}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleInspect}>
          해석하기
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          유효 예시: <code>{VALID_TOTP_URI}</code>
        </p>
        <p className="section-desc">
          거절 예시: <code>{INVALID_TOTP_URI}</code>
        </p>
      </div>

      {parseResult ? (
        <div className={`json-formatter-result ${parseResult.ok ? "ok" : "error"}`}>
          {parseResult.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{parseResult.config.algorithm}</strong>
                  <span>algorithm</span>
                </div>
                <div className="kpi">
                  <strong>{parseResult.config.digits}</strong>
                  <span>digits</span>
                </div>
                <div className="kpi">
                  <strong>{parseResult.config.period}s</strong>
                  <span>period</span>
                </div>
              </div>

              <div className="query-parser-list">
                <div className="query-parser-row">
                  <strong>label</strong>
                  <span>{parseResult.config.label}</span>
                </div>
                <div className="query-parser-row">
                  <strong>issuer</strong>
                  <span>{parseResult.config.issuer ?? "없음"}</span>
                </div>
                <div className="query-parser-row">
                  <strong>account</strong>
                  <span>{parseResult.config.accountName}</span>
                </div>
              </div>

              {codeResult ? (
                <div className={`json-formatter-result ${codeResult.ok ? "ok" : "error"}`}>
                  {codeResult.ok ? (
                    <>
                      <div className="kpi-row">
                        <div className="kpi">
                          <strong>{codeResult.code}</strong>
                          <span>현재 코드</span>
                        </div>
                        <div className="kpi">
                          <strong>{codeResult.timeRemaining}s</strong>
                          <span>남은 시간</span>
                        </div>
                        <div className="kpi">
                          <strong>{codeResult.counter}</strong>
                          <span>counter</span>
                        </div>
                      </div>
                      <p className="section-desc">생성 시각: {codeResult.generatedAtIso}</p>
                      <div className="json-formatter-actions">
                        <button className="bookmark-submit" type="button" onClick={handleCopy}>
                          코드 복사
                        </button>
                      </div>
                      {copyStatus === "copied" ? <p className="section-desc">현재 TOTP 코드를 클립보드에 복사했습니다.</p> : null}
                      {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 코드를 복사할 수 없습니다.</p> : null}
                      <pre className="json-formatter-output">{codeResult.code}</pre>
                    </>
                  ) : (
                    <>
                      <h3>코드를 생성할 수 없습니다</h3>
                      <p>{codeResult.error}</p>
                    </>
                  )}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h3>해석할 수 없습니다</h3>
              <p>{parseResult.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
