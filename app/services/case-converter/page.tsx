import Link from "next/link";
import { CaseConverter } from "@/components/case-converter";

export default function CaseConverterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>케이스 변환기</h1>
          <p className="section-desc">
            텍스트를 camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case로 바꾸는 로컬 전용 미니 서비스입니다.
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
          <li>영문자/숫자 기반 케이스 변환에 집중하며, 특수문자는 토큰 경계로만 사용합니다.</li>
          <li>언어별 음역이나 복사 버튼 같은 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <CaseConverter />
    </main>
  );
}
