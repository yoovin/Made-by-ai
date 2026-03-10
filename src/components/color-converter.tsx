"use client";

import { useState } from "react";
import { ColorFormatResult, convertColorInput } from "@/lib/color-tools";

const HEX_EXAMPLE = "#ff0000";
const RGB_EXAMPLE = "rgb(255, 255, 0)";
const HSL_EXAMPLE = "hsl(240, 100%, 50%)";
const INVALID_EXAMPLE = "#12G";

export function ColorConverter() {
  const [input, setInput] = useState(HEX_EXAMPLE);
  const [result, setResult] = useState<ColorFormatResult | null>(null);

  return (
    <section className="panel">
      <h2 className="section-title">색상 입력</h2>
      <textarea
        className="json-formatter-textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={HEX_EXAMPLE}
      />

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={() => setResult(convertColorInput(input))}>
          변환
        </button>
        <button
          className="bookmark-remove"
          type="button"
          onClick={() => {
            setInput("");
            setResult(null);
          }}
        >
          지우기
        </button>
      </div>

      <div className="json-formatter-examples">
        <p className="section-desc">HEX 예시: <code>{HEX_EXAMPLE}</code></p>
        <p className="section-desc">RGB 예시: <code>{RGB_EXAMPLE}</code></p>
        <p className="section-desc">HSL 예시: <code>{HSL_EXAMPLE}</code></p>
        <p className="section-desc">오류 예시: <code>{INVALID_EXAMPLE}</code></p>
      </div>

      {result ? (
        <div className={`json-formatter-result ${result.ok ? "ok" : "error"}`}>
          {result.ok ? (
            <>
              <div className="kpi-row">
                <div className="kpi">
                  <strong>{result.hex}</strong>
                  <span>HEX</span>
                </div>
                <div className="kpi">
                  <strong>{result.rgb}</strong>
                  <span>RGB</span>
                </div>
                <div className="kpi">
                  <strong>{result.hsl}</strong>
                  <span>HSL</span>
                </div>
              </div>
              <div className="color-converter-preview" style={{ backgroundColor: result.hex }} />
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
