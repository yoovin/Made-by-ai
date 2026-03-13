import Link from "next/link";
import { LineAffixTool } from "@/components/line-affix-tool";

export default function LineAffixToolPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>줄 접두/접미 추가기</h1>
          <p className="section-desc">
            여러 줄 텍스트의 각 줄 앞뒤에 접두/접미를 붙여 포맷을 빠르게 맞추는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 비어 있지 않은 줄에만 접두/접미를 붙이고, 빈 줄은 그대로 유지합니다.</li>
          <li>정렬/중복 제거/CSV 처리 같은 기능은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <LineAffixTool />
    </main>
  );
}
