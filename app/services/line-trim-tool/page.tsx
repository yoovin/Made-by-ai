import Link from "next/link";
import { LineTrimTool } from "@/components/line-trim-tool";

export default function LineTrimToolPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>줄 공백 정리기</h1>
          <p className="section-desc">
            여러 줄 텍스트의 각 줄 앞/뒤 공백을 정리하면서 빈 줄은 그대로 유지하는 로컬 전용 미니 서비스입니다.
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
          <li>앞 공백 제거, 뒤 공백 제거, 앞뒤 공백 제거 세 모드만 지원합니다.</li>
          <li>정리가 끝나면 결과를 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
          <li>빈 줄은 삭제하지 않고 그대로 유지합니다.</li>
        </ul>
      </section>

      <LineTrimTool />
    </main>
  );
}
