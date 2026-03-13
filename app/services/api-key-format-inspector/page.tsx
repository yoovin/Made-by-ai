import Link from "next/link";
import { ApiKeyFormatInspector } from "@/components/api-key-format-inspector";

export default function ApiKeyFormatInspectorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>API 키 형식 판별기</h1>
          <p className="section-desc">
            한 줄짜리 키 문자열의 prefix와 형식 패턴을 바탕으로 provider 후보를 식별하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력한 키 문자열을 저장하거나 전송하지 않습니다.</li>
          <li>이번 단계에서는 고신뢰 prefix/pattern 기반 형식 식별만 수행하며 실제 유효성이나 권한은 검증하지 않습니다.</li>
          <li>지원하지 않는 형식이나 애매한 prefix는 `unknown`으로 표시합니다.</li>
          <li>raw secret을 그대로 결과 패널에 다시 보여 주지 않도록 미리보기만 제한적으로 표시합니다.</li>
        </ul>
      </section>

      <ApiKeyFormatInspector />
    </main>
  );
}
