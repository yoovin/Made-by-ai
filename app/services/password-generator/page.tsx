import Link from "next/link";
import { PasswordGenerator } from "@/components/password-generator";

export default function PasswordGeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>비밀번호 생성기</h1>
          <p className="section-desc">
            브라우저에서 길이와 문자 종류를 고른 뒤 바로 사용할 수 있는 로컬 전용 비밀번호를 생성하는 미니 서비스입니다.
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
          <li>이번 단계에서는 단일 비밀번호 생성과 결과 복사에만 집중합니다.</li>
          <li>길이는 8자부터 64자까지 지원하며, 선택한 문자 종류는 결과에 최소 한 번씩 포함됩니다.</li>
          <li>강도 점수, 기록 보관, 여러 개 일괄 생성은 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <PasswordGenerator />
    </main>
  );
}
