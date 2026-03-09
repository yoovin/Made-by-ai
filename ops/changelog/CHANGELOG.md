# CHANGELOG

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
