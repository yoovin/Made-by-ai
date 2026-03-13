"use client";

import { useState } from "react";
import { convertJsonToYaml, convertYamlToJson, YamlJsonResult } from "@/lib/yaml-json-tools";

const JSON_EXAMPLE = '{"name":"made-by-ai","active":true,"ports":[4000,80]}';
const YAML_EXAMPLE = "active: true\nname: made-by-ai\nports:\n  - 4000\n  - 80";
const MULTI_DOC_EXAMPLE = "---\nname: alpha\n---\nname: beta";

type CopyStatus = "idle" | "copied" | "error";

export function YamlJsonConverter() {
  const [input, setInput] = useState(YAML_EXAMPLE);
  const [result, setResult] = useState<YamlJsonResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleYamlToJson() {
    setCopyStatus("idle");
    setResult(convertYamlToJson(input));
  }

  function handleJsonToYaml() {
    setCopyStatus("idle");
    setResult(convertJsonToYaml(input));
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
      <h2 className="section-title">YAML 또는 JSON 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={YAML_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleYamlToJson}>
          YAML → JSON
        </button>
        <button className="bookmark-submit" type="button" onClick={handleJsonToYaml}>
          JSON → YAML
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          YAML 예시: <code>{YAML_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          JSON 예시: <code>{JSON_EXAMPLE}</code>
        </p>
        <p className="section-desc">
          지원하지 않는 예시: <code>{MULTI_DOC_EXAMPLE}</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.action === "yaml-to-json" ? "YAML → JSON 완료" : "JSON → YAML 완료"}</strong>
                  <span>실행 결과</span>
                </div>
                <div className="kpi">
                  <strong>{result.rootType}</strong>
                  <span>루트 타입</span>
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
                  {result.action === "yaml-to-json"
                    ? "JSON 결과를 클립보드에 복사했습니다."
                    : "YAML 결과를 클립보드에 복사했습니다."}
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
