import Link from "next/link";
import { QueryStringBuilder } from "@/components/query-string-builder";

export default function QueryStringBuilderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>쿼리 문자열 빌더</h1>
          <p className="section-desc">ordered key/value rows를 deterministic query string으로 생성하는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 ordered rows, duplicate key 허용, empty value 허용, deterministic percent-encoding만 지원합니다.</li>
          <li>blank key와 multiline key/value는 오류로 처리합니다.</li>
          <li>full URL builder, parser round-trip sync, nested query semantics는 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <QueryStringBuilder />
    </main>
  );
}
