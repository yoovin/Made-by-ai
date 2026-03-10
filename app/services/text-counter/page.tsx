import Link from "next/link";
import { TextCounter } from "@/components/text-counter";

export default function TextCounterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>텍스트 카운터</h1>
          <p className="section-desc">
            입력한 글의 문자 수, 공백 제외 문자 수, 단어 수, 줄 수를 바로 확인하는 로컬 전용 미니 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 계산하며 텍스트를 저장하지 않습니다.</li>
          <li>이번 단계에서는 고정된 네 가지 지표에 집중합니다: 문자 수, 공백 제외, 단어 수, 줄 수.</li>
          <li>언어별 토큰 분석이나 파일 업로드 같은 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <TextCounter />
    </main>
  );
}
