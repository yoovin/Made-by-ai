import Link from "next/link";
import { RegexEscape } from "@/components/regex-escape";

export default function RegexEscapePage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>정규식 이스케이프 도구</h1>
          <p className="section-desc">
            일반 텍스트를 정규식 source 문자열이나 JavaScript regex literal preview로 안전하게 바꾸는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 정규식 메타문자 이스케이프와 JS literal preview 출력에 집중합니다.</li>
          <li>실제 정규식 실행이나 플래그 관리 기능은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <RegexEscape />
    </main>
  );
}
