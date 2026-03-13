import Link from "next/link";
import { EnvBuilder } from "@/components/env-builder";

export default function EnvBuilderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>ENV 빌더</h1>
          <p className="section-desc">key/value 입력으로 deterministic .env 출력을 생성하는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 basic key/value rows, duplicate/invalid/multiline rejection, deterministic quoted output만 지원합니다.</li>
          <li>export, interpolation, import 기능은 이번 MVP에 포함하지 않습니다.</li>
          <li>성공적으로 생성된 ENV 출력은 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <EnvBuilder />
    </main>
  );
}
