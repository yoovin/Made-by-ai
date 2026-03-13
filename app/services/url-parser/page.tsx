import Link from "next/link";
import { UrlParser } from "@/components/url-parser";

export default function UrlParserPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>URL 파서</h1>
          <p className="section-desc">absolute URL을 파싱해 origin, pathname, hash, query rows, normalized URL을 보여 주는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 absolute URL만 지원하며 origin/path/hash/query rows를 보여 줍니다.</li>
          <li>credential-bearing URL, relative URL, parser/builder round-trip sync는 이번 MVP에 포함하지 않습니다.</li>
          <li>성공적으로 파싱된 normalized URL은 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <UrlParser />
    </main>
  );
}
