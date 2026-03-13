"use client";

import { useState } from "react";
import {
  DEFAULT_PASSWORD_OPTIONS,
  generatePassword,
  PasswordGeneratorOptions,
  PasswordGeneratorResult,
} from "@/lib/password-generator-tools";

type CopyStatus = "idle" | "copied" | "error";

type PasswordOptionKey =
  | "includeUppercase"
  | "includeLowercase"
  | "includeNumbers"
  | "includeSymbols";

const PASSWORD_OPTIONS: Array<{ key: PasswordOptionKey; label: string; description: string }> = [
  { key: "includeUppercase", label: "대문자", description: "A-Z" },
  { key: "includeLowercase", label: "소문자", description: "a-z" },
  { key: "includeNumbers", label: "숫자", description: "0-9" },
  { key: "includeSymbols", label: "기호", description: "!@#$..." },
];

function createDefaultOptions(): PasswordGeneratorOptions {
  return { ...DEFAULT_PASSWORD_OPTIONS };
}

export function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordGeneratorOptions>(createDefaultOptions);
  const [result, setResult] = useState<PasswordGeneratorResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleGenerate() {
    setCopyStatus("idle");
    setResult(generatePassword(options));
  }

  function handleClear() {
    setOptions(createDefaultOptions());
    setResult(null);
    setCopyStatus("idle");
  }

  function handleToggle(key: PasswordOptionKey, checked: boolean) {
    setOptions((current) => ({
      ...current,
      [key]: checked,
    }));
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
      await navigator.clipboard.writeText(result.password);
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
          <strong>길이</strong>
          <input
            value={options.lengthInput}
            onChange={(event) => {
              setOptions((current) => ({
                ...current,
                lengthInput: event.target.value,
              }));
              setCopyStatus("idle");
            }}
            inputMode="numeric"
          />
          <span>8~64자 사이에서 생성합니다.</span>
        </label>

        <div className="password-generator-options">
          {PASSWORD_OPTIONS.map((option) => (
            <label className="password-generator-option" key={option.key}>
              <input
                type="checkbox"
                checked={options[option.key]}
                onChange={(event) => handleToggle(option.key, event.target.checked)}
              />
              <div>
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleGenerate}>
          비밀번호 생성
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
                  <strong>{result.length}</strong>
                  <span>길이</span>
                </div>
                <div className="kpi">
                  <strong>{result.selectedGroups.length}</strong>
                  <span>선택 그룹</span>
                </div>
                <div className="kpi">
                  <strong>{result.characterPoolSize}</strong>
                  <span>문자 풀</span>
                </div>
              </div>
              <p className="section-desc">포함 문자 종류: {result.selectedGroups.join(", ")}</p>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 비밀번호를 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <pre className="json-formatter-output">{result.password}</pre>
            </>
          ) : (
            <>
              <h3>비밀번호를 생성할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
