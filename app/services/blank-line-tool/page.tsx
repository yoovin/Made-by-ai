import Link from "next/link";
import { BlankLineTool } from "@/components/blank-line-tool";

export default function BlankLineToolPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>빈 줄 정리기</h1>
          <p className="section-desc">
            여러 줄 텍스트에서 빈 줄을 모두 제거하거나 연속 빈 줄을 1개만 유지하는 로컬 전용 미니 서비스입니다.
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
          <li>공백만 있는 줄도 빈 줄로 간주해 정리합니다.</li>
          <li>정리가 끝나면 결과를 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
          <li>이번 단계에서는 빈 줄 제거/연속 빈 줄 축약에 집중하며 정렬/중복 제거는 포함하지 않습니다.</li>
        </ul>
      </section>

      <BlankLineTool />
    </main>
  );
}
