import Link from "next/link";
import { Base64UrlEncoder } from "@/components/base64url-encoder";

export default function Base64UrlEncoderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>Base64URL 인코더/디코더</h1>
          <p className="section-desc">
            문자열을 URL-safe Base64로 인코딩하거나 다시 UTF-8 원문으로 디코딩하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 UTF-8 안전 Base64URL 인코딩/디코딩과 오류 안내에 집중합니다.</li>
          <li>인코딩 출력은 `-`, `_`, no padding 규칙을 따르며, 디코딩은 optional trailing `=`가 있는 Base64URL도 받아들입니다.</li>
          <li>JWT segment나 기타 URL-safe text payload 처리에 바로 사용할 수 있습니다.</li>
        </ul>
      </section>

      <Base64UrlEncoder />
    </main>
  );
}
