import Link from "next/link";
import { LineNumberTool } from "@/components/line-number-tool";

export default function LineNumberToolPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>줄 번호 추가기</h1>
          <p className="section-desc">
            여러 줄 텍스트에서 비어 있지 않은 줄에만 번호를 붙이고, 빈 줄은 그대로 유지하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 내용을 저장하지 않습니다.</li>
          <li>빈 줄은 번호를 붙이지 않고 원래 순서를 그대로 유지합니다.</li>
          <li>이번 단계에서는 시작 번호와 구분자만 설정할 수 있습니다.</li>
        </ul>
      </section>

      <LineNumberTool />
    </main>
  );
}
