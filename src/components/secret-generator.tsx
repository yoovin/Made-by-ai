"use client";

import { useState } from "react";
import {
  DEFAULT_SECRET_OPTIONS,
  generateSecret,
  SecretFormat,
  SecretGeneratorOptions,
  SecretGeneratorResult,
} from "@/lib/secret-generator-tools";

type CopyStatus = "idle" | "copied" | "error";

const SECRET_FORMATS: Array<{ value: SecretFormat; label: string; description: string }> = [
  { value: "base64url", label: "Base64URL", description: "URL-safe, 패딩 제거" },
  { value: "hex", label: "HEX", description: "0-9, a-f" },
  { value: "base64", label: "Base64", description: "+ / = 포함" },
];

function createDefaultOptions(): SecretGeneratorOptions {
  return { ...DEFAULT_SECRET_OPTIONS };
}

export function SecretGenerator() {
  const [options, setOptions] = useState<SecretGeneratorOptions>(createDefaultOptions);
  const [result, setResult] = useState<SecretGeneratorResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleGenerate() {
    setCopyStatus("idle");
    setResult(generateSecret(options));
  }

  function handleClear() {
    setOptions(createDefaultOptions());
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
      await navigator.clipboard.writeText(result.secret);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">생성 설정</h2>

      <div className="query-parser-list">
        <label className="query-parser-row">
          <strong>바이트 길이</strong>
          <input
            value={options.byteLengthInput}
            onChange={(event) => {
              setOptions((current) => ({
                ...current,
                byteLengthInput: event.target.value,
              }));
              setCopyStatus("idle");
            }}
            inputMode="numeric"
          />
          <span>16~64바이트 사이에서 생성합니다. 기본값은 32바이트입니다.</span>
        </label>

        <label className="query-parser-row">
          <strong>출력 형식</strong>
          <select
            value={options.format}
            onChange={(event) => {
              setOptions((current) => ({
                ...current,
                format: event.target.value as SecretFormat,
              }));
              setCopyStatus("idle");
            }}
          >
            {SECRET_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
          <span>{SECRET_FORMATS.find((format) => format.value === options.format)?.description}</span>
        </label>
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          시크릿 생성
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.format}</strong>
                  <span>형식</span>
                </div>
                <div className="kpi">
                  <strong>{result.byteLength}</strong>
                  <span>바이트</span>
                </div>
                <div className="kpi">
                  <strong>{result.outputLength}</strong>
                  <span>출력 길이</span>
                </div>
              </div>
              <p className="section-desc">사람이 외우는 비밀번호가 아니라 앱 설정용 opaque secret 출력입니다.</p>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 시크릿을 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.secret}</pre>
            </>
          ) : (
            <>
              <h3>시크릿을 생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
