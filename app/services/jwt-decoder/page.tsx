import Link from "next/link";
import { JwtDecoder } from "@/components/jwt-decoder";

export default function JwtDecoderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>JWT 디코더</h1>
          <p className="section-desc">
            JWT 문자열의 header/payload를 decode-only 방식으로 읽어 구조와 표준 시간 claim을 확인하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 decode-only에 집중하며, 서명 검증은 수행하지 않습니다.</li>
          <li>여러 알고리즘 검증, 비밀키 입력, 토큰 발급 기능은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <JwtDecoder />
    </main>
  );
}
