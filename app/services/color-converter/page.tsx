import Link from "next/link";
import { ColorConverter } from "@/components/color-converter";

export default function ColorConverterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>색상 변환기</h1>
          <p className="section-desc">
            HEX, RGB, HSL 색상 값을 서로 변환하고 결과를 한눈에 확인하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 3/6자리 HEX, 정수 RGB, 정수 HSL 형식만 지원합니다.</li>
          <li>알파 채널, 색상명, 팔레트 저장 같은 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <ColorConverter />
    </main>
  );
}
