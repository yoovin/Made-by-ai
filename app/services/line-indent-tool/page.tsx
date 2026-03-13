import Link from "next/link";
import { LineIndentTool } from "@/components/line-indent-tool";

export default function LineIndentToolPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>줄 들여쓰기 조정기</h1>
          <p className="section-desc">
            여러 줄 텍스트를 spaces-only 기준으로 들여쓰기 또는 내어쓰기하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 공백(space) 기준 들여쓰기/내어쓰기만 지원합니다.</li>
          <li>탭 문자, 자동 감지, 복사 버튼 같은 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <LineIndentTool />
    </main>
  );
}
