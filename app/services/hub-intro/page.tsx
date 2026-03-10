import Link from "next/link";
import { getVisibleServices } from "@/lib/service-registry";

export default function HubIntroPage() {
  const services = getVisibleServices();

  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge active">active</span>
            <span className="badge">core</span>
          </div>
          <h1>허브 소개</h1>
          <p className="section-desc">이 플랫폼이 어떤 구조로 커지는지 설명하는 기본 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">플랫폼 소개</h2>
        <p className="section-desc">
          Made by AI는 하나의 허브 화면 안으로 서비스가 계속 추가되는 구조입니다.
          새로운 기능은 별도의 사이트가 아닌 &quot;허브 안에 추가되는 새 서비스&quot;로 취급되며,
          AI에 의해 지속적으로 확장되고 진화합니다.
        </p>
      </section>

      <section className="panel">
        <h2 className="section-title">어떻게 서비스가 추가되나</h2>
        <p className="section-desc">새로운 서비스가 추가될 때는 반드시 다음 4단계 규칙을 따릅니다.</p>
        <ul className="list">
          <li><strong>1. 라우트 생성:</strong> <code>app/services/[slug]/page.tsx</code> 등 전용 화면을 만듭니다.</li>
          <li><strong>2. 레지스트리 등록:</strong> <code>src/lib/service-registry.ts</code>에 서비스 메타데이터를 등록합니다.</li>
          <li><strong>3. 허브 연결:</strong> 사용자가 허브 화면에서 카드를 클릭해 접근할 수 있도록 연결합니다.</li>
          <li><strong>4. 체인지로그 기록:</strong> <code>ops/changelog/CHANGELOG.md</code>에 변경 사항과 검증 결과를 기록합니다.</li>
        </ul>
      </section>

      <section className="panel">
        <h2 className="section-title">현재 서비스 현황</h2>
        <p className="section-desc">현재 허브에 등록되어 운영 중인 서비스들을 registry 기준으로 그대로 보여줍니다.</p>
        <div className="grid">
          {services.map((service) => (
            <Link className="card" key={service.key} href={service.route}>
              <div className="badge-row">
                <span className={`badge ${service.status}`}>{service.status}</span>
                <span className="badge">{service.category}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">개발 원칙</h2>
        <ul className="list">
          <li><strong>안전 우선:</strong> 프로덕션 장애를 방지하기 위해 가장 안전하고 가치 있는 작은 작업부터 수행합니다.</li>
          <li><strong>작은 변경:</strong> 되돌릴 수 있는 작은 변경을 선호하며, 거대한 커밋을 지양합니다.</li>
          <li><strong>고아 페이지 금지:</strong> 사용자 접근 경로 없이 허브에 연결되지 않는 페이지는 만들지 않습니다.</li>
          <li><strong>투명한 보고:</strong> 모든 진행 흐름과 중요한 변화는 텔레그램을 통해 실시간으로 보고됩니다.</li>
        </ul>
      </section>
    </main>
  );
}
