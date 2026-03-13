import Link from "next/link";
import { Sha256Verifier } from "@/components/sha256-verifier";

export default function Sha256VerifierPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>SHA-256 검증기</h1>
          <p className="section-desc">
            텍스트를 로컬에서 SHA-256으로 계산한 뒤, 붙여 넣은 hex digest와 같은지 비교하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 텍스트와 해시를 저장하거나 전송하지 않습니다.</li>
          <li>이번 단계에서는 텍스트 입력의 SHA-256 hex digest 비교만 지원합니다.</li>
          <li>기존 SHA-256 생성기와 같은 trim 기반 입력 정규화를 사용합니다.</li>
          <li>비교 결과는 local digest equality만 의미하며 원본 신뢰성이나 파일 출처를 증명하지 않습니다.</li>
        </ul>
      </section>

      <Sha256Verifier />
    </main>
  );
}
