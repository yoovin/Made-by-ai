import Link from "next/link";
import { getCategories, getVisibleServices } from "@/lib/service-registry";
import { getHomeQuickStartBundles, getRecentUpdatedServices } from "@/lib/home-discovery";

export default function HomePage() {
  const services = getVisibleServices();
  const categories = getCategories();
  const quickStartBundles = getHomeQuickStartBundles(services);
  const recentUpdates = getRecentUpdatedServices(services);

  return (
    <main>
      <section className="hero">
        <div className="badge-row">
          <span className="badge active">허브형 플랫폼</span>
          <span className="badge beta">AI 자동 확장</span>
          <span className="badge active">포트 80 서비스</span>
        </div>
        <h1>Made by AI</h1>
        <p>
          이 앱은 하나의 첫 엔트리를 중심으로 서비스들을 계속 추가하는 허브형 웹서비스입니다.
          사용자는 여기서 모든 서비스를 카드, 버튼, 링크 형태로 접근합니다.
        </p>

        <div className="kpi-row">
          <div className="kpi">
            <strong>{services.length}</strong>
            <span>현재 등록된 서비스</span>
          </div>
          <div className="kpi">
            <strong>{categories.length}</strong>
            <span>서비스 카테고리</span>
          </div>
          <div className="kpi">
            <strong>1</strong>
            <span>영구 엔트리 허브</span>
          </div>
        </div>
      </section>

      <section className="panel home-guided-access">
        <div className="home-guided-header">
          <div>
            <h2 className="section-title home-guided-title">빠르게 시작하기</h2>
            <p className="section-desc">
              처음 들어왔을 때 자주 찾는 경로를 목적별로 바로 따라갈 수 있게 정리했습니다.
            </p>
          </div>
          <Link className="back-link" href="/services/search">
            허브 검색으로 전체 둘러보기
          </Link>
        </div>

        <div className="home-quick-start-grid">
          {quickStartBundles.map((bundle) => (
            <section className="home-quick-start-card" key={bundle.key}>
              <div className="badge-row">
                <span className="badge active">빠른 시작</span>
              </div>
              <h3>{bundle.title}</h3>
              <p>{bundle.description}</p>
              <div className="home-quick-start-links">
                {bundle.services.map((service) => (
                  <Link className="hint-chip" key={service.key} href={service.route}>
                    {service.title}
                  </Link>
                ))}
              </div>
              <Link className="back-link home-quick-start-query" href={`/services/search?q=${encodeURIComponent(bundle.query)}`}>
                이 묶음으로 다시 찾기
              </Link>
            </section>
          ))}
        </div>
      </section>

      <section className="panel home-recent-updates">
        <div className="home-guided-header">
          <div>
            <h2 className="section-title home-guided-title">최근 업데이트</h2>
            <p className="section-desc">
              최근에 정리되거나 추가된 서비스부터 빠르게 확인할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="home-recent-grid">
          {recentUpdates.map((service) => (
            <Link className="card" key={service.key} href={service.route}>
              <div className="badge-row">
                <span className={`badge ${service.status}`}>{service.status}</span>
                <span className="badge">{service.category}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDescription}</p>
              <span className="card-meta">업데이트 {service.updatedAt}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">서비스 목록</h2>
        <p className="section-desc">
          새 기능은 반드시 서비스 레지스트리에 등록되어야 하며, 이 화면에서 접근 가능해야 합니다.
        </p>

        <div className="grid">
          {services.map((service) => (
            <Link className="card" key={service.key} href={service.route}>
              <div className="badge-row">
                <span className={`badge ${service.status}`}>{service.status}</span>
                <span className="badge">{service.category}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDescription}</p>
              <span className="card-meta">업데이트 {service.updatedAt}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="footer-note">
        새 기능을 추가할 때는 페이지를 만든 뒤 <code>src/lib/service-registry.ts</code>에 등록하세요.
      </p>
    </main>
  );
}
