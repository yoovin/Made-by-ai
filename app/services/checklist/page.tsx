import Link from "next/link";
import { ChecklistManager } from "@/components/checklist-manager";

export default function ChecklistPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>작업 체크리스트</h1>
          <p className="section-desc">
            짧은 할 일을 로컬 브라우저에 저장하고 완료 여부를 바로 체크하는 작은 생산성 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>할 일 목록은 현재 브라우저의 localStorage에만 저장됩니다.</li>
          <li>이번 단계에서는 추가, 완료 체크, 삭제, 새로고침 후 복원에 집중합니다.</li>
          <li>다른 기기 동기화나 우선순위 정렬은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <ChecklistManager />
    </main>
  );
}
