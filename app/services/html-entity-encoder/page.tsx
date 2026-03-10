import Link from "next/link";
import { HtmlEntityEncoder } from "@/components/html-entity-encoder";

export default function HtmlEntityEncoderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>HTML 엔티티 인코더/디코더</h1>
          <p className="section-desc">
            HTML 특수문자를 엔티티로 인코딩하거나 다시 텍스트로 디코딩하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 기본 HTML 특수문자와 숫자 엔티티 디코딩에 집중합니다.</li>
          <li>광범위한 엔티티 사전이나 HTML 렌더링/미리보기 기능은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <HtmlEntityEncoder />
    </main>
  );
}
