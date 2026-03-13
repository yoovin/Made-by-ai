import Link from "next/link";
import { LineSortTool } from "@/components/line-sort-tool";

export default function LineSortToolPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>줄 정렬기</h1>
          <p className="section-desc">
            여러 줄 텍스트를 오름차순/내림차순으로 정렬하면서 중복은 유지하고 빈 줄은 무시하는 로컬 전용 미니 서비스입니다.
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
          <li>중복 줄은 유지한 채 정렬하고, 공백/빈 줄은 정렬 대상에서 제외합니다.</li>
          <li>정렬이 성공하면 오름차순/내림차순 결과를 각각 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
          <li>자연 정렬, locale-aware sort, dedupe/export 기능은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <LineSortTool />
    </main>
  );
}
