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

      {sections.map((s, i) => (
        <section key={i} className="panel">
          <h2 className="section-title">{s.title}</h2>
          <ul className="list">
            {s.bodyLines.map((line, j) => {
              if (!line.trim()) return null;
              
              const isNested = line.startsWith("    -") || line.startsWith("  -");
              const text = line.trim().replace(/^- /, "");
              
              return (
                <li 
                  key={j} 
                  style={{ 
                    marginLeft: isNested ? "20px" : "0", 
                    listStyleType: isNested ? "circle" : "disc",
                    marginBottom: "4px"
                  }}
                >
                  {text}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
