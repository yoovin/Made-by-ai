export type PomodoroPhase = "focus" | "break";

export type PomodoroSettings = {
  focusMinutes: number;
  breakMinutes: number;
};

export type PomodoroState = {
  phase: PomodoroPhase;
  remainingSeconds: number;
  completedFocusSessions: number;
};

export type PomodoroMinutesParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

export function parsePomodoroMinutes(input: string, options: { min: number; max: number; label: string }): PomodoroMinutesParseResult {
  const normalized = input.trim();

  if (!normalized) {
    return {
      ok: false,
      error: `${options.label} 시간을 입력해 주세요.`,
    };
  }

  const value = Number(normalized);

  if (!Number.isInteger(value) || value < options.min || value > options.max) {
    return {
      ok: false,
      error: `${options.label} 시간은 ${options.min}부터 ${options.max} 사이의 정수만 지원합니다.`,
    };
  }

  return { ok: true, value };
}

export function createPomodoroState(settings: PomodoroSettings): PomodoroState {
  return {
    phase: "focus",
    remainingSeconds: settings.focusMinutes * 60,
    completedFocusSessions: 0,
  };
}

export function tickPomodoroState(state: PomodoroState, settings: PomodoroSettings): PomodoroState {
  if (state.remainingSeconds > 1) {
    return {
      ...state,
      remainingSeconds: state.remainingSeconds - 1,
    };
  }

  if (state.phase === "focus") {
    return {
      phase: "break",
      remainingSeconds: settings.breakMinutes * 60,
      completedFocusSessions: state.completedFocusSessions + 1,
    };
  }

  return {
    phase: "focus",
    remainingSeconds: settings.focusMinutes * 60,
    completedFocusSessions: state.completedFocusSessions,
  };
}

export function skipPomodoroPhase(state: PomodoroState, settings: PomodoroSettings): PomodoroState {
  if (state.phase === "focus") {
    return {
      phase: "break",
      remainingSeconds: settings.breakMinutes * 60,
      completedFocusSessions: state.completedFocusSessions,
    };
  }

  return {
    phase: "focus",
    remainingSeconds: settings.focusMinutes * 60,
    completedFocusSessions: state.completedFocusSessions,
  };
}

export function formatPomodoroSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
