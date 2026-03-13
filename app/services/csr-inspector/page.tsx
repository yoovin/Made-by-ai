import Link from "next/link";
import { CsrInspector } from "@/components/csr-inspector";

export default function CsrInspectorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>CSR 요약기</h1>
          <p className="section-desc">
            단일 PEM PKCS#10 CSR을 브라우저 안에서 해석해 subject, SAN, 공개키 메타데이터, self-signature 상태를 요약하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력한 CSR을 저장하거나 전송하지 않습니다.</li>
          <li>이번 단계에서는 PEM CSR 1개만 지원하며 인증서 PEM, 키 PEM, multi-PEM bundle은 거절합니다.</li>
          <li>공개키 fingerprint는 CSR의 public key DER 바이트 기준 SHA-256으로 계산합니다.</li>
          <li>challenge password나 uncommon CSR attribute deep inspection은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <CsrInspector />
    </main>
  );
}
