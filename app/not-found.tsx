import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="hero">
        <div className="badge-row">
          <span className="badge disabled">404</span>
          <span className="badge">navigation</span>
        </div>
        <h1>페이지를 찾을 수 없습니다</h1>
        <p>
          요청한 경로가 없거나 이동되었을 수 있습니다. 허브 메인으로 돌아가 현재 등록된 서비스를 다시 탐색해 보세요.
        </p>

        <div className="kpi-row">
          <div className="kpi">
            <strong>허브 복귀</strong>
            <span>메인 허브에서 전체 서비스 다시 탐색</span>
          </div>
          <div className="kpi">
            <strong>릴리즈 로그</strong>
            <span>최근 변경 이력과 새 서비스 확인</span>
          </div>
          <div className="kpi">
            <strong>허브 검색</strong>
            <span>등록된 서비스를 키워드로 바로 찾기</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">다시 이동하기</h2>
        <div className="grid">
          <Link className="card" href="/">
            <div className="badge-row">
              <span className="badge active">main</span>
            </div>
            <h3>허브 메인</h3>
            <p>현재 등록된 전체 서비스를 처음부터 다시 확인합니다.</p>
          </Link>

          <Link className="card" href="/services/search">
            <div className="badge-row">
              <span className="badge active">search</span>
            </div>
            <h3>허브 검색</h3>
            <p>서비스 이름과 설명, 태그를 기준으로 원하는 서비스를 찾습니다.</p>
          </Link>

          <Link className="card" href="/services/release-log">
            <div className="badge-row">
              <span className="badge beta">beta</span>
            </div>
            <h3>릴리즈 로그</h3>
            <p>최근에 어떤 서비스가 추가되고 바뀌었는지 확인합니다.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
