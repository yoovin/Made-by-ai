import Link from "next/link";
import { TotpInspector } from "@/components/totp-inspector";

export default function TotpInspectorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>TOTP 코드 해석기</h1>
          <p className="section-desc">
            `otpauth://totp/...` URI를 해석하고 현재 TOTP 코드를 브라우저 안에서 계산해 보여 주는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력한 URI나 secret을 저장하지 않습니다.</li>
          <li>이번 단계에서는 `otpauth://totp/...` 형식의 TOTP만 지원합니다.</li>
          <li>HOTP, QR 스캔, 카메라 입력, 저장 기능, 여러 계정 관리는 이번 MVP에 포함하지 않습니다.</li>
          <li>현재 코드를 계산해 바로 복사할 수 있지만, 완전한 인증기 앱을 대체하려는 목적은 아닙니다.</li>
        </ul>
      </section>

      <TotpInspector />
    </main>
  );
}
