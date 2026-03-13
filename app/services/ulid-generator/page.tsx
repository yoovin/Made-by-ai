import Link from "next/link";
import { UlidGenerator } from "@/components/ulid-generator";

export default function UlidGeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>ULID 생성기</h1>
          <p className="section-desc">
            브라우저에서 시간 정렬 가능한 ULID를 즉시 생성해 식별자나 테스트 데이터로 사용할 수 있는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 단일 ULID 생성과 결과 복사에 집중합니다.</li>
          <li>생성된 값은 26자 Crockford Base32 형식을 사용하며 사전순 정렬이 가능합니다.</li>
          <li>monotonic ULID, batch generation, decode/inspect 기능은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <UlidGenerator />
    </main>
  );
}
