import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, serviceRegistry } from "@/lib/service-registry";

export function generateStaticParams() {
  return serviceRegistry.map((service) => ({
    slug: service.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className={`badge ${service.status}`}>{service.status}</span>
            <span className="badge">{service.category}</span>
          </div>
          <h1>{service.title}</h1>
          <p className="section-desc">{service.shortDescription}</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2>서비스 설명</h2>
        <p className="section-desc">{service.longDescription}</p>
      </section>

      <section className="panel">
        <h2>서비스 메타데이터</h2>
        <ul className="list">
          <li>slug: {service.slug}</li>
          <li>route: {service.route}</li>
          <li>exposure: {service.exposure}</li>
          <li>updatedAt: {service.updatedAt}</li>
          <li>tags: {service.tags.join(", ")}</li>
        </ul>
      </section>

      <section className="panel">
        <h2>다음 확장 예시</h2>
        <ul className="list">
          <li>실제 기능 구현 화면 추가</li>
          <li>허브 검색 기능 연결</li>
          <li>권한 / 베타 플래그 / 사용자별 노출 제어</li>
          <li>서비스별 지표와 체인지로그 연결</li>
        </ul>
      </section>
    </main>
  );
}
