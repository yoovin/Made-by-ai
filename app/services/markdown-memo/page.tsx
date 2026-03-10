import Link from "next/link";
import { MarkdownMemo } from "@/components/markdown-memo";

export default function MarkdownMemoPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>마크다운 메모장</h1>
          <p className="section-desc">
            짧은 메모를 마크다운 문법으로 적고 현재 브라우저에 저장해 다시 이어서 볼 수 있는 로컬 전용 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>메모는 현재 브라우저의 localStorage에만 저장됩니다.</li>
          <li>마크다운 원문을 그대로 저장하고 다음 방문 때 다시 불러옵니다.</li>
          <li>이번 단계에서는 원문 저장과 복원에 집중하며, 렌더링 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <section className="panel">
        <h2 className="section-title">간단한 문법 힌트</h2>
        <ul className="list">
          <li># 제목</li>
          <li>- 목록 항목</li>
          <li>``` 코드 블록 ```</li>
        </ul>
      </section>

      <MarkdownMemo />
    </main>
  );
}
