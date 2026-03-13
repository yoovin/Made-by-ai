import Link from "next/link";
import { XmlFormatter } from "@/components/xml-formatter";

export default function XmlFormatterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>XML 포맷터/검증기</h1>
          <p className="section-desc">well-formed XML을 검증하고 deterministic pretty-print output을 보여 주는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 well-formed XML validation, pretty-print, copy output만 지원합니다.</li>
          <li>DTD, ENTITY, 고급 XML feature coverage, schema validation은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <XmlFormatter />
    </main>
  );
}
