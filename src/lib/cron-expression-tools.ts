export type CronFieldKey = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

export type CronFieldExplanation = {
  key: CronFieldKey;
  label: string;
  expression: string;
  explanation: string;
};

export type CronExpressionResult =
  | {
      ok: true;
      normalizedExpression: string;
      summary: string;
      fields: CronFieldExplanation[];
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

type CronFieldConfig = {
  key: CronFieldKey;
  label: string;
  min: number;
  max: number;
  wildcardLabel: string;
  singlePrefix: string;
  listPrefix: string;
  rangePrefix: string;
};

type ParsedInteger = { value: number } | { error: string };
type ParsedSegment = { explanation: string } | { error: string };
type ParsedField = { field: CronFieldExplanation } | { error: string };

const FIELD_CONFIGS: CronFieldConfig[] = [
  {
    key: "minute",
    label: "분",
    min: 0,
    max: 59,
    wildcardLabel: "매분",
    singlePrefix: "매시",
    listPrefix: "분 목록",
    rangePrefix: "분 범위",
  },
  {
    key: "hour",
    label: "시",
    min: 0,
    max: 23,
    wildcardLabel: "매시",
    singlePrefix: "매일",
    listPrefix: "시 목록",
    rangePrefix: "시 범위",
  },
  {
    key: "dayOfMonth",
    label: "일(월 기준)",
    min: 1,
    max: 31,
    wildcardLabel: "매일",
    singlePrefix: "매월",
    listPrefix: "일 목록",
    rangePrefix: "일 범위",
  },
  {
    key: "month",
    label: "월",
    min: 1,
    max: 12,
    wildcardLabel: "매월",
    singlePrefix: "매년",
    listPrefix: "월 목록",
    rangePrefix: "월 범위",
  },
  {
    key: "dayOfWeek",
    label: "요일",
    min: 0,
    max: 6,
    wildcardLabel: "모든 요일",
    singlePrefix: "요일",
    listPrefix: "요일 목록",
    rangePrefix: "요일 범위",
  },
];

function parseInteger(value: string, config: CronFieldConfig): ParsedInteger {
  if (!/^\d+$/.test(value)) {
    return { error: `${config.label} 필드의 \`${value}\` 는 숫자만 지원합니다.` } as const;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < config.min || parsed > config.max) {
    return { error: `${config.label} 값은 ${config.min}부터 ${config.max} 사이여야 합니다.` } as const;
  }

  return { value: parsed } as const;
}

function describeRange(start: number, end: number, config: CronFieldConfig) {
  return `${config.rangePrefix} ${start}-${end}`;
}

function parseSegment(segment: string, config: CronFieldConfig): ParsedSegment {
  if (!segment) {
    return { error: `${config.label} 필드에 빈 세그먼트가 있습니다.` } as const;
  }

  if (segment === "*") {
    return { explanation: config.wildcardLabel } as const;
  }

  if (segment.includes("/")) {
    const [base, stepRaw, ...extra] = segment.split("/");

    if (!base || !stepRaw || extra.length) {
      return { error: `${config.label} 필드의 step 문법이 올바르지 않습니다.` } as const;
    }

    const step = parseInteger(stepRaw, { ...config, min: 1 });
    if ("error" in step) {
      return { error: `${config.label} step 값은 1 이상의 정수여야 합니다.` } as const;
    }

    if (base === "*") {
      return { explanation: `${config.wildcardLabel}, ${step.value} 간격` } as const;
    }

    if (!base.includes("-")) {
      return { error: `${config.label} 필드의 step 문법은 */n 또는 a-b/n 형식만 지원합니다.` } as const;
    }

    const [startRaw, endRaw, ...rangeExtra] = base.split("-");
    if (!startRaw || !endRaw || rangeExtra.length) {
      return { error: `${config.label} 필드의 범위 문법이 올바르지 않습니다.` } as const;
    }

    const start = parseInteger(startRaw, config);
    const end = parseInteger(endRaw, config);
    if ("error" in start) return start;
    if ("error" in end) return end;
    if (start.value >= end.value) {
      return { error: `${config.label} 범위의 시작값은 끝값보다 작아야 합니다.` } as const;
    }

    return { explanation: `${describeRange(start.value, end.value, config)}, ${step.value} 간격` } as const;
  }

  if (segment.includes("-")) {
    const [startRaw, endRaw, ...extra] = segment.split("-");
    if (!startRaw || !endRaw || extra.length) {
      return { error: `${config.label} 필드의 범위 문법이 올바르지 않습니다.` } as const;
    }

    const start = parseInteger(startRaw, config);
    const end = parseInteger(endRaw, config);
    if ("error" in start) return start;
    if ("error" in end) return end;
    if (start.value >= end.value) {
      return { error: `${config.label} 범위의 시작값은 끝값보다 작아야 합니다.` } as const;
    }

    return { explanation: describeRange(start.value, end.value, config) } as const;
  }

  const single = parseInteger(segment, config);
  if ("error" in single) {
    return single;
  }

  return { explanation: `${config.singlePrefix} ${single.value}` } as const;
}

function parseField(expression: string, config: CronFieldConfig): ParsedField {
  if (expression.includes("@") || /[?LW#A-Za-z]/.test(expression)) {
    return { error: `${config.label} 필드에는 표준 5필드 cron subset만 사용할 수 있습니다.` } as const;
  }

  const segments = expression.split(",");
  const explanations: string[] = [];

  for (const segment of segments) {
    const parsed = parseSegment(segment, config);
    if ("error" in parsed) {
      return parsed;
    }
    explanations.push(parsed.explanation);
  }

  const explanation = explanations.length === 1 ? explanations[0] : `${config.listPrefix}: ${explanations.join(", ")}`;

  return {
    field: {
      key: config.key,
      label: config.label,
      expression,
      explanation,
    },
  } as const;
}

export function parseCronExpression(input: string): CronExpressionResult {
  const normalized = input.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return { ok: false, error: "해석할 크론 표현식을 입력해 주세요." };
  }

  if (normalized.startsWith("@")) {
    return { ok: false, error: "이번 단계에서는 @daily 같은 macro 문법을 지원하지 않습니다." };
  }

  const parts = normalized.split(" ");
  if (parts.length !== 5) {
    return { ok: false, error: "이번 단계에서는 5필드 cron 표현식만 지원합니다. (minute hour day-of-month month day-of-week)" };
  }

  const fields: CronFieldExplanation[] = [];

  for (const [index, config] of FIELD_CONFIGS.entries()) {
    const parsed = parseField(parts[index], config);
    if ("error" in parsed) {
      return { ok: false, error: parsed.error };
    }
    fields.push(parsed.field);
  }

  const summary = fields.map((field) => `${field.label}: ${field.explanation}`).join(" | ");
  const copyText = [`Cron 표현식: ${normalized}`, `요약: ${summary}`, ...fields.map((field) => `- ${field.label}: ${field.explanation}`)].join("\n");

  return {
    ok: true,
    normalizedExpression: normalized,
    summary,
    fields,
    copyText,
  };
}
