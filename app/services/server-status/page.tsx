import Link from "next/link";
import { execFileSync } from "node:child_process";
import { getPm2ErrorLogSummary } from "@/lib/pm2-log-summary";

type HealthPayload = {
  ok?: boolean;
  service?: string;
  now?: string;
};

type Pm2Process = {
  name?: string;
  pm2_env?: {
    status?: string;
    restart_time?: number;
    pm_uptime?: number;
  };
  monit?: {
    memory?: number;
    cpu?: number;
  };
};

function formatUptime(startedAt: number | null) {
  if (!startedAt) {
    return null;
  }

  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs < 0) {
    return null;
  }

  const totalMinutes = Math.floor(elapsedMs / 1000 / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) {
    parts.push(`${days}일`);
  }
  if (hours > 0 || days > 0) {
    parts.push(`${hours}시간`);
  }
  parts.push(`${minutes}분`);

  return parts.join(" ");
}

async function getHealthStatus() {
  const baseUrl = process.env.PUBLIC_APP_URL || "http://127.0.0.1";
  const publicPort = process.env.PUBLIC_PORT || "80";
  const healthUrl = `${baseUrl}:${publicPort}/api/health`;

  try {
    const response = await fetch(healthUrl, { cache: "no-store" });
    if (!response.ok) {
      return {
        ok: false,
        statusCode: response.status,
        healthUrl,
        payload: null as HealthPayload | null,
      };
    }

    const payload = (await response.json()) as HealthPayload;
    return {
      ok: true,
      statusCode: response.status,
      healthUrl,
      payload,
    };
  } catch {
    return {
      ok: false,
      statusCode: null,
      healthUrl,
      payload: null as HealthPayload | null,
    };
  }
}

async function checkEndpoint(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    return {
      ok: response.ok,
      statusCode: response.status,
      url,
    };
  } catch {
    return {
      ok: false,
      statusCode: null,
      url,
    };
  }
}

function getPm2Status() {
  try {
    const output = execFileSync("pm2", ["jlist"], {
      encoding: "utf-8",
    });
    const processes = JSON.parse(output) as Pm2Process[];
    const app = processes.find((process) => process.name === "made-by-ai");

    return {
      available: true,
      name: app?.name ?? "made-by-ai",
      status: app?.pm2_env?.status ?? "unknown",
      restarts: app?.pm2_env?.restart_time ?? 0,
      startedAt: app?.pm2_env?.pm_uptime ?? null,
      memoryMb: app?.monit?.memory ? Math.round(app.monit.memory / 1024 / 1024) : null,
      cpuPercent: app?.monit?.cpu ?? null,
    };
  } catch (error) {
    return {
      available: false,
      name: "made-by-ai",
      status: "unavailable",
      restarts: null,
      startedAt: null,
      memoryMb: null,
      cpuPercent: null,
      errorMessage: error instanceof Error ? error.message : "unknown error",
    };
  }
}

export default async function ServerStatusPage() {
  const health = await getHealthStatus();
  const pm2 = getPm2Status();
  const errorLog = getPm2ErrorLogSummary();
  const baseUrl = process.env.PUBLIC_APP_URL || "http://127.0.0.1";
  const publicPort = process.env.PUBLIC_PORT || "80";
  const publicEntry = await checkEndpoint(`${baseUrl}:${publicPort}/`);
  const internalEntry = await checkEndpoint("http://127.0.0.1:4000/");
  const pm2StartedAt = pm2.startedAt ? new Date(pm2.startedAt).toISOString() : null;
  const pm2Uptime = formatUptime(pm2.startedAt);

  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className={`badge ${health.ok ? "active" : "disabled"}`}>
              {health.ok ? "active" : "issue"}
            </span>
            <span className="badge">operations</span>
          </div>
          <h1>서버 상태 대시보드</h1>
          <p className="section-desc">
            허브 앱의 기본 헬스 체크 응답과 주요 점검 경로를 한눈에 확인합니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">현재 상태</h2>
        <div className="kpi-row">
          <div className="kpi">
            <strong>{health.ok ? "정상" : "확인 필요"}</strong>
            <span>헬스 체크 결과</span>
          </div>
          <div className="kpi">
            <strong>{health.statusCode ?? "-"}</strong>
            <span>응답 코드</span>
          </div>
          <div className="kpi">
            <strong>{health.payload?.service ?? "unknown"}</strong>
            <span>서비스 이름</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">헬스 체크 응답</h2>
        <ul className="list">
          <li>endpoint: {health.healthUrl}</li>
          <li>ok: {String(health.payload?.ok ?? false)}</li>
          <li>service: {health.payload?.service ?? "unknown"}</li>
          <li>now: {health.payload?.now ?? "응답 없음"}</li>
        </ul>
      </section>

      <section className="panel">
        <h2 className="section-title">PM2 프로세스 상태</h2>
        <div className="kpi-row">
          <div className="kpi">
            <strong>{pm2.status}</strong>
            <span>프로세스 상태</span>
          </div>
          <div className="kpi">
            <strong>{pm2.restarts ?? "-"}</strong>
            <span>재시작 횟수</span>
          </div>
          <div className="kpi">
            <strong>{pm2.memoryMb !== null ? `${pm2.memoryMb} MB` : "-"}</strong>
            <span>메모리 사용량</span>
          </div>
          <div className="kpi">
            <strong>{pm2Uptime ?? "-"}</strong>
            <span>프로세스 uptime</span>
          </div>
        </div>
        <ul className="list" style={{ marginTop: "16px" }}>
          <li>name: {pm2.name}</li>
          <li>cpu: {pm2.cpuPercent !== null ? `${pm2.cpuPercent}%` : "확인 불가"}</li>
          <li>pm2 시작 시각: {pm2StartedAt ?? "확인 불가"}</li>
          <li>source: pm2 jlist</li>
          {!pm2.available && <li>error: {pm2.errorMessage}</li>}
        </ul>
      </section>

      <section className="panel">
        <h2 className="section-title">포트 및 진입 경로 상태</h2>
        <div className="kpi-row">
          <div className="kpi">
            <strong>{publicEntry.statusCode ?? "-"}</strong>
            <span>공개 포트 80 응답</span>
          </div>
          <div className="kpi">
            <strong>{internalEntry.statusCode ?? "-"}</strong>
            <span>내부 앱 포트 4000 응답</span>
          </div>
          <div className="kpi">
            <strong>{publicEntry.ok && internalEntry.ok ? "정상" : "확인 필요"}</strong>
            <span>진입 경로 요약</span>
          </div>
        </div>
        <ul className="list" style={{ marginTop: "16px" }}>
          <li>public entry: {publicEntry.url}</li>
          <li>internal entry: {internalEntry.url}</li>
          <li>public ok: {String(publicEntry.ok)}</li>
          <li>internal ok: {String(internalEntry.ok)}</li>
        </ul>
      </section>

      <section className="panel">
        <h2 className="section-title">최근 에러 로그 요약</h2>
        <div className="kpi-row">
          <div className="kpi">
            <strong>{errorLog.available ? "확인 가능" : "확인 불가"}</strong>
            <span>로그 파일 상태</span>
          </div>
          <div className="kpi">
            <strong>{errorLog.entries.length}</strong>
            <span>최근 에러 라인 수</span>
          </div>
          <div className="kpi">
            <strong>{errorLog.groupedEntries.length}</strong>
            <span>고유 에러 그룹 수</span>
          </div>
          <div className="kpi">
            <strong>{errorLog.lastTimestamp ?? "-"}</strong>
            <span>마지막 에러 시각</span>
          </div>
          <div className="kpi">
            <strong>{errorLog.repeatedCount}</strong>
            <span>반복 발생 수</span>
          </div>
        </div>
        <ul className="list" style={{ marginTop: "16px" }}>
          <li>source: {errorLog.source}</li>
          {errorLog.groupedEntries.length > 0 ? (
            errorLog.groupedEntries.map((entry) => (
              <li key={`${entry.message}-${entry.lastSeen}`}>
                {entry.message} ({entry.count}회, 마지막 {entry.lastSeen ?? "시각 없음"})
              </li>
            ))
          ) : (
            <li>{errorLog.errorMessage ? `로그를 읽을 수 없습니다: ${errorLog.errorMessage}` : "최근 에러 로그가 없습니다"}</li>
          )}
        </ul>
        {errorLog.entries.length > 0 ? (
          <>
            <h3 className="section-title">원본 최근 라인</h3>
            <ul className="list">
              {errorLog.entries.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section className="panel">
        <h2 className="section-title">빠른 점검 경로</h2>
        <ul className="list">
          <li>
            허브 메인: <Link href="/">/</Link>
          </li>
          <li>
            헬스 API: <Link href="/api/health">/api/health</Link>
          </li>
          <li>운영 기록은 릴리즈 로그 서비스에서 함께 확인할 수 있습니다.</li>
        </ul>
      </section>
    </main>
  );
}
