import Link from "next/link";
import { JsonFormatter } from "@/components/json-formatter";

export default function JsonFormatterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>JSON 포맷터/검증기</h1>
          <p className="section-desc">
            JSON 문자열을 보기 좋게 정리하고 형식을 바로 검증하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>입력한 JSON은 브라우저 안에서만 처리되며 저장되지 않습니다.</li>
          <li>이번 단계에서는 포맷, 검증, 지우기와 기본 메타정보 표시에 집중합니다.</li>
          <li>스키마 검증, 파일 업로드, 복사 버튼 같은 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <JsonFormatter />
    </main>
  );
}
