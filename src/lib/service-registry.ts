import { ServiceEntry } from "@/types/service";

export const serviceRegistry: ServiceEntry[] = [
  {
    key: "hub-intro",
    slug: "hub-intro",
    family: "platform",
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
    family: "platform",
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
    family: "platform",
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
    family: "platform",
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
    family: "platform",
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
    family: "workspace",
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
    family: "workspace",
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
    key: "lorem-ipsum-generator",
    slug: "lorem-ipsum-generator",
    family: "workspace",
    title: "Lorem Ipsum 생성기",
    shortDescription: "고정 내부 corpus를 기반으로 paragraph/sentence/word placeholder text를 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 고정 내부 corpus를 기반으로 paragraph, sentence, word 단위 placeholder text를 생성하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/lorem-ipsum-generator",
    tags: ["lorem", "ipsum", "placeholder", "text", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "checklist",
    slug: "checklist",
    family: "workspace",
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
    key: "pomodoro-timer",
    slug: "pomodoro-timer",
    family: "workspace",
    title: "포모도로 타이머",
    shortDescription: "focus/break 입력으로 동작하는 로컬 전용 타이머 서비스",
    longDescription:
      "허브 안에서 focus/break minutes를 입력해 start/pause/reset/skip이 가능한 로컬 전용 포모도로 타이머입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/pomodoro-timer",
    tags: ["pomodoro", "timer", "focus", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "text-counter",
    slug: "text-counter",
    family: "text-tools",
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
    family: "structured-data",
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
    key: "json-csv-converter",
    slug: "json-csv-converter",
    family: "structured-data",
    title: "JSON ↔ CSV 변환기",
    shortDescription: "평면 객체 배열 JSON과 헤더 포함 CSV를 서로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 평면 객체 배열 JSON을 CSV로 바꾸거나, 헤더가 있는 CSV를 JSON 배열로 바꾸는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/json-csv-converter",
    tags: ["json", "csv", "converter", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "yaml-json-converter",
    slug: "yaml-json-converter",
    family: "structured-data",
    title: "YAML ↔ JSON 변환기",
    shortDescription: "JSON-compatible YAML과 JSON을 서로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 single-document YAML과 JSON을 서로 변환하는 로컬 전용 유틸리티입니다. 이번 단계에서는 JSON-compatible subset만 지원합니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/yaml-json-converter",
    tags: ["yaml", "json", "converter", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "toml-json-converter",
    slug: "toml-json-converter",
    family: "structured-data",
    title: "TOML ↔ JSON 변환기",
    shortDescription: "TOML document와 JSON object를 서로 변환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 TOML document를 JSON object로 바꾸거나 JSON object를 TOML로 바꾸는 로컬 전용 유틸리티입니다. 이번 단계에서는 엄격한 JSON/TOML 호환 subset만 지원합니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/toml-json-converter",
    tags: ["toml", "json", "converter", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "xml-formatter",
    slug: "xml-formatter",
    family: "structured-data",
    title: "XML 포맷터/검증기",
    shortDescription: "well-formed XML을 검증하고 pretty-print output을 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 XML 문자열을 well-formed 기준으로 검증하고 deterministic pretty-print 결과를 확인하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/xml-formatter",
    tags: ["xml", "formatter", "validator", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "qr-code-generator",
    slug: "qr-code-generator",
    family: "sharing-output",
    title: "QR 코드 생성기",
    shortDescription: "텍스트를 QR 코드 이미지로 생성하고 다운로드할 수 있는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 텍스트를 QR 코드 PNG로 생성하고 원문 복사 및 이미지 다운로드를 제공하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/qr-code-generator",
    tags: ["qr", "qrcode", "generator", "download", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "url-encoder",
    slug: "url-encoder",
    family: "url-query",
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
    family: "encoding-security",
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
    key: "base64url-encoder",
    slug: "base64url-encoder",
    family: "encoding-security",
    title: "Base64URL 인코더/디코더",
    shortDescription: "문자열을 URL-safe Base64로 인코딩하거나 원문으로 디코딩하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 텍스트를 JWT segment 등에 쓰는 URL-safe Base64(Base64URL) 형식으로 인코딩하거나 디코딩하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/base64url-encoder",
    tags: ["base64url", "base64", "url-safe", "jwt", "token", "encoding", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "timestamp-converter",
    slug: "timestamp-converter",
    family: "time-scheduling",
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
    key: "duration-humanizer",
    slug: "duration-humanizer",
    family: "time-scheduling",
    title: "지속 시간 휴머나이저",
    shortDescription: "숫자 duration을 compact human-readable string으로 바꾸는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 숫자 duration과 단위를 입력해 compact human-readable string, 총 milliseconds, 총 seconds로 변환하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/duration-humanizer",
    tags: ["duration", "time", "humanize", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "number-formatter",
    slug: "number-formatter",
    family: "format-convert",
    title: "숫자 포맷터",
    shortDescription: "숫자를 decimal, percent, currency 형식으로 포맷하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 숫자를 명시적인 locale 기준으로 decimal, percent, currency 형식으로 포맷하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/number-formatter",
    tags: ["number", "format", "currency", "percent", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "cron-expression-parser",
    slug: "cron-expression-parser",
    family: "time-scheduling",
    title: "크론 표현식 파서",
    shortDescription: "표준 5필드 cron 표현식을 해석하고 검증하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 표준 5필드 cron 표현식을 해석하고 각 필드 의미를 설명하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/cron-expression-parser",
    tags: ["cron", "schedule", "parser", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "cron-builder",
    slug: "cron-builder",
    family: "time-scheduling",
    title: "크론 빌더",
    shortDescription: "자주 쓰는 일정 입력을 표준 5필드 cron 표현식으로 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 자주 쓰는 일정 패턴을 표준 5필드 cron 표현식으로 생성하고 즉시 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/cron-builder",
    tags: ["cron", "builder", "schedule", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "env-parser",
    slug: "env-parser",
    family: "structured-data",
    title: "ENV 파서",
    shortDescription: ".env 스타일 입력을 파싱해 key/value와 JSON preview를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 dotenv 스타일 입력을 파싱해 key/value 구조, duplicate 경고, normalized output과 JSON preview를 확인하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/env-parser",
    tags: ["env", "dotenv", "parser", "config", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "env-builder",
    slug: "env-builder",
    family: "structured-data",
    title: "ENV 빌더",
    shortDescription: "key/value 입력으로 deterministic .env 출력을 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 구조화된 key/value 입력을 deterministic 한 .env 출력으로 생성하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/env-builder",
    tags: ["env", "dotenv", "builder", "config", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "color-converter",
    slug: "color-converter",
    family: "format-convert",
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
    family: "text-tools",
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
    family: "encoding-security",
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
    key: "sha256-verifier",
    slug: "sha256-verifier",
    family: "encoding-security",
    title: "SHA-256 검증기",
    shortDescription: "텍스트의 SHA-256 hex digest를 비교해 match/mismatch를 확인하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 텍스트를 SHA-256으로 계산한 뒤 붙여 넣은 hex digest와 비교해 local digest equality를 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/sha256-verifier",
    tags: ["sha256", "hash", "verify", "checksum", "digest", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "password-generator",
    slug: "password-generator",
    family: "encoding-security",
    title: "비밀번호 생성기",
    shortDescription: "길이와 문자 종류를 골라 로컬에서 비밀번호를 생성하는 미니 서비스",
    longDescription:
      "허브 안에서 길이와 문자 종류를 선택해 브라우저에서 비밀번호를 생성하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/password-generator",
    tags: ["password", "generator", "security", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "case-converter",
    slug: "case-converter",
    family: "text-tools",
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
    family: "url-query",
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
    key: "url-parser",
    slug: "url-parser",
    family: "url-query",
    title: "URL 파서",
    shortDescription: "absolute URL을 파싱해 origin, pathname, hash, query rows를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 full URL을 파싱해 origin, pathname, hash, query rows, normalized URL을 확인하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/url-parser",
    tags: ["url", "parser", "query", "developer", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "query-string-builder",
    slug: "query-string-builder",
    family: "url-query",
    title: "쿼리 문자열 빌더",
    shortDescription: "ordered key/value rows를 deterministic query string으로 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 ordered key/value rows를 deterministic percent-encoded query string으로 생성하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/query-string-builder",
    tags: ["query", "url", "params", "builder", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "url-builder",
    slug: "url-builder",
    family: "url-query",
    title: "URL 빌더",
    shortDescription: "base URL, path, query rows, hash를 조합해 full URL을 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 base URL, path, ordered query rows, hash를 조합해 deterministic 한 full URL을 생성하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/url-builder",
    tags: ["url", "builder", "query", "params", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "jwt-decoder",
    slug: "jwt-decoder",
    family: "encoding-security",
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
    key: "jwt-encoder",
    slug: "jwt-encoder",
    family: "encoding-security",
    title: "JWT 인코더",
    shortDescription: "JSON header/payload와 시크릿으로 HS256/384/512 JWT를 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 JSON header/payload와 시크릿을 입력해 HS256/384/512 compact JWT를 로컬에서 생성할 수 있는 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/jwt-encoder",
    tags: ["jwt", "token", "auth", "encoder", "sign", "hs256", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "html-entity-encoder",
    slug: "html-entity-encoder",
    family: "encoding-security",
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
    family: "encoding-security",
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
    key: "ulid-generator",
    slug: "ulid-generator",
    family: "encoding-security",
    title: "ULID 생성기",
    shortDescription: "브라우저에서 시간 정렬 가능한 ULID를 즉시 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 ULID를 생성해 정렬 가능한 식별자나 테스트 데이터로 바로 사용할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/ulid-generator",
    tags: ["ulid", "generator", "id", "security", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "secret-generator",
    slug: "secret-generator",
    family: "encoding-security",
    title: "시크릿 생성기",
    shortDescription: "앱 설정용 opaque secret을 여러 출력 형식으로 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 앱 설정이나 테스트용 opaque secret을 hex, base64url, base64 형식으로 생성하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/secret-generator",
    tags: ["secret", "token", "key", "security", "env", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "totp-inspector",
    slug: "totp-inspector",
    family: "encoding-security",
    title: "TOTP 코드 해석기",
    shortDescription: "otpauth://totp URI를 해석하고 현재 TOTP 코드를 계산하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 TOTP용 otpauth URI를 해석해 issuer/account metadata와 현재 코드를 확인하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/totp-inspector",
    tags: ["totp", "otp", "otpauth", "security", "auth", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "hmac-generator",
    slug: "hmac-generator",
    family: "encoding-security",
    title: "HMAC 생성기",
    shortDescription: "메시지와 시크릿의 정확한 UTF-8 입력으로 HMAC hex digest를 생성하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 메시지와 시크릿을 정확한 UTF-8 바이트 그대로 사용해 HMAC-SHA-256/384/512 hex digest를 생성하고 바로 복사할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/hmac-generator",
    tags: ["hmac", "mac", "signature", "security", "crypto", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "certificate-inspector",
    slug: "certificate-inspector",
    family: "encoding-security",
    title: "인증서 요약기",
    shortDescription: "단일 PEM X.509 인증서를 해석해 subject, issuer, validity, SAN, fingerprint를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 단일 PEM X.509 인증서를 해석해 subject, issuer, serial, validity, SAN, 공개키 메타데이터, SHA-256 fingerprint를 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/certificate-inspector",
    tags: ["certificate", "cert", "x509", "pem", "tls", "ssl", "fingerprint", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "csr-inspector",
    slug: "csr-inspector",
    family: "encoding-security",
    title: "CSR 요약기",
    shortDescription: "단일 PEM PKCS#10 CSR을 해석해 subject, SAN, 공개키 메타데이터를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 단일 PEM PKCS#10 CSR을 해석해 subject, SAN, 공개키 메타데이터, self-signature 상태, SHA-256 공개키 fingerprint를 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/csr-inspector",
    tags: ["csr", "certificate-request", "pkcs10", "pem", "x509", "fingerprint", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "public-key-inspector",
    slug: "public-key-inspector",
    family: "encoding-security",
    title: "공개키 요약기",
    shortDescription: "단일 PEM SPKI 공개키를 해석해 알고리즘, 키 세부 정보, fingerprint를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 단일 PEM SPKI 공개키를 해석해 알고리즘, 키 세부 정보, SPKI byte length, SHA-256 fingerprint를 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/public-key-inspector",
    tags: ["public-key", "public", "key", "spki", "pem", "fingerprint", "rsa", "ec", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "public-key-match-checker",
    slug: "public-key-match-checker",
    family: "encoding-security",
    title: "공개키 일치 확인기",
    shortDescription: "CERTIFICATE, CSR, PUBLIC KEY에서 추출한 공개키 fingerprint가 같은지 비교하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 단일 PEM CERTIFICATE, CSR, PUBLIC KEY에서 추출한 SHA-256 public-key/SPKI fingerprint를 비교해 같은 공개키 material인지 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/public-key-match-checker",
    tags: ["public-key", "spki", "compare", "match", "certificate", "csr", "pem", "fingerprint", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "pem-block-inspector",
    slug: "pem-block-inspector",
    family: "encoding-security",
    title: "PEM 블록 식별기",
    shortDescription: "붙여 넣은 PEM 텍스트의 block labels와 구성을 local-only로 식별하는 미니 서비스",
    longDescription:
      "허브 안에서 PEM 텍스트의 block labels, block count, bundle composition을 local-only로 식별해 어떤 downstream inspector를 열어야 하는지 판단할 수 있는 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/pem-block-inspector",
    tags: ["pem", "bundle", "certificate", "csr", "public-key", "private-key", "identify", "triage", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "private-key-inspector",
    slug: "private-key-inspector",
    family: "encoding-security",
    title: "개인키 요약기",
    shortDescription: "single unencrypted PKCS#8 PEM 개인키를 해석해 key family와 metadata를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 single unencrypted PKCS#8 PEM 개인키를 로컬에서 읽고 key family, key detail, PKCS#8 byte length를 요약하는 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/private-key-inspector",
    tags: ["private-key", "pkcs8", "pem", "rsa", "ec", "key", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "api-key-format-inspector",
    slug: "api-key-format-inspector",
    family: "encoding-security",
    title: "API 키 형식 판별기",
    shortDescription: "한 줄짜리 키 문자열의 prefix와 패턴으로 provider 형식을 식별하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 한 줄짜리 API 키/토큰 문자열을 붙여 넣어 prefix와 길이 패턴 기준으로 provider/format 후보를 식별하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/api-key-format-inspector",
    tags: ["api", "key", "apikey", "token", "format", "github", "aws", "google", "stripe", "telegram", "slack", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "jwk-inspector",
    slug: "jwk-inspector",
    family: "encoding-security",
    title: "JWK 요약기",
    shortDescription: "단일 RSA/EC JWK JSON object를 해석해 metadata와 RFC 7638 thumbprint를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 단일 RSA/EC JWK JSON object를 해석해 key type, metadata, RFC 7638 SHA-256 thumbprint를 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/jwk-inspector",
    tags: ["jwk", "jwks", "jose", "thumbprint", "kid", "rsa", "ec", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "ssh-key-fingerprint",
    slug: "ssh-key-fingerprint",
    family: "encoding-security",
    title: "SSH 키 지문 생성기",
    shortDescription: "단일 OpenSSH 공개키 한 줄을 해석해 key type과 SHA-256 fingerprint를 보여 주는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 단일 OpenSSH 공개키 한 줄을 해석해 key type, 세부 정보, raw blob length, SHA-256 fingerprint를 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/ssh-key-fingerprint",
    tags: ["ssh", "openssh", "authorized_keys", "ed25519", "rsa", "ecdsa", "fingerprint", "public-key", "productivity", "local"],
    updatedAt: "2026-03-12"
  },
  {
    key: "number-base-converter",
    slug: "number-base-converter",
    family: "format-convert",
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
    key: "regex-escape",
    slug: "regex-escape",
    family: "text-tools",
    title: "정규식 이스케이프 도구",
    shortDescription: "일반 텍스트를 정규식 source로 안전하게 바꾸는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 일반 텍스트를 정규식 source 문자열과 JavaScript regex literal preview로 바꾸는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/regex-escape",
    tags: ["regex", "escape", "developer", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "text-diff-checker",
    slug: "text-diff-checker",
    family: "text-tools",
    title: "텍스트 비교 도구",
    shortDescription: "두 텍스트를 정확히 비교해 동일 여부와 첫 차이 위치를 확인하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 두 텍스트를 exact compare하고 첫 차이 line/column을 확인할 수 있는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/text-diff-checker",
    tags: ["text", "diff", "compare", "developer", "productivity", "local"],
    updatedAt: "2026-03-10"
  },
  {
    key: "text-replace-tool",
    slug: "text-replace-tool",
    family: "text-tools",
    title: "텍스트 치환 도구",
    shortDescription: "원문 텍스트에서 문자열을 literal 방식으로 치환하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 텍스트를 literal 문자열 기준으로 찾아 바꾸는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/text-replace-tool",
    tags: ["text", "replace", "transform", "developer", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "line-affix-tool",
    slug: "line-affix-tool",
    family: "text-tools",
    title: "줄 접두/접미 추가기",
    shortDescription: "여러 줄 텍스트에 접두/접미를 붙여 포맷을 맞추는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 여러 줄 텍스트의 각 줄 앞뒤에 접두/접미를 추가해 목록이나 코드 조각을 빠르게 포맷하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/line-affix-tool",
    tags: ["lines", "prefix", "suffix", "format", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "line-number-tool",
    slug: "line-number-tool",
    family: "text-tools",
    title: "줄 번호 추가기",
    shortDescription: "여러 줄 텍스트에서 비어 있지 않은 줄에만 번호를 붙이는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 여러 줄 텍스트에 시작 번호와 구분자를 기준으로 줄 번호를 붙이고, 빈 줄은 유지하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/line-number-tool",
    tags: ["lines", "numbering", "format", "text", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "line-indent-tool",
    slug: "line-indent-tool",
    family: "text-tools",
    title: "줄 들여쓰기 조정기",
    shortDescription: "여러 줄 텍스트를 spaces-only 기준으로 들여쓰기/내어쓰기하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 여러 줄 텍스트를 일정 폭의 공백으로 들여쓰기 또는 내어쓰기하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/line-indent-tool",
    tags: ["indent", "outdent", "format", "text", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "line-trim-tool",
    slug: "line-trim-tool",
    family: "text-tools",
    title: "줄 공백 정리기",
    shortDescription: "여러 줄 텍스트의 각 줄 앞뒤 공백을 정리하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 여러 줄 텍스트의 각 줄 앞/뒤 공백을 정리하되 빈 줄은 유지하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/line-trim-tool",
    tags: ["trim", "whitespace", "lines", "text", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "line-ending-tool",
    slug: "line-ending-tool",
    family: "text-tools",
    title: "줄바꿈 형식 변환기",
    shortDescription: "혼합된 줄바꿈 형식을 LF 또는 CRLF로 정규화하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 혼합된 줄바꿈 형식을 LF 또는 CRLF로 정규화하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/line-ending-tool",
    tags: ["line-ending", "lf", "crlf", "text", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "blank-line-tool",
    slug: "blank-line-tool",
    family: "text-tools",
    title: "빈 줄 정리기",
    shortDescription: "여러 줄 텍스트에서 빈 줄을 정리하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 여러 줄 텍스트의 빈 줄을 제거하거나 연속 빈 줄을 1개만 유지하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/blank-line-tool",
    tags: ["blank", "lines", "cleanup", "text", "productivity", "local"],
    updatedAt: "2026-03-11"
  },
  {
    key: "line-list-cleaner",
    slug: "line-list-cleaner",
    family: "text-tools",
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
  },
  {
    key: "line-sort-tool",
    slug: "line-sort-tool",
    family: "text-tools",
    title: "줄 정렬기",
    shortDescription: "여러 줄 텍스트를 오름차순/내림차순으로 정렬하는 로컬 전용 미니 서비스",
    longDescription:
      "허브 안에서 여러 줄 텍스트를 정렬하면서 중복은 유지하고 빈 줄은 제외하는 로컬 전용 유틸리티입니다.",
    exposure: "card",
    status: "beta",
    category: "productivity",
    route: "/services/line-sort-tool",
    tags: ["lines", "sort", "alphabetical", "text", "productivity", "local"],
    updatedAt: "2026-03-11"
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
