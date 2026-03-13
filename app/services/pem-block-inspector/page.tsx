import Link from "next/link";
import { PemBlockInspector } from "@/components/pem-block-inspector";

export default function PemBlockInspectorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>PEM 블록 식별기</h1>
          <p className="section-desc">붙여 넣은 PEM 텍스트에 어떤 블록이 들어 있는지 local-only로 식별하는 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">← 허브로 돌아가기</Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 PEM block labels and counts만 식별합니다.</li>
          <li>이번 단계에서는 cryptographic parsing, validation, trust verification을 수행하지 않습니다.</li>
          <li>private key labels도 식별할 수 있지만 key 내용을 파싱하거나 검증하지 않습니다.</li>
          <li>이 도구는 다음 단계로 어떤 inspector를 열어야 하는지 triage하는 목적입니다.</li>
        </ul>
      </section>

      <PemBlockInspector />
    </main>
  );
}
