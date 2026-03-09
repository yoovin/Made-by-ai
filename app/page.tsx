import Link from "next/link";
import { getCategories, getVisibleServices } from "@/lib/service-registry";

export default function HomePage() {
  const services = getVisibleServices();
  const categories = getCategories();

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
