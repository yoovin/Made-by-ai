"use client";

import { useState } from "react";
import { buildCronExpression, CronBuilderInput, CronBuilderMode, CronBuilderResult } from "@/lib/cron-builder-tools";

type CopyStatus = "idle" | "copied" | "error";

const DAY_OPTIONS = [
  { value: 0, label: "일요일" },
  { value: 1, label: "월요일" },
  { value: 2, label: "화요일" },
  { value: 3, label: "수요일" },
  { value: 4, label: "목요일" },
  { value: 5, label: "금요일" },
  { value: 6, label: "토요일" },
];

export function CronBuilder() {
  const [mode, setMode] = useState<CronBuilderMode>("every-n-minutes");
  const [intervalMinutes, setIntervalMinutes] = useState("5");
  const [hour, setHour] = useState("9");
  const [minute, setMinute] = useState("0");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [result, setResult] = useState<CronBuilderResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function buildInput(): CronBuilderInput {
    return {
      mode,
      intervalMinutes: Number(intervalMinutes),
      hour: Number(hour),
      minute: Number(minute),
      dayOfWeek: Number(dayOfWeek),
    };
  }

  function handleBuild() {
    setCopyStatus("idle");
    setResult(buildCronExpression(buildInput()));
  }

  function handleClear() {
    setMode("every-n-minutes");
    setIntervalMinutes("5");
    setHour("9");
    setMinute("0");
    setDayOfWeek("1");
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

  return (
    <section className="panel">
      <h2 className="section-title">스케줄 입력</h2>
      <div className="query-parser-list">
        <label className="query-parser-row">
          <strong>모드</strong>
          <select value={mode} onChange={(event) => setMode(event.target.value as CronBuilderMode)}>
            <option value="every-n-minutes">매 N분</option>
            <option value="daily">매일 HH:MM</option>
            <option value="weekdays">평일 HH:MM</option>
            <option value="weekly">매주 요일 HH:MM</option>
          </select>
        </label>

        {mode === "every-n-minutes" ? (
          <label className="query-parser-row">
            <strong>분 간격</strong>
            <input value={intervalMinutes} onChange={(event) => setIntervalMinutes(event.target.value)} inputMode="numeric" />
          </label>
        ) : null}

        {mode !== "every-n-minutes" ? (
          <>
            <label className="query-parser-row">
              <strong>시</strong>
              <input value={hour} onChange={(event) => setHour(event.target.value)} inputMode="numeric" />
            </label>
            <label className="query-parser-row">
              <strong>분</strong>
              <input value={minute} onChange={(event) => setMinute(event.target.value)} inputMode="numeric" />
            </label>
          </>
        ) : null}

        {mode === "weekly" ? (
          <label className="query-parser-row">
            <strong>요일</strong>
            <select value={dayOfWeek} onChange={(event) => setDayOfWeek(event.target.value)}>
              {DAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleBuild}>
          빌드
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
                  <strong>{result.expression}</strong>
                  <span>생성된 표현식</span>
                </div>
              </div>
              <p>{result.explanation.summary}</p>
              <div className="json-formatter-actions">
                <button className="bookmark-submit" type="button" onClick={handleCopy}>
                  결과 복사
                </button>
              </div>
              {copyStatus === "copied" ? <p className="section-desc">생성된 표현식을 클립보드에 복사했습니다.</p> : null}
              {copyStatus === "error" ? <p className="section-desc">이 브라우저에서는 결과를 복사할 수 없습니다.</p> : null}
              <div className="query-parser-list">
                {result.explanation.fields.map((field) => (
                  <div className="query-parser-row" key={field.key}>
                    <strong>{field.label}</strong>
                    <span>{field.explanation}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3>빌드할 수 없습니다</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
