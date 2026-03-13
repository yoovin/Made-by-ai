import fs from "fs";
import path from "path";
import Link from "next/link";

function parseChangelog(content: string) {
  const parts = content.split(/^## /m);
  const sections = parts.slice(1);
  
  return sections.map(section => {
    const lines = section.trim().split("\n");
    const title = lines[0].trim();
    const bodyLines = lines.slice(1);
    return { title, bodyLines };
  });
}

export default async function ReleaseLogPage() {
  const filePath = path.join(process.cwd(), "ops/changelog/CHANGELOG.md");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    content = "## Error\n- CHANGELOG.md 파일을 읽을 수 없습니다.";
  }
  
  const sections = parseChangelog(content);
  const latestSection = sections[0] ?? null;
  const previousSections = sections.slice(1);

  function renderBodyLines(bodyLines: string[], keyPrefix: string) {
    return bodyLines.map((line, index) => {
      if (!line.trim()) return null;

      const isNested = line.startsWith("    -") || line.startsWith("  -");
      const text = line.trim().replace(/^- /, "");

      return (
        <li key={`${keyPrefix}-${index}`} className={isNested ? "release-log-subitem" : "release-log-item"}>
          {text}
        </li>
      );
    });
  }

  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">operations</span>
          </div>
          <h1>릴리즈 로그</h1>
          <p className="section-desc">AI가 이 서비스에 어떤 변화를 만들었는지 기록합니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      {latestSection ? (
        <section className="panel release-log-hero-card">
          <div className="release-log-header-row">
            <div>
              <p className="release-log-eyebrow">가장 최근 변경</p>
              <h2 className="section-title release-log-title">{latestSection.title}</h2>
              <p className="section-desc">최근 사이클에서 반영된 주요 작업을 먼저 빠르게 확인할 수 있습니다.</p>
            </div>
            <div className="release-log-count-card">
              <strong>{sections.length}</strong>
              <span>누적 기록 수</span>
            </div>
          </div>
          <ul className="list release-log-list">{renderBodyLines(latestSection.bodyLines, "latest")}</ul>
        </section>
      ) : null}

      {previousSections.length ? (
        <section className="panel">
          <div className="release-log-header-row">
            <div>
              <h2 className="section-title release-log-title">이전 기록</h2>
              <p className="section-desc">직전 사이클 이전의 릴리즈 흐름을 날짜 단위 카드로 이어서 살펴볼 수 있습니다.</p>
            </div>
          </div>
          <div className="release-log-grid">
            {previousSections.map((section, index) => (
              <section key={`${section.title}-${index}`} className="release-log-entry-card">
                <p className="release-log-entry-index">기록 {index + 2}</p>
                <h3 className="release-log-entry-title">{section.title}</h3>
                <ul className="list release-log-list">{renderBodyLines(section.bodyLines, section.title)}</ul>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {!sections.length ? (
        <section className="panel">
          <h2 className="section-title">릴리즈 기록이 없습니다</h2>
          <p className="section-desc">CHANGELOG 파일을 읽을 수 없거나 표시할 항목이 아직 없습니다.</p>
        </section>
      ) : null}
    </main>
  );
}
