"use client";

import { useMemo, useState } from "react";
import { analyzeText } from "@/lib/text-analysis";

const SAMPLE_TEXT = "Hello world\nTwo lines";

export function TextCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <section className="panel">
      <h2 className="section-title">텍스트 입력</h2>
      <textarea
        className="text-counter-textarea"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={SAMPLE_TEXT}
      />
      <p className="section-desc">입력한 텍스트는 브라우저 안에서만 계산되며 서버로 전송되지 않습니다.</p>

      <div className="text-counter-grid">
        <div className="kpi">
          <strong>{stats.characters}</strong>
          <span>문자 수</span>
        </div>
        <div className="kpi">
          <strong>{stats.nonWhitespaceCharacters}</strong>
          <span>공백 제외</span>
        </div>
        <div className="kpi">
          <strong>{stats.words}</strong>
          <span>단어 수</span>
        </div>
        <div className="kpi">
          <strong>{stats.lines}</strong>
          <span>줄 수</span>
        </div>
      </div>

      <div className="text-counter-fixture">
        <h3>검증용 예시</h3>
        <p>
          입력값 <code>{SAMPLE_TEXT}</code> 에 대해 문자 수 21, 공백 제외 18, 단어 수 4, 줄 수 2가 보여야 합니다.
        </p>
      </div>
    </section>
  );
}
