import Link from "next/link";
import { NumberFormatter } from "@/components/number-formatter";

export default function NumberFormatterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>숫자 포맷터</h1>
          <p className="section-desc">숫자를 decimal, percent, currency 형식으로 로컬에서 포맷하는 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 explicit locale과 decimal/percent/currency 포맷만 지원합니다.</li>
          <li>Locale을 런타임 기본값에 맡기지 않고 명시적으로 선택해 결과를 안정적으로 유지합니다.</li>
          <li>성공적으로 포맷된 결과는 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <NumberFormatter />
    </main>
  );
}
