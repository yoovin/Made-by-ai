import Link from "next/link";

export default function ExperimentsPage() {
  const experiments = [
    {
      name: "허브 검색",
      description: "등록된 서비스를 키워드로 검색하는 기능",
      status: "탐색 중",
      badgeClass: "beta"
    },
    {
      name: "서버 상태 대시보드",
      description: "PM2 프로세스 및 포트 상태를 한눈에 보는 화면",
      status: "설계 중",
      badgeClass: "active"
    },
    {
      name: "마크다운 메모장",
      description: "간단한 노트를 마크다운으로 저장하는 서비스",
      status: "탐색 중",
      badgeClass: "beta"
    },
    {
      name: "북마크 관리",
      description: "자주 쓰는 URL을 허브에서 관리하는 서비스",
      status: "탐색 중",
      badgeClass: "beta"
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
            <div key={i} className="card">
              <div className="badge-row">
                <span className={`badge ${exp.badgeClass}`}>{exp.status}</span>
              </div>
              <h3>{exp.name}</h3>
              <p>{exp.description}</p>
            </div>
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
