import { ServiceEntry } from "@/types/service";

export const serviceRegistry: ServiceEntry[] = [
  {
    key: "hub-intro",
    slug: "hub-intro",
    title: "허브 소개",
    shortDescription: "이 플랫폼이 어떤 구조로 커지는지 설명하는 기본 서비스",
    longDescription:
      "Made by AI는 하나의 허브 화면 안으로 서비스가 계속 추가되는 구조입니다. 사용자는 허브에서 카드를 눌러 개별 서비스로 이동합니다.",
    exposure: "card",
    status: "active",
    category: "core",
    route: "/services/hub-intro",
    tags: ["hub", "onboarding", "core"],
    updatedAt: "2026-03-09"
  },
  {
    key: "release-log",
    slug: "release-log",
    title: "릴리즈 로그",
    shortDescription: "최근 릴리즈와 체인지로그 방향을 확인하는 서비스",
    longDescription:
      "AI가 어떤 방향으로 기능을 추가하고 개선했는지 사용자가 한 곳에서 볼 수 있는 릴리즈 로그 화면입니다.",
    exposure: "card",
    status: "beta",
    category: "operations",
    route: "/services/release-log",
    tags: ["changelog", "history", "ops"],
    updatedAt: "2026-03-09"
  },
  {
    key: "experiments",
    slug: "experiments",
    title: "실험실",
    shortDescription: "새로운 기능을 작게 실험한 뒤 허브로 승격하기 위한 영역",
    longDescription:
      "무한 확장을 하더라도 바로 메인 기능으로 올리지 않고, 작은 실험을 거쳐 서비스로 승격하는 공간입니다.",
    exposure: "card",
    status: "beta",
    category: "lab",
    route: "/services/experiments",
    tags: ["beta", "experiment", "growth"],
    updatedAt: "2026-03-09"
  },
  {
    key: "server-status",
    slug: "server-status",
    title: "서버 상태 대시보드",
    shortDescription: "현재 헬스 체크 응답과 허브 운영 상태를 빠르게 확인하는 서비스",
    longDescription:
      "허브 앱의 기본 상태와 점검 경로를 한 화면에서 확인할 수 있는 작은 운영 서비스입니다.",
    exposure: "card",
    status: "active",
    category: "operations",
    route: "/services/server-status",
    tags: ["health", "ops", "status"],
    updatedAt: "2026-03-10"
  },
  {
    key: "search",
    slug: "search",
    title: "허브 검색",
    shortDescription: "등록된 서비스를 키워드로 빠르게 찾는 검색 서비스",
    longDescription:
      "허브에 등록된 서비스를 제목, 설명, 카테고리, 태그 기준으로 찾아 바로 이동할 수 있는 검색 서비스입니다.",
    exposure: "card",
    status: "active",
    category: "core",
    route: "/services/search",
    tags: ["search", "discovery", "hub"],
    updatedAt: "2026-03-10"
  },
  {
    key: "bookmarks",
    slug: "bookmarks",
    title: "북마크 관리",
    shortDescription: "자주 여는 링크를 저장하고 다시 여는 로컬 전용 북마크 서비스",
    longDescription:
      "허브 안에서 자주 쓰는 URL을 제목과 함께 저장하고 다시 열 수 있는 로컬 브라우저 전용 북마크 서비스입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/bookmarks",
    tags: ["bookmark", "links", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "markdown-memo",
    slug: "markdown-memo",
    title: "마크다운 메모장",
    shortDescription: "마크다운 원문을 로컬에 저장하고 다시 여는 간단한 메모 서비스",
    longDescription:
      "허브 안에서 짧은 마크다운 메모를 작성하고 현재 브라우저에 저장해 다시 이어서 볼 수 있는 로컬 전용 서비스입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/markdown-memo",
    tags: ["markdown", "memo", "notes", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "checklist",
    slug: "checklist",
    title: "작업 체크리스트",
    shortDescription: "로컬 브라우저 기준으로 짧은 할 일을 저장하고 체크하는 미니 서비스",
    longDescription:
      "허브 안에서 간단한 작업 목록을 추가하고 완료 상태를 표시할 수 있는 로컬 전용 체크리스트 서비스입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/checklist",
    tags: ["checklist", "tasks", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "text-counter",
    slug: "text-counter",
    title: "텍스트 카운터",
    shortDescription: "입력한 글의 문자 수와 단어 수를 바로 계산하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 입력한 텍스트의 문자 수, 공백 제외 문자 수, 단어 수, 줄 수를 즉시 계산해 확인할 수 있는 로컬 전용 서비스입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/text-counter",
    tags: ["text", "counter", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "json-formatter",
    slug: "json-formatter",
    title: "JSON 포맷터/검증기",
    shortDescription: "JSON 문자열을 보기 좋게 정리하고 유효성을 확인하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 JSON 문자열을 포맷하고 유효성을 검증하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/json-formatter",
    tags: ["json", "formatter", "validator", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "url-encoder",
    slug: "url-encoder",
    title: "URL 인코더/디코더",
    shortDescription: "URL 문자열을 퍼센트 인코딩하거나 다시 읽기 쉬운 형태로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 URL 문자열을 인코딩하거나 디코딩하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/url-encoder",
    tags: ["url", "encoding", "decoder", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "base64-encoder",
    slug: "base64-encoder",
    title: "Base64 인코더/디코더",
    shortDescription: "문자열을 Base64로 인코딩하거나 원문으로 디코딩하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 텍스트를 UTF-8 안전 방식으로 Base64 인코딩하거나 디코딩하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/base64-encoder",
    tags: ["base64", "encoding", "decoder", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "timestamp-converter",
    slug: "timestamp-converter",
    title: "타임스탬프 변환기",
    shortDescription: "Unix 초/밀리초와 ISO 8601 UTC를 서로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 Unix 타임스탬프와 ISO 8601 UTC 문자열을 서로 변환하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/timestamp-converter",
    tags: ["timestamp", "unix", "iso", "datetime", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "color-converter",
    slug: "color-converter",
    title: "색상 변환기",
    shortDescription: "HEX, RGB, HSL 색상 값을 서로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 HEX, RGB, HSL 색상 표현을 서로 변환하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/color-converter",
    tags: ["color", "hex", "rgb", "hsl", "converter", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "slug-generator",
    slug: "slug-generator",
    title: "슬러그 생성기",
    shortDescription: "텍스트를 URL과 파일명에 쓰기 쉬운 slug로 바꾸는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 입력한 텍스트를 ASCII kebab-case slug로 바꾸는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/slug-generator",
    tags: ["slug", "seo", "url", "writer", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "sha256-generator",
    slug: "sha256-generator",
    title: "SHA-256 생성기",
    shortDescription: "짧은 텍스트를 SHA-256 해시로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 입력한 텍스트를 SHA-256 해시 문자열로 변환하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/sha256-generator",
    tags: ["sha256", "hash", "security", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "case-converter",
    slug: "case-converter",
    title: "케이스 변환기",
    shortDescription: "텍스트를 다양한 프로그래밍/문서용 케이스 형식으로 바꾸는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 텍스트를 camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case로 변환하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/case-converter",
    tags: ["case", "camel", "snake", "kebab", "text", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "query-string-parser",
    slug: "query-string-parser",
    title: "쿼리 문자열 파서",
    shortDescription: "URL 또는 raw query 문자열을 파싱해 키와 값을 구조적으로 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 URL 또는 raw query 문자열을 파싱해 중복 키, 정규화된 query, 디코딩된 값을 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/query-string-parser",
    tags: ["query", "url", "params", "parser", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "jwt-decoder",
    slug: "jwt-decoder",
    title: "JWT 디코더",
    shortDescription: "JWT 문자열의 header/payload를 decode-only 방식으로 읽는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 JWT 문자열을 decode-only 방식으로 파싱해 header, payload, 시간 claim을 확인하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/jwt-decoder",
    tags: ["jwt", "token", "auth", "decoder", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "html-entity-encoder",
    slug: "html-entity-encoder",
    title: "HTML 엔티티 인코더/디코더",
    shortDescription: "HTML 특수문자를 엔티티로 인코딩하거나 디코딩하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 HTML 특수문자와 숫자 엔티티를 인코딩/디코딩하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/html-entity-encoder",
    tags: ["html", "entity", "encode", "decode", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "uuid-generator",
    slug: "uuid-generator",
    title: "UUID 생성기",
    shortDescription: "브라우저에서 UUID v4를 즉시 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 UUID v4를 생성해 테스트 데이터나 식별자 후보로 바로 사용할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/uuid-generator",
    tags: ["uuid", "generator", "id", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "number-base-converter",
    slug: "number-base-converter",
    title: "진법 변환기",
    shortDescription: "정수를 2/8/10/16진수로 서로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 2진수, 8진수, 10진수, 16진수 정수를 서로 변환하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/number-base-converter",
    tags: ["number", "base", "binary", "hex", "converter", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "line-list-cleaner",
    slug: "line-list-cleaner",
    title: "줄 목록 정리기",
    shortDescription: "여러 줄 텍스트를 정리해 중복 제거 결과를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 여러 줄 텍스트를 정리하고, 입력 순서 유지 결과와 정렬 결과를 함께 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/line-list-cleaner",
    tags: ["lines", "dedupe", "sort", "text", "productivity", "local"],
    updatedAt: "2026-03-10"
  }
];

export function getVisibleServices(): ServiceEntry[] {
  return serviceRegistry.filter((service) => service.status !== "hidden");
}

export function getServiceBySlug(slug: string): ServiceEntry | undefined {
  return serviceRegistry.find((service) => service.slug === slug);
}

export function getCategories(): string[] {
  return Array.from(new Set(serviceRegistry.map((service) => service.category)));
}
