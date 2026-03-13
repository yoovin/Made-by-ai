import Link from "next/link";
import { HmacGenerator } from "@/components/hmac-generator";

export default function HmacGeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>HMAC 생성기</h1>
          <p className="section-desc">
            메시지와 시크릿을 정확한 UTF-8 바이트 그대로 사용해 HMAC-SHA-256/384/512 hex digest를 생성하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하거나 전송하지 않습니다.</li>
          <li>메시지와 시크릿은 trim 없이 그대로 사용하므로 공백과 줄바꿈도 digest에 포함됩니다.</li>
          <li>이번 단계에서는 hex 출력만 지원하며 verify 모드나 provider-specific request signing preset은 포함하지 않습니다.</li>
          <li>secret decoding(hex/base64/base64url)이나 verify mode는 후속 후보로 남깁니다.</li>
        </ul>
      </section>

      <HmacGenerator />
    </main>
  );
}
