import Link from "next/link";
import { TextDiffChecker } from "@/components/text-diff-checker";

export default function TextDiffCheckerPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>텍스트 비교 도구</h1>
          <p className="section-desc">
            두 텍스트를 정확히 비교해 동일 여부와 첫 차이 위치를 확인하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 exact compare와 함께 줄 단위 readable diff 출력을 제공합니다.</li>
          <li>줄바꿈은 비교 전에 LF 기준으로 정규화되며, formatting/comment 의미 비교나 patch export 기능은 포함하지 않습니다.</li>
        </ul>
      </section>

      <TextDiffChecker />
    </main>
  );
}
