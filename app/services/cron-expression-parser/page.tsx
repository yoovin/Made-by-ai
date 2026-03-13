import Link from "next/link";
import { CronExpressionParser } from "@/components/cron-expression-parser";

export default function CronExpressionParserPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>크론 표현식 파서</h1>
          <p className="section-desc">표준 5필드 cron 표현식을 해석하고 검증하는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 5필드 cron 표현식과 `*`, 숫자, comma list, range, step syntax만 지원합니다.</li>
          <li>Quartz 확장 문법, macros, next-run 계산, timezone 처리는 이번 단계에 포함하지 않습니다.</li>
          <li>성공적으로 해석된 결과는 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <CronExpressionParser />
    </main>
  );
}
