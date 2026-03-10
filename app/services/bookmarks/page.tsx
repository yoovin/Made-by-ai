import Link from "next/link";
import { BookmarkManager } from "@/components/bookmark-manager";

export default function BookmarksPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>북마크 관리</h1>
          <p className="section-desc">
            자주 여는 링크를 허브 안에서 저장하고 다시 여는 로컬 전용 북마크 서비스입니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>북마크는 현재 브라우저에만 저장됩니다.</li>
          <li>제목과 URL을 함께 저장해 다음 방문 때 빠르게 다시 열 수 있습니다.</li>
          <li>잘못된 URL은 저장 전에 바로 안내합니다.</li>
        </ul>
      </section>

      <BookmarkManager />
    </main>
  );
}
