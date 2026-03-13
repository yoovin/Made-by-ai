import Link from "next/link";
import { PrivateKeyInspector } from "@/components/private-key-inspector";

export default function PrivateKeyInspectorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>개인키 요약기</h1>
          <p className="section-desc">단일 unencrypted PKCS#8 PEM 개인키를 로컬에서 읽고 key family와 metadata를 요약하는 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">← 허브로 돌아가기</Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 single unencrypted `BEGIN PRIVATE KEY` (PKCS#8)만 지원합니다.</li>
          <li>이번 단계에서는 RSA/EC key family와 기본 metadata만 요약합니다.</li>
          <li>`RSA PRIVATE KEY`, `EC PRIVATE KEY`, `ENCRYPTED PRIVATE KEY`, `OPENSSH PRIVATE KEY`는 지원하지 않습니다.</li>
          <li>decryption, signing, pair matching, trust verification은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <PrivateKeyInspector />
    </main>
  );
}
