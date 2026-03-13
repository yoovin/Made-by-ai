"use client";

import { useState } from "react";
import { replaceTextLiteral, TextReplaceResult } from "@/lib/text-replace-tools";

const SOURCE_EXAMPLE = "foo foo";
const FIND_EXAMPLE = "foo";
const REPLACE_EXAMPLE = "bar";

type CopyStatus = "idle" | "copied" | "error";

export function TextReplaceTool() {
  const [source, setSource] = useState(SOURCE_EXAMPLE);
  const [find, setFind] = useState(FIND_EXAMPLE);
  const [replaceWith, setReplaceWith] = useState(REPLACE_EXAMPLE);
  const [result, setResult] = useState<TextReplaceResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function handleReplace() {
    setCopyStatus("idle");
    setResult(replaceTextLiteral(source, find, replaceWith));
  }

  function handleClear() {
    setSource("");
    setFind("");
    setReplaceWith("");
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
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder={SOURCE_EXAMPLE}
      />

      <div className="bookmark-form">
        <input
          className="search-input"
          type="text"
          value={find}
          onChange={(event) => setFind(event.target.value)}
          placeholder={FIND_EXAMPLE}
        />
        <input
          className="search-input"
          type="text"
          value={replaceWith}
          onChange={(event) => setReplaceWith(event.target.value)}
          placeholder={REPLACE_EXAMPLE}
        />
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleReplace}>
          치환
        </button>
        <button className="bookmark-remove" type="button" onClick={handleClear}>
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">
          예시: <code>{SOURCE_EXAMPLE}</code> 에서 <code>{FIND_EXAMPLE}</code> 를 <code>{REPLACE_EXAMPLE}</code> 로 바꾸면 <code>bar bar</code>
        </p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi"><strong>{result.changed ? "changed" : "unchanged"}</strong><span>상태</span></div>
                <div className="kpi"><strong>{result.replacements}</strong><span>치환 횟수</span></div>
                <div className="kpi"><strong>{result.sourceLength}/{result.outputLength}</strong><span>문자 수</span></div>
              </div>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? (
                <p className="section-desc">치환 결과를 클립보드에 복사했습니다.</p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p>
              ) : null}
              <pre className="json-formatter-output">{result.output}</pre>
            </>
          ) : (
            <>
              <h3>치환할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
