import { ServiceEntry } from "@/types/service";

export type CategorySummary = {
  category: string;
  count: number;
  examples: string[];
};

export type TagSummary = {
  tag: string;
  count: number;
};

export type RecommendationBundle = {
  key: string;
  title: string;
  description: string;
  query: string;
  services: ServiceEntry[];
  matchCount: number;
};

export type FamilySummary = {
  family: string;
  title: string;
  description: string;
  query: string;
  count: number;
  services: ServiceEntry[];
};

type RecommendationDefinition = {
  key: string;
  title: string;
  description: string;
  query: string;
  matchTerms: string[];
  includeSlugs: string[];
};

const recommendationDefinitions: RecommendationDefinition[] = [
  {
    key: "hub-start",
    title: "허브 시작하기",
    description: "허브 구조와 최근 변경 흐름을 먼저 파악할 때 보는 묶음입니다.",
    query: "hub",
    matchTerms: ["hub", "core", "소개", "release", "history"],
    includeSlugs: ["hub-intro", "release-log", "experiments"],
  },
  {
    key: "ops-quick-check",
    title: "운영 빠른 점검",
    description: "현재 서버 상태와 운영 기록을 빠르게 확인할 때 쓰는 묶음입니다.",
    query: "ops",
    matchTerms: ["ops", "operations", "status", "health", "server"],
    includeSlugs: ["server-status", "release-log"],
  },
  {
    key: "local-productivity",
    title: "로컬 작업 도구",
    description: "브라우저 안에서 바로 쓰는 로컬 생산성 서비스를 모아 둔 묶음입니다.",
    query: "productivity",
    matchTerms: ["productivity", "memo", "markdown", "bookmark", "local", "notes"],
    includeSlugs: ["bookmarks", "markdown-memo"],
  },
];

const familyDefinitions = {
  platform: {
    title: "허브 운영",
    description: "허브 구조, 운영 상태, 릴리즈 흐름을 확인하는 핵심 surface 묶음입니다.",
    query: "hub ops",
  },
  workspace: {
    title: "개인 작업공간",
    description: "메모, 체크리스트, 북마크처럼 자주 열어 두는 작업 보조 도구 묶음입니다.",
    query: "workspace local",
  },
  'structured-data': {
    title: "구조화 데이터",
    description: "JSON, YAML, TOML, XML, ENV처럼 구조가 있는 데이터를 다루는 도구 묶음입니다.",
    query: "json yaml toml xml env",
  },
  'url-query': {
    title: "URL · Query",
    description: "URL, query string, 인코딩/빌드 흐름을 한 번에 다시 찾는 도구 묶음입니다.",
    query: "url query",
  },
  'time-scheduling': {
    title: "시간 · 스케줄",
    description: "timestamp, duration, cron처럼 시간 표현과 스케줄링 관련 도구를 모은 묶음입니다.",
    query: "time cron duration timestamp",
  },
  'encoding-security': {
    title: "인코딩 · 보안",
    description: "Base64, Base64URL, JWT encode/decode, JWK, UUID, ULID, 시크릿 생성, TOTP, HMAC, 인증서/CSR/공개키/개인키 요약, 공개키 일치 확인, PEM 블록 식별, API 키 형식 판별, SSH 키 지문, SHA-256 검증처럼 인코딩/식별/보안 보조 도구를 모은 묶음입니다.",
    query: "base64 base64url url-safe jwt encoder decoder sign hs256 hs384 hs512 jwk jwks jose thumbprint kid hash sha256 verify checksum digest uuid ulid secret token key totp otp otpauth hmac mac signature certificate cert x509 pem bundle identify triage tls ssl fingerprint csr certificate-request pkcs10 public-key spki compare match rsa ec private-key pkcs8 encrypted private key api key apikey github aws google stripe telegram slack ssh openssh authorized_keys ed25519 ecdsa",
  },
  'sharing-output': {
    title: "공유 · 출력",
    description: "QR 코드처럼 텍스트를 시각 출력 형태로 바꾸거나 공유하는 도구 묶음입니다.",
    query: "qr share output",
  },
  'format-convert': {
    title: "값 포맷 · 변환",
    description: "숫자, 진법, 색상처럼 값 자체를 다른 표현으로 바꾸는 도구 묶음입니다.",
    query: "number color base format",
  },
  'text-tools': {
    title: "텍스트 정리 · 생성",
    description: "텍스트를 비교, 치환, 정리, 생성하는 도구를 한 번에 다시 찾을 수 있는 묶음입니다.",
    query: "text lines lorem slug",
  },
} as const;

export function getCategorySummaries(services: ServiceEntry[]): CategorySummary[] {
  const grouped = new Map<string, ServiceEntry[]>();

  for (const service of services) {
    const current = grouped.get(service.category) ?? [];
    current.push(service);
    grouped.set(service.category, current);
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => ({
      category,
      count: items.length,
      examples: items.map((item) => item.title).sort().slice(0, 2),
    }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}

export function getTagSummaries(services: ServiceEntry[], limit = 8): TagSummary[] {
  const counts = new Map<string, number>();

  for (const service of services) {
    for (const tag of service.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag))
    .slice(0, limit);
}

export function getFamilySummaries(services: ServiceEntry[], query: string): FamilySummary[] {
  const grouped = new Map<string, ServiceEntry[]>();

  for (const service of services) {
    const current = grouped.get(service.family) ?? [];
    current.push(service);
    grouped.set(service.family, current);
  }

  const normalizedQuery = query.trim().toLowerCase();

  return Array.from(grouped.entries())
    .map(([family, items]) => {
      const definition = familyDefinitions[family as keyof typeof familyDefinitions];
      return {
        family,
        title: definition?.title ?? family,
        description: definition?.description ?? `${family} 관련 서비스 묶음입니다.`,
        query: definition?.query ?? family,
        count: items.length,
        services: items.slice(0, 4),
        matches:
          !normalizedQuery ||
          [family, definition?.title ?? "", definition?.description ?? "", definition?.query ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
      };
    })
    .filter((summary) => summary.matches)
    .sort((left, right) => right.count - left.count || left.title.localeCompare(right.title))
    .map(({ matches: _matches, ...summary }) => summary);
}

export function getRecommendationBundles(
  services: ServiceEntry[],
  query: string,
): RecommendationBundle[] {
  const normalizedQuery = query.trim().toLowerCase();
  const serviceMap = new Map(services.map((service) => [service.slug, service]));

  const bundles = recommendationDefinitions
    .map((definition) => {
      const bundleServices = definition.includeSlugs
        .map((slug) => serviceMap.get(slug))
        .filter((service): service is ServiceEntry => Boolean(service));

      const serviceHaystack = bundleServices
        .flatMap((service) => [service.title, service.shortDescription, service.category, service.tags.join(" ")])
        .join(" ")
        .toLowerCase();

      const bundleHaystack = [definition.title, definition.description, definition.matchTerms.join(" "), serviceHaystack]
        .join(" ")
        .toLowerCase();

      const matchCount = normalizedQuery
        ? bundleServices.filter((service) =>
            [service.title, service.shortDescription, service.category, service.tags.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
          ).length
        : 0;

      return {
        key: definition.key,
        title: definition.title,
        description: definition.description,
        query: definition.query,
        services: bundleServices,
        bundleMatches: normalizedQuery ? bundleHaystack.includes(normalizedQuery) : true,
        matchCount,
      };
    })
    .filter((bundle) => bundle.services.length > 0);

  if (!normalizedQuery) {
    return bundles.map(({ bundleMatches: _bundleMatches, ...bundle }) => bundle);
  }

  const matchingBundles = bundles.filter((bundle) => bundle.bundleMatches || bundle.matchCount > 0);
  const fallbackBundles = matchingBundles.length > 0 ? matchingBundles : bundles.slice(0, 2);

  return fallbackBundles
    .sort((left, right) => right.matchCount - left.matchCount || left.title.localeCompare(right.title))
    .map(({ bundleMatches: _bundleMatches, ...bundle }) => bundle);
}
