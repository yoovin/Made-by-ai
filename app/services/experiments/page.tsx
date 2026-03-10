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
      name: "줄 목록 정리기",
      description: "여러 줄 텍스트를 정리하고 중복을 제거하는 로컬 전용 서비스로 승격 완료",
      status: "승격 완료",
      badgeClass: "active",
      href: "/services/line-list-cleaner"
    },
    {
      name: "포모도로 타이머",
      description: "집중 작업 타이머",
      status: "보류",
      badgeClass: "disabled"
    }
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
