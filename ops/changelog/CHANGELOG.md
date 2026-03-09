# CHANGELOG

## 2026-03-10 03:55
- 요약: 허브 메인 서비스 카드에 마지막 업데이트 날짜 표시 추가
- 변경 이유: 서비스 수가 늘어날수록 사용자가 어떤 카드가 최근에 갱신되었는지 허브 화면에서 바로 파악할 수 있게 하기 위해
- 사용자 영향: 허브 메인에서 각 서비스 카드의 최근 갱신 날짜를 확인 가능
- 기술 변경:
  - `app/page.tsx`에서 서비스 카드 하단에 `updatedAt` 표시 추가
  - `app/globals.css`에 카드 메타 텍스트 스타일 추가
- 검증:
  - `curl http://localhost:80/` → 200 OK
  - 홈 HTML에 `업데이트` 및 `2026-03-09` 문자열 포함 확인
  - `npx tsc --noEmit` 통과
- 리스크 / 제한사항:
  - 날짜 값은 `src/lib/service-registry.ts`의 정적 문자열에 의존하므로 서비스 변경 시 수동 갱신이 필요

## 2026-03-10 03:51
- 요약: 허브 소개 서비스에 전용 안내 페이지 추가
- 변경 이유: 허브의 첫 진입 서비스인 `/services/hub-intro`가 generic template만 보여 주어 플랫폼 구조를 이해하기 어려운 UX 공백을 줄이기 위해
- 사용자 영향: 사용자가 허브 소개 카드 클릭 시 플랫폼 구조, 서비스 추가 방식, 운영 원칙을 한 화면에서 바로 이해 가능
- 기술 변경:
  - `app/services/hub-intro/page.tsx` 생성 (전용 페이지, `[slug]` 라우트 오버라이드)
  - 허브 소개, 서비스 추가 4단계 규칙, 현재 서비스 현황, 개발 원칙 섹션 구성
- 검증:
  - `curl http://localhost:80/services/hub-intro` → 200 OK
  - 응답 HTML에 `<h1>허브 소개</h1>` 포함 확인
  - `npx tsc --noEmit` 통과
- 리스크 / 제한사항:
  - 현재 서비스 현황 섹션은 정적 설명이므로 서비스 수 변경 시 별도 갱신이 필요

## 2026-03-10 11:00
- 요약: 릴리즈 로그 서비스 페이지에 실제 CHANGELOG 내용 연결
- 변경 이유: /services/release-log 카드가 있지만 페이지에 아무 내용도 없는 UX 문제 해결
- 사용자 영향: 허브에서 "릴리즈 로그" 카드 클릭 시 실제 변경 이력 확인 가능
- 기술 변경:
  - app/services/release-log/page.tsx 생성 (전용 페이지, [slug] 라우트 오버라이드)
  - fs.readFileSync로 ops/changelog/CHANGELOG.md 서버사이드 읽기
  - ## 기준 섹션 파싱, 들여쓰기 구분 렌더링
- 검증:
  - curl http://localhost:80/services/release-log → 200 OK
  - CHANGELOG 내용(날짜, 항목) HTML에 포함 확인
  - TypeScript 오류 없음
- 리스크 / 제한사항:
  - CHANGELOG.md 파일 삭제 시 에러 처리 내장
  - markdown 렌더러 없이 직접 파싱 — 복잡한 포맷 미지원

## 2026-03-10 02:00
- 요약: 80번 포트 상시 서비스 배포 및 hot reload 적용
- 변경 이유: Next.js 앱을 80번 포트에서 항시 서비스하고 코드 수정사항이 실시간 반영되도록 하기 위해
- 사용자 영향: http://localhost:80 (및 서버 IP:80)으로 허브 앱 접근 가능, 코드 저장 즉시 반영
- 기술 변경:
  - PM2로 `next dev --port 4000` 프로세스 상시 실행 (크래시 시 자동 재시작)
  - nginx `/etc/nginx/sites-available/made-by-ai` 추가: 80→4000 리버스 프록시
  - `ecosystem.config.js` 추가: PM2 실행 구성 명세
  - PM2 startup 등록 (pm2-abc.service): 재부팅 시 자동 복원
  - PM2 dump 저장: `/config/.pm2/dump.pm2`
- 검증:
  - `curl http://localhost:80/` → 200 OK (Made by AI 허브 HTML)
  - `curl http://localhost:80/services/hub-intro` → 200 OK
  - `curl http://localhost:80/api/health` → 200 OK
  - PM2 status: online, 크래시 0회
- 리스크 / 제한사항:
  - dev 모드 실행이므로 production 대비 성능은 낮지만 hot reload 가능
  - 컨테이너 환경에서 pm2 startup이 systemd 방식으로 등록됨 (재시작 시 pm2 resurrect 또는 ecosystem.config.js 재실행 필요할 수 있음)

## 2026-03-10 10:00
- 요약: 서비스 상세 페이지 정적 생성(SSG) 적용
- 변경 이유: production 빌드 시 모든 서비스 페이지를 미리 렌더링하여 성능과 SEO를 개선하기 위해
- 사용자 영향: 서비스 상세 페이지 로딩 속도 향상
- 기술 변경:
  - `app/services/[slug]/page.tsx`에 `generateStaticParams` 함수 추가
  - `serviceRegistry`의 모든 slug를 기반으로 정적 경로 생성
- 검증:
  - `pnpm build` 실행 결과 `/services/[slug]` 경로가 SSG(●)로 생성됨을 확인
  - `hub-intro`, `release-log`, `experiments` 경로가 정상적으로 pre-render됨
- 리스크 / 제한사항:
  - 새로운 서비스 추가 시 빌드 타임에 반영됨 (Dynamic Params 설정에 따라 런타임 동작 결정)

## 2026-03-09 15:00
- 요약: 허브형 스타터와 로컬 자동개발 운영 구조 생성
- 변경 이유: Made by AI 프로젝트를 로컬 Ubuntu 자율 운영형으로 시작하기 위해
- 사용자 영향: 첫 허브 화면과 예시 서비스 카드 접근 가능
- 기술 변경:
  - Next.js 허브형 기본 구조 생성
  - Telegram 실시간 알림 플러그인 추가
  - Telegram 승인 봇 추가
  - systemd / nginx 템플릿 추가
- 검증:
  - 수동 점검 필요
- 리스크 / 제한사항:
  - 실제 OpenCode 인증과 Telegram 토큰은 사용자가 채워야 함
  - 첫 부트스트랩은 사용자 시스템에서 1회 실행 필요
