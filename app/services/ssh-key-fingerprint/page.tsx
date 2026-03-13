import Link from "next/link";
import { SshKeyFingerprint } from "@/components/ssh-key-fingerprint";

export default function SshKeyFingerprintPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>SSH 키 지문 생성기</h1>
          <p className="section-desc">
            단일 OpenSSH 공개키 한 줄을 브라우저 안에서 해석해 key type, 세부 정보, SHA-256 fingerprint를 요약하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 OpenSSH 공개키 한 줄만 지원합니다.</li>
          <li>이번 단계에서는 `ssh-ed25519`, `ssh-rsa`, `ecdsa-sha2-nistp256/384/521`만 지원합니다.</li>
          <li>private key, SSH config, authorized_keys 옵션, SSH certificate, PEM/JWK 변환은 이번 MVP에 포함하지 않습니다.</li>
          <li>fingerprint는 pasted public key blob 기준 SHA-256이며 신뢰성이나 소유권을 검증하지 않습니다.</li>
        </ul>
      </section>

      <SshKeyFingerprint />
    </main>
  );
}
