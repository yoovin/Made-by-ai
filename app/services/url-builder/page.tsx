import Link from "next/link";
import { UrlBuilder } from "@/components/url-builder";

export default function UrlBuilderPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>URL 빌더</h1>
          <p className="section-desc">base URL, path, query rows, hash를 조합해 full URL을 생성하는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 base URL + path + ordered query rows + optional hash 조합만 지원합니다.</li>
          <li>query rows는 duplicate key와 empty value를 허용하지만, blank key와 multiline key/value는 오류로 처리합니다.</li>
          <li>성공적으로 생성된 full URL은 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <UrlBuilder />
    </main>
  );
}
