export type ApiKeyProviderKey =
  | "aws"
  | "google"
  | "github"
  | "stripe"
  | "telegram"
  | "slack"
  | "unknown";

export type ApiKeyFormatKey =
  | "access-key-id"
  | "temporary-access-key-id"
  | "api-key"
  | "personal-access-token"
  | "fine-grained-personal-access-token"
  | "oauth-token"
  | "user-token"
  | "server-token"
  | "refresh-token"
  | "publishable-key"
  | "secret-key"
  | "bot-token"
  | "app-token"
  | "unknown";

export type ApiKeySummary = {
  providerKey: ApiKeyProviderKey;
  providerLabel: string;
  formatKey: ApiKeyFormatKey;
  formatLabel: string;
  tokenClass: string;
  confidence: "high" | "medium" | "unknown";
  length: number;
  prefixPreview: string;
  notes: string[];
};

export type ApiKeyFormatResult =
  | {
      ok: true;
      summary: ApiKeySummary;
    }
  | {
      ok: false;
      error: string;
    };

type Detector = {
  providerKey: Exclude<ApiKeyProviderKey, "unknown">;
  providerLabel: string;
  formatKey: Exclude<ApiKeyFormatKey, "unknown">;
  formatLabel: string;
  tokenClass: string;
  confidence: "high" | "medium";
  pattern: RegExp;
  notes: string[];
};

const DETECTORS: Detector[] = [
  {
    providerKey: "github",
    providerLabel: "GitHub",
    formatKey: "fine-grained-personal-access-token",
    formatLabel: "fine-grained personal access token",
    tokenClass: "developer token",
    confidence: "medium",
    pattern: /^github_pat_[A-Za-z0-9_]{20,}$/,
    notes: ["GitHub fine-grained PAT 형식과 일치합니다.", "형식 식별만 수행하며 권한이나 만료 여부는 확인하지 않습니다."],
  },
  {
    providerKey: "github",
    providerLabel: "GitHub",
    formatKey: "personal-access-token",
    formatLabel: "personal access token",
    tokenClass: "developer token",
    confidence: "high",
    pattern: /^ghp_[A-Za-z0-9]{30,}$/,
    notes: ["GitHub classic personal access token 형식과 일치합니다.", "형식 식별만 수행하며 실제 유효성은 검증하지 않습니다."],
  },
  {
    providerKey: "github",
    providerLabel: "GitHub",
    formatKey: "oauth-token",
    formatLabel: "OAuth token",
    tokenClass: "oauth token",
    confidence: "high",
    pattern: /^gho_[A-Za-z0-9]{30,}$/,
    notes: ["GitHub OAuth token 형식과 일치합니다."],
  },
  {
    providerKey: "github",
    providerLabel: "GitHub",
    formatKey: "user-token",
    formatLabel: "user-to-server token",
    tokenClass: "app token",
    confidence: "high",
    pattern: /^ghu_[A-Za-z0-9]{30,}$/,
    notes: ["GitHub App user-to-server token 형식과 일치합니다."],
  },
  {
    providerKey: "github",
    providerLabel: "GitHub",
    formatKey: "secret-key",
    formatLabel: "server-to-server token",
    tokenClass: "app token",
    confidence: "high",
    pattern: /^ghs_[A-Za-z0-9]{30,}$/,
    notes: ["GitHub App server-to-server token 형식과 일치합니다."],
  },
  {
    providerKey: "github",
    providerLabel: "GitHub",
    formatKey: "refresh-token",
    formatLabel: "refresh token",
    tokenClass: "refresh token",
    confidence: "high",
    pattern: /^ghr_[A-Za-z0-9]{30,}$/,
    notes: ["GitHub refresh token 형식과 일치합니다."],
  },
  {
    providerKey: "aws",
    providerLabel: "AWS",
    formatKey: "access-key-id",
    formatLabel: "access key id",
    tokenClass: "cloud credential",
    confidence: "high",
    pattern: /^AKIA[0-9A-Z]{16}$/,
    notes: ["AWS IAM access key id 형식과 일치합니다.", "secret access key 자체는 이 도구에서 식별하지 않습니다."],
  },
  {
    providerKey: "aws",
    providerLabel: "AWS",
    formatKey: "temporary-access-key-id",
    formatLabel: "temporary access key id",
    tokenClass: "cloud credential",
    confidence: "high",
    pattern: /^ASIA[0-9A-Z]{16}$/,
    notes: ["AWS temporary access key id 형식과 일치합니다."],
  },
  {
    providerKey: "google",
    providerLabel: "Google",
    formatKey: "api-key",
    formatLabel: "API key",
    tokenClass: "api credential",
    confidence: "medium",
    pattern: /^AIza[0-9A-Za-z\-_]{20,40}$/,
    notes: ["Google API key 형식과 일치합니다.", "프로젝트 연결 여부나 활성 상태는 확인하지 않습니다."],
  },
  {
    providerKey: "stripe",
    providerLabel: "Stripe",
    formatKey: "publishable-key",
    formatLabel: "publishable key",
    tokenClass: "api credential",
    confidence: "high",
    pattern: /^pk_(test|live)_[0-9A-Za-z]{16,}$/,
    notes: ["Stripe publishable key 형식과 일치합니다."],
  },
  {
    providerKey: "stripe",
    providerLabel: "Stripe",
    formatKey: "secret-key",
    formatLabel: "secret key",
    tokenClass: "api credential",
    confidence: "high",
    pattern: /^sk_(test|live)_[0-9A-Za-z]{16,}$/,
    notes: ["Stripe secret key 형식과 일치합니다."],
  },
  {
    providerKey: "telegram",
    providerLabel: "Telegram",
    formatKey: "bot-token",
    formatLabel: "bot token",
    tokenClass: "bot credential",
    confidence: "medium",
    pattern: /^\d{6,12}:[A-Za-z0-9_-]{30,}$/,
    notes: ["Telegram bot token 형식과 일치합니다."],
  },
  {
    providerKey: "slack",
    providerLabel: "Slack",
    formatKey: "bot-token",
    formatLabel: "bot token",
    tokenClass: "workspace token",
    confidence: "medium",
    pattern: /^xoxb-[0-9A-Za-z-]{20,}$/,
    notes: ["Slack bot token 형식과 일치합니다."],
  },
  {
    providerKey: "slack",
    providerLabel: "Slack",
    formatKey: "user-token",
    formatLabel: "user token",
    tokenClass: "workspace token",
    confidence: "medium",
    pattern: /^xoxp-[0-9A-Za-z-]{20,}$/,
    notes: ["Slack user token 형식과 일치합니다."],
  },
  {
    providerKey: "slack",
    providerLabel: "Slack",
    formatKey: "app-token",
    formatLabel: "app-level token",
    tokenClass: "app token",
    confidence: "medium",
    pattern: /^xapp-[0-9A-Za-z-]{20,}$/,
    notes: ["Slack app-level token 형식과 일치합니다."],
  },
];

function getPrefixPreview(value: string) {
  if (value.length <= 4) {
    return "••••";
  }

  if (value.length <= 10) {
    return `${value.slice(0, 2)}…${value.slice(-2)}`;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function identifyApiKeyFormat(input: string): ApiKeyFormatResult {
  if (/\r|\n/.test(input)) {
    return {
      ok: false,
      error: "이번 단계에서는 한 줄짜리 키 문자열만 지원합니다.",
    };
  }

  const normalized = input.trim();

  if (!normalized) {
    return {
      ok: false,
      error: "판별할 키 문자열을 입력해 주세요.",
    };
  }

  const detector = DETECTORS.find((item) => item.pattern.test(normalized));
  if (!detector) {
    return {
      ok: true,
      summary: {
        providerKey: "unknown",
        providerLabel: "알 수 없음",
        formatKey: "unknown",
        formatLabel: "unknown/unsupported",
        tokenClass: "unclassified",
        confidence: "unknown",
        length: normalized.length,
        prefixPreview: getPrefixPreview(normalized),
        notes: [
          "현재 지원하는 형식 패턴과 일치하지 않거나 형식이 애매합니다.",
          "이 도구는 pattern-based format identifier이며 실제 유효성이나 권한은 검증하지 않습니다.",
        ],
      },
    };
  }

  return {
    ok: true,
    summary: {
      providerKey: detector.providerKey,
      providerLabel: detector.providerLabel,
      formatKey: detector.formatKey,
      formatLabel: detector.formatLabel,
      tokenClass: detector.tokenClass,
      confidence: detector.confidence,
      length: normalized.length,
      prefixPreview: getPrefixPreview(normalized),
      notes: detector.notes,
    },
  };
}
