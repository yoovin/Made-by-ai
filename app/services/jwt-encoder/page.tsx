import Link from "next/link";
import { JwtEncoder } from "@/components/jwt-encoder";

export default function JwtEncoderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>JWT 인코더</h1>
          <p className="section-desc">JSON header/payload와 시크릿으로 HS256/384/512 JWT를 로컬에서 생성하는 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">← 허브로 돌아가기</Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 HS256/384/512 기반 local token construction만 지원합니다.</li>
          <li>RS256, ES256, JWK import, verification, key management, token persistence는 포함하지 않습니다.</li>
          <li>생성 결과는 테스트/개발용 compact JWT이며 trust verification을 의미하지 않습니다.</li>
        </ul>
      </section>

      <JwtEncoder />
    </main>
  );
}
