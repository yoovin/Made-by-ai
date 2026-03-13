import Link from "next/link";
import { PublicKeyInspector } from "@/components/public-key-inspector";

export default function PublicKeyInspectorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>공개키 요약기</h1>
          <p className="section-desc">
            단일 PEM SPKI 공개키를 브라우저 안에서 해석해 알고리즘, 키 세부 정보, SPKI byte length, SHA-256 fingerprint를 요약하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력한 공개키를 저장하거나 전송하지 않습니다.</li>
          <li>이번 단계에서는 PEM `BEGIN PUBLIC KEY` 1개만 지원하며 certificate, CSR, private key, SSH key, JWK는 포함하지 않습니다.</li>
          <li>SHA-256 fingerprint는 공개키 SPKI DER 바이트 기준으로 계산합니다.</li>
          <li>신뢰 검증, pair matching, sign/verify, private key parsing은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <PublicKeyInspector />
    </main>
  );
}
