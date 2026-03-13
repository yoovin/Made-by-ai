import Link from "next/link";
import { SecretGenerator } from "@/components/secret-generator";

export default function SecretGeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>시크릿 생성기</h1>
          <p className="section-desc">
            브라우저에서 앱 설정용 opaque secret을 즉시 생성해 `.env`나 테스트 설정에 붙여 넣을 수 있는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 생성 결과를 저장하거나 전송하지 않습니다.</li>
          <li>이번 단계에서는 단일 시크릿 생성과 결과 복사에만 집중합니다.</li>
          <li>HEX, Base64URL, Base64 형식을 지원하며 기본값은 32바이트 Base64URL입니다.</li>
          <li>provider-specific API key 형식, prefix, batch generation, 저장 기능은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <SecretGenerator />
    </main>
  );
}
