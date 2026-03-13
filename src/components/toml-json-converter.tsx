"use client";

import { useState } from "react";
import { convertJsonToToml, convertTomlToJson, TomlJsonResult } from "@/lib/toml-json-tools";

const TOML_EXAMPLE = 'active = true\nname = "made-by-ai"\n\n[server]\nport = 4000\npublicPort = 80';
const JSON_EXAMPLE = '{"name":"made-by-ai","active":true,"server":{"publicPort":80,"port":4000}}';
const INVALID_EXAMPLE = '{"name":null}';

type CopyStatus = "idle" | "copied" | "error";

export function TomlJsonConverter() {
  const [input, setInput] = useState(TOML_EXAMPLE);
  const [result, setResult] = useState<TomlJsonResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleTomlToJson() {
    setCopyStatus("idle");
    setResult(convertTomlToJson(input));
  }

  function handleJsonToToml() {
    setCopyStatus("idle");
    setResult(convertJsonToToml(input));
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
      await navigator.clipboard.writeText(result.output);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="panel">
      <h2 className="section-title">TOML 또는 JSON 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={TOML_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleTomlToJson}>
          TOML → JSON
        </button>
        <button className="bookmark-submit" type="button" onClick={handleJsonToToml}>
          JSON → TOML
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          TOML 예시: <code>{TOML_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          JSON 예시: <code>{JSON_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          지원하지 않는 예시: <code>{INVALID_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.action === "toml-to-json" ? "TOML → JSON 완료" : "JSON → TOML 완료"}</strong>
                  <span>실행 결과</span>
                </div>
                <div className="kpi">
                  <strong>{result.rootType}</strong>
                  <span>루트 타입</span>
                </div>
                <div className="kpi">
                  <strong>{result.topLevelKeys}</strong>
                  <span>최상위 키 수</span>
                </div>
                <div className="kpi">
                  <strong>{result.lineCount}</strong>
                  <span>줄 수</span>
                </div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? (
                <p className="section-desc">
                  {result.action === "toml-to-json"
                    ? "JSON 결과를 클립보드에 복사했습니다."
                    : "TOML 결과를 클립보드에 복사했습니다."}
                </p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
              <pre className="json-formatter-output">{result.output}</pre>
            </>
          ) : (
            <>
              <h3>변환할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
