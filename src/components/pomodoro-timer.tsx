"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createPomodoroState,
  formatPomodoroSeconds,
  parsePomodoroMinutes,
  PomodoroSettings,
  PomodoroState,
  skipPomodoroPhase,
  tickPomodoroState,
} from "@/lib/pomodoro-timer-tools";

type ValidationErrors = {
  focus: string | null;
  break: string | null;
};

export function PomodoroTimer() {
  const [focusMinutesInput, setFocusMinutesInput] = useState("25");
  const [breakMinutesInput, setBreakMinutesInput] = useState("5");
  const [state, setState] = useState<PomodoroState>(() => createPomodoroState({ focusMinutes: 25, breakMinutes: 5 }));
  const [running, setRunning] = useState(false);

  const parsedSettings = useMemo(() => {
    const focus = parsePomodoroMinutes(focusMinutesInput, { min: 1, max: 60, label: "focus" });
    const rest = parsePomodoroMinutes(breakMinutesInput, { min: 1, max: 30, label: "break" });

    return {
      focus,
      rest,
    };
  }, [focusMinutesInput, breakMinutesInput]);

  const errors: ValidationErrors = useMemo(
    () => ({
      focus: parsedSettings.focus.ok ? null : parsedSettings.focus.error,
      break: parsedSettings.rest.ok ? null : parsedSettings.rest.error,
    }),
    [parsedSettings],
  );

  const validatedSettings = useMemo<PomodoroSettings | null>(() => {
    if (!parsedSettings.focus.ok || !parsedSettings.rest.ok) {
      return null;
    }

    return {
      focusMinutes: parsedSettings.focus.value,
      breakMinutes: parsedSettings.rest.value,
    };
  }, [parsedSettings]);

  function getValidatedSettings(): PomodoroSettings | null {
    return validatedSettings;
  }

  useEffect(() => {
    if (!running || !validatedSettings) {
      return;
    }

    const timer = window.setInterval(() => {
      setState((current) => tickPomodoroState(current, validatedSettings));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, validatedSettings]);

  function handleStart() {
    const settings = getValidatedSettings();
    if (!settings) {
      return;
    }

    setRunning(true);
  }

  function handlePause() {
    setRunning(false);
  }

  function handleReset() {
    const settings = getValidatedSettings();
    if (!settings) {
      return;
    }

    setRunning(false);
    setState(createPomodoroState(settings));
  }

  function handleSkip() {
    const settings = getValidatedSettings();
    if (!settings) {
      return;
    }

    setState((current) => skipPomodoroPhase(current, settings));
  }

  const phaseLabel = state.phase === "focus" ? "집중" : "휴식";

  return (
    <section className="panel">
      <h2 className="section-title">타이머 설정</h2>

      <div className="query-parser-list">
        <label className="query-parser-row">
          <strong>focus (분)</strong>
          <input value={focusMinutesInput} onChange={(event) => setFocusMinutesInput(event.target.value)} inputMode="numeric" />
        </label>
        {errors.focus ? <p className="section-desc">{errors.focus}</p> : null}

        <label className="query-parser-row">
          <strong>break (분)</strong>
          <input value={breakMinutesInput} onChange={(event) => setBreakMinutesInput(event.target.value)} inputMode="numeric" />
        </label>
        {errors.break ? <p className="section-desc">{errors.break}</p> : null}
      </div>

      <div className="json-formatter-actions">
        <button className="bookmark-submit" type="button" onClick={handleStart}>
          시작
        </button>
        <button className="bookmark-submit" type="button" onClick={handlePause}>
          일시정지
        </button>
        <button className="bookmark-submit" type="button" onClick={handleSkip}>
          다음 단계로 건너뛰기
        </button>
        <button className="bookmark-remove" type="button" onClick={handleReset}>
          초기화
        </button>
      </div>

      <div className="json-formatter-result ok">
        <div className="kpi-row">
          <div className="kpi">
            <strong>{phaseLabel}</strong>
            <span>현재 단계</span>
          </div>
          <div className="kpi">
            <strong>{formatPomodoroSeconds(state.remainingSeconds)}</strong>
            <span>남은 시간</span>
          </div>
          <div className="kpi">
            <strong>{state.completedFocusSessions}</strong>
            <span>완료한 집중 세션</span>
          </div>
        </div>
      </div>
    </section>
  );
}
