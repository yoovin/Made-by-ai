import Link from "next/link";
import { Sha256Generator } from "@/components/sha256-generator";

export default function Sha256GeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>SHA-256 생성기</h1>
          <p className="section-desc">
            짧은 텍스트를 SHA-256 해시로 변환하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 단일 SHA-256 텍스트 해시에 집중합니다.</li>
          <li>해시 생성이 성공하면 결과를 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <Sha256Generator />
    </main>
  );
}
