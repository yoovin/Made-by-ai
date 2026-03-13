import Link from "next/link";
import { UuidGenerator } from "@/components/uuid-generator";

export default function UuidGeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>UUID 생성기</h1>
          <p className="section-desc">
            브라우저에서 UUID v4를 즉시 생성해 식별자나 테스트 데이터로 사용할 수 있는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 생성 결과를 저장하지 않습니다.</li>
          <li>이번 단계에서는 UUID v4 생성에 집중합니다.</li>
          <li>생성이 성공하면 결과를 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <UuidGenerator />
    </main>
  );
}
