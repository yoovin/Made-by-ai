import Link from "next/link";
import { PomodoroTimer } from "@/components/pomodoro-timer";

export default function PomodoroTimerPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge beta">beta</span>
            <span className="badge">productivity</span>
          </div>
          <h1>포모도로 타이머</h1>
          <p className="section-desc">focus/break 분 단위 입력으로 동작하는 로컬 전용 포모도로 타이머 MVP입니다.</p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 안내</h2>
        <ul className="list">
          <li>브라우저 안에서만 처리되며 현재 탭 기준으로 동작합니다.</li>
          <li>이번 단계에서는 focus/break minutes, start/pause/reset/skip, completed focus count만 지원합니다.</li>
          <li>notifications, audio, persistence, long break cadence, analytics는 이번 MVP에 포함하지 않습니다.</li>
        </ul>
      </section>

      <PomodoroTimer />
    </main>
  );
}
