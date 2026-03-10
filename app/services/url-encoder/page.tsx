import Link from "next/link";
import { UrlEncoder } from "@/components/url-encoder";

export default function UrlEncoderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>URL 인코더/디코더</h1>
          <p className="section-desc">
            URL 문자열을 퍼센트 인코딩하거나 다시 사람이 읽기 쉬운 형태로 디코딩하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 단순 인코딩/디코딩과 오류 안내에 집중합니다.</li>
          <li>쿼리 파라미터 분해나 배치 변환 같은 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <UrlEncoder />
    </main>
  );
}
