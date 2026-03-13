import Link from "next/link";
import { PublicKeyMatchChecker } from "@/components/public-key-match-checker";

export default function PublicKeyMatchCheckerPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>공개키 일치 확인기</h1>
          <p className="section-desc">인증서, CSR, PUBLIC KEY에서 추출한 공개키 fingerprint가 같은지 로컬에서 비교하는 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">← 허브로 돌아가기</Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 단일 PEM CERTIFICATE, CSR, PUBLIC KEY만 비교합니다.</li>
          <li>비교 기준은 SHA-256 public-key/SPKI fingerprint equality 뿐입니다.</li>
          <li>trust, issuance, ownership, chain, hostname, authenticity를 검증하지 않습니다.</li>
          <li>private key, JWK, SSH key, PEM bundle은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <PublicKeyMatchChecker />
    </main>
  );
}
