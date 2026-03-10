import Link from "next/link";
import { QueryStringParser } from "@/components/query-string-parser";

export default function QueryStringParserPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>쿼리 문자열 파서</h1>
          <p className="section-desc">
            URL 또는 raw query 문자열을 파싱해 키/값 구조와 정규화 결과를 보여 주는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 URL 또는 raw query를 파싱해 중복 키와 정규화된 query를 보여 주는 데 집중합니다.</li>
          <li>쿼리 수정이나 URL 재조립 편집 기능은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <QueryStringParser />
    </main>
  );
}
