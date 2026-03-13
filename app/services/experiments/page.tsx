import Link from "next/link";

export default function ExperimentsPage() {
  const experiments = [
    {
      name: "허브 검색",
      description: "등록된 서비스를 키워드로 검색하는 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/search"
    },
    {
      name: "서버 상태 대시보드",
      description: "기본 헬스 체크 응답과 점검 경로를 보여 주는 운영 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/server-status"
    },
    {
      name: "마크다운 메모장",
      description: "간단한 마크다운 메모를 로컬에 저장하고 다시 여는 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/markdown-memo"
    },
    {
      name: "Lorem Ipsum 생성기",
      description: "paragraph/sentence/word 단위 placeholder text를 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/lorem-ipsum-generator"
    },
    {
      name: "북마크 관리",
      description: "자주 쓰는 URL을 저장하고 다시 여는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/bookmarks"
    },
    {
      name: "작업 체크리스트",
      description: "짧은 할 일을 추가하고 완료 상태를 체크하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/checklist"
    },
    {
      name: "텍스트 카운터",
      description: "입력한 글의 문자 수와 단어 수를 바로 계산하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/text-counter"
    },
    {
      name: "JSON 포맷터/검증기",
      description: "JSON 문자열을 보기 좋게 정리하고 유효성을 검증하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/json-formatter"
    },
    {
      name: "JSON ↔ CSV 변환기",
      description: "평면 객체 배열 JSON과 헤더 포함 CSV를 서로 변환하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/json-csv-converter"
    },
    {
      name: "YAML ↔ JSON 변환기",
      description: "JSON-compatible YAML과 JSON을 서로 변환하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/yaml-json-converter"
    },
    {
      name: "TOML ↔ JSON 변환기",
      description: "TOML document와 JSON object를 서로 변환하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/toml-json-converter"
    },
    {
      name: "XML 포맷터/검증기",
      description: "well-formed XML을 검증하고 pretty-print output을 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/xml-formatter"
    },
    {
      name: "QR 코드 생성기",
      description: "텍스트를 QR 코드 이미지로 생성하고 다운로드할 수 있는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/qr-code-generator"
    },
    {
      name: "URL 인코더/디코더",
      description: "URL 문자열을 인코딩하거나 디코딩하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/url-encoder"
    },
    {
      name: "Base64 인코더/디코더",
      description: "문자열을 Base64로 인코딩하거나 원문으로 디코딩하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/base64-encoder"
    },
    {
      name: "숫자 포맷터",
      description: "숫자를 decimal, percent, currency 형식으로 포맷하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/number-formatter"
    },
    {
      name: "지속 시간 휴머나이저",
      description: "숫자 duration을 compact human-readable string으로 바꾸는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/duration-humanizer"
    },
    {
      name: "크론 표현식 파서",
      description: "표준 5필드 cron 표현식을 해석하고 검증하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/cron-expression-parser"
    },
    {
      name: "크론 빌더",
      description: "자주 쓰는 일정 입력을 표준 5필드 cron 표현식으로 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/cron-builder"
    },
    {
      name: "ENV 파서",
      description: ".env 스타일 입력을 파싱해 key/value와 JSON preview를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/env-parser"
    },
    {
      name: "ENV 빌더",
      description: "key/value 입력으로 deterministic .env 출력을 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/env-builder"
    },
    {
      name: "색상 변환기",
      description: "HEX, RGB, HSL 색상 값을 서로 변환하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/color-converter"
    },
    {
      name: "슬러그 생성기",
      description: "텍스트를 ASCII kebab-case slug로 바꾸는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/slug-generator"
    },
    {
      name: "SHA-256 생성기",
      description: "짧은 텍스트를 SHA-256 해시로 변환하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/sha256-generator"
    },
    {
      name: "케이스 변환기",
      description: "텍스트를 여러 케이스 형식으로 바꾸는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/case-converter"
    },
    {
      name: "쿼리 문자열 파서",
      description: "URL 또는 raw query를 파싱해 구조적으로 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/query-string-parser"
    },
    {
      name: "URL 파서",
      description: "absolute URL을 파싱해 origin, pathname, hash, query rows를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/url-parser"
    },
    {
      name: "쿼리 문자열 빌더",
      description: "ordered key/value rows를 deterministic query string으로 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/query-string-builder"
    },
    {
      name: "URL 빌더",
      description: "base URL, path, query rows, hash를 조합해 full URL을 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/url-builder"
    },
    {
      name: "JWT 디코더",
      description: "JWT 문자열의 header/payload를 decode-only 방식으로 읽는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/jwt-decoder"
    },
    {
      name: "HTML 엔티티 인코더/디코더",
      description: "HTML 특수문자를 엔티티로 인코딩하거나 디코딩하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/html-entity-encoder"
    },
    {
      name: "UUID 생성기",
      description: "브라우저에서 UUID v4를 즉시 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/uuid-generator"
    },
    {
      name: "진법 변환기",
      description: "정수를 2/8/10/16진수로 서로 변환하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/number-base-converter"
    },
    {
      name: "정규식 이스케이프 도구",
      description: "일반 텍스트를 정규식 source로 안전하게 바꾸는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/regex-escape"
    },
    {
      name: "텍스트 비교 도구",
      description: "두 텍스트를 정확히 비교해 차이 위치를 확인하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/text-diff-checker"
    },
    {
      name: "텍스트 치환 도구",
      description: "원문 텍스트에서 문자열을 literal 방식으로 치환하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/text-replace-tool"
    },
    {
      name: "줄 접두/접미 추가기",
      description: "여러 줄 텍스트 각 줄에 접두/접미를 붙여 포맷을 맞추는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-affix-tool"
    },
    {
      name: "줄 번호 추가기",
      description: "여러 줄 텍스트의 비어 있지 않은 줄에만 번호를 붙이는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-number-tool"
    },
    {
      name: "줄 들여쓰기 조정기",
      description: "여러 줄 텍스트를 spaces-only 기준으로 들여쓰기/내어쓰기하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-indent-tool"
    },
    {
      name: "줄 공백 정리기",
      description: "여러 줄 텍스트의 각 줄 앞뒤 공백을 정리하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-trim-tool"
    },
    {
      name: "줄바꿈 형식 변환기",
      description: "혼합된 줄바꿈 형식을 LF 또는 CRLF로 정규화하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-ending-tool"
    },
    {
      name: "빈 줄 정리기",
      description: "여러 줄 텍스트에서 빈 줄을 제거하거나 축약하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/blank-line-tool"
    },
    {
      name: "줄 목록 정리기",
      description: "여러 줄 텍스트를 정리하고 중복을 제거하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-list-cleaner"
    },
    {
      name: "줄 정렬기",
      description: "여러 줄 텍스트를 오름차순/내림차순으로 정렬하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-sort-tool"
    },
    {
      name: "포모도로 타이머",
      description: "focus/break 입력으로 동작하는 로컬 전용 타이머 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/pomodoro-timer"
    },
    {
      name: "비밀번호 생성기",
      description: "길이와 문자 종류를 선택해 로컬에서 비밀번호를 생성하는 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/password-generator"
    },
    {
      name: "ULID 생성기",
      description: "브라우저에서 시간 정렬 가능한 ULID를 즉시 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/ulid-generator"
    },
    {
      name: "시크릿 생성기",
      description: "앱 설정용 opaque secret을 여러 출력 형식으로 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/secret-generator"
    },
    {
      name: "TOTP 코드 해석기",
      description: "otpauth://totp URI를 해석하고 현재 TOTP 코드를 계산하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/totp-inspector"
    },
    {
      name: "HMAC 생성기",
      description: "메시지와 시크릿의 exact UTF-8 입력으로 HMAC hex digest를 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/hmac-generator"
    },
    {
      name: "인증서 요약기",
      description: "단일 PEM X.509 인증서를 해석해 subject, issuer, validity, SAN, fingerprint를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/certificate-inspector"
    },
    {
      name: "CSR 요약기",
      description: "단일 PEM PKCS#10 CSR을 해석해 subject, SAN, 공개키 메타데이터를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/csr-inspector"
    },
    {
      name: "공개키 요약기",
      description: "단일 PEM SPKI 공개키를 해석해 알고리즘, 키 세부 정보, fingerprint를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/public-key-inspector"
    },
    {
      name: "공개키 일치 확인기",
      description: "CERTIFICATE, CSR, PUBLIC KEY에서 추출한 공개키 fingerprint가 같은지 비교하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/public-key-match-checker"
    },
    {
      name: "PEM 블록 식별기",
      description: "붙여 넣은 PEM 텍스트의 block labels와 구성을 local-only로 식별하는 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/pem-block-inspector"
    },
    {
      name: "개인키 요약기",
      description: "single unencrypted PKCS#8 PEM 개인키를 해석해 key family와 metadata를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/private-key-inspector"
    },
    {
      name: "API 키 형식 판별기",
      description: "한 줄짜리 키 문자열의 prefix와 패턴으로 provider 형식을 식별하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/api-key-format-inspector"
    },
    {
      name: "SSH 키 지문 생성기",
      description: "단일 OpenSSH 공개키 한 줄을 해석해 key type과 SHA-256 fingerprint를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/ssh-key-fingerprint"
    },
    {
      name: "SHA-256 검증기",
      description: "텍스트의 SHA-256 hex digest를 비교해 match/mismatch를 확인하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/sha256-verifier"
    },
    {
      name: "Base64URL 인코더/디코더",
      description: "문자열을 URL-safe Base64로 인코딩하거나 원문으로 디코딩하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/base64url-encoder"
    },
    {
      name: "JWT 인코더",
      description: "JSON header/payload와 시크릿으로 HS256/384/512 JWT를 생성하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/jwt-encoder"
    },
    {
      name: "JWK 요약기",
      description: "단일 RSA/EC JWK JSON object를 해석해 metadata와 RFC 7638 thumbprint를 보여 주는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/jwk-inspector"
    },
  ];

  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">lab</span>
          </div>
          <h1>실험실</h1>
          <p className="section-desc">작은 기능을 실험하고 허브 서비스로 승격하기 전에 쌓아두는 공간입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">현재 실험 중인 아이디어</h2>
        <p className="section-desc">아직 정식 서비스로 등록되지 않았지만, 구상 중이거나 프로토타이핑 중인 기능들입니다.</p>
        
        <div className="grid">
          {experiments.map((exp, i) => (
            exp.href ? (
              <Link key={i} className="card" href={exp.href}>
                <div className="badge-row">
                  <span className={`badge ${exp.badgeClass}`}>{exp.status}</span>
                </div>
                <h3>{exp.name}</h3>
                <p>{exp.description}</p>
              </Link>
            ) : (
              <div key={i} className="card">
                <div className="badge-row">
                  <span className={`badge ${exp.badgeClass}`}>{exp.status}</span>
                </div>
                <h3>{exp.name}</h3>
                <p>{exp.description}</p>
              </div>
            )
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">실험실 규칙</h2>
        <ul className="list">
          <li>모든 아이디어는 최소한의 기능(MVP)으로 먼저 구현하여 실험합니다.</li>
          <li>사용성이 확인되고 안정성이 확보된 기능만 정식 허브 서비스로 승격됩니다.</li>
          <li>실험 중인 기능은 기존 허브의 핵심 동작에 영향을 주지 않도록 격리됩니다.</li>
          <li>유용하지 않거나 유지보수가 어려운 실험은 언제든 보류되거나 폐기될 수 있습니다.</li>
        </ul>
      </section>
    </main>
  );
}
