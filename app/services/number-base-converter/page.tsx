import Link from "next/link";
import { NumberBaseConverter } from "@/components/number-base-converter";

export default function NumberBaseConverterPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>진법 변환기</h1>
          <p className="section-desc">
            2진수, 8진수, 10진수, 16진수 정수를 서로 변환하는 로컬 전용 미니 서비스입니다.
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
          <li>이번 단계에서는 정수 입력과 2/8/10/16진수 변환에 집중합니다.</li>
          <li>실수, 자리 구분자, 더 많은 진법 확장은 이후 후보로 남깁니다.</li>
        </ul>
      </section>

      <NumberBaseConverter />
    </main>
  );
}
