import Link from "next/link";
import { LineListCleaner } from "@/components/line-list-cleaner";

export default function LineListCleanerPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>줄 목록 정리기</h1>
          <p className="section-desc">
            여러 줄 텍스트를 정리해 중복을 제거하고 입력 순서 유지 결과와 정렬 결과를 함께 보여 주는 로컬 전용 미니 서비스입니다.
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
          <li>각 줄은 앞뒤 공백을 제거하고, 빈 줄은 무시한 뒤 비교합니다.</li>
          <li>이번 단계에서는 중복 제거와 정렬 출력에 집중하며, 정규식/CSV/파일 입력은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <LineListCleaner />
    </main>
  );
}
