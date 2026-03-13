import Link from "next/link";
import { TextReplaceTool } from "@/components/text-replace-tool";

export default function TextReplaceToolPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>텍스트 치환 도구</h1>
          <p className="section-desc">
            원문 텍스트에서 찾을 문자열을 literal 방식으로 치환하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 literal 치환만 제공하며, 정규식 치환은 포함하지 않습니다.</li>
          <li>찾을 텍스트는 반드시 입력해야 하며, 빈 치환값은 허용해 삭제형 치환에 사용할 수 있습니다.</li>
          <li>치환이 성공하면 결과를 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <TextReplaceTool />
    </main>
  );
}
