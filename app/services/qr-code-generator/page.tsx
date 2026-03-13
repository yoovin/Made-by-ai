import Link from "next/link";
import { QrCodeGenerator } from "@/components/qr-code-generator";

export default function QrCodeGeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>QR 코드 생성기</h1>
          <p className="section-desc">텍스트를 QR 코드 이미지로 생성하고 바로 복사/다운로드하는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 bounded text payload와 QR PNG preview/download만 지원합니다.</li>
          <li>너무 긴 입력과 과도한 옵션 조정은 이번 MVP에 포함하지 않습니다.</li>
          <li>생성이 성공하면 원문 복사와 PNG 다운로드를 바로 사용할 수 있습니다.</li>
        </ul>
      </section>

      <QrCodeGenerator />
    </main>
  );
}
