import Link from "next/link";
import { JwkInspector } from "@/components/jwk-inspector";

export default function JwkInspectorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>JWK 요약기</h1>
          <p className="section-desc">단일 RSA/EC JWK JSON object를 로컬에서 해석해 key metadata와 RFC 7638 SHA-256 thumbprint를 보여 주는 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">← 허브로 돌아가기</Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 단일 JWK JSON object만 지원합니다.</li>
          <li>이번 단계에서는 RSA/EC JWK만 지원하며 JWKS, oct, PEM 변환은 포함하지 않습니다.</li>
          <li>private members가 있어도 thumbprint는 RFC 7638 public members 기준으로 계산합니다.</li>
          <li>visibility는 private members 존재 여부를 요약하는 metadata일 뿐, 완전한 private key validation이나 trust verification을 의미하지 않습니다.</li>
        </ul>
      </section>

      <JwkInspector />
    </main>
  );
}
