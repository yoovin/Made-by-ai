import Link from "next/link";
import { YamlJsonConverter } from "@/components/yaml-json-converter";

export default function YamlJsonConverterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>YAML ↔ JSON 변환기</h1>
          <p className="section-desc">JSON-compatible YAML과 JSON을 서로 변환하는 로컬 전용 미니 서비스입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 입력 값을 저장하지 않습니다.</li>
          <li>이번 단계에서는 single-document, JSON-compatible YAML만 지원합니다.</li>
          <li>comments, anchors, aliases, merge keys, custom tags 같은 고급 YAML 기능은 지원하지 않습니다.</li>
          <li>성공적으로 변환된 결과는 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <YamlJsonConverter />
    </main>
  );
}
