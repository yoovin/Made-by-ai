import Link from "next/link";
import { SlugGenerator } from "@/components/slug-generator";

export default function SlugGeneratorPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>슬러그 생성기</h1>
          <p className="section-desc">
            텍스트를 URL, 파일명, 문서 식별자에 쓰기 쉬운 ASCII kebab-case slug로 바꾸는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 ASCII 기반 slug 생성에 집중합니다.</li>
          <li>언어별 완전한 음역 규칙이나 복사 버튼 같은 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <SlugGenerator />
    </main>
  );
}
