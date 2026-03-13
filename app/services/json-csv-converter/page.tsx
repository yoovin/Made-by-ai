import Link from "next/link";
import { JsonCsvConverter } from "@/components/json-csv-converter";

export default function JsonCsvConverterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>JSON ↔ CSV 변환기</h1>
          <p className="section-desc">
            평면 객체 배열 JSON과 헤더 포함 CSV를 서로 변환하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 평면 객체 배열 JSON과 헤더 포함 CSV만 지원합니다.</li>
          <li>중첩 객체/배열 값은 추측 변환하지 않고 명시적으로 거절합니다.</li>
          <li>CSV를 JSON으로 변환할 때 모든 셀 값은 문자열로 반환합니다.</li>
          <li>변환이 성공하면 현재 결과를 바로 복사해 다음 작업으로 이어갈 수 있습니다.</li>
        </ul>
      </section>

      <JsonCsvConverter />
    </main>
  );
}
