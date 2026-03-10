# CHANGELOG

## 2026-03-10 21:22
- 요약: 허브에 로컬 전용 진법 변환기 신규 서비스 추가
- 변경 이유: 허브 메인 탐색성까지 보강된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 진법 변환기였기 때문
- 사용자 영향: 허브 메인에서 `진법 변환기` 카드로 이동해 정수를 2/8/10/16진수로 서로 변환 가능
- 기술 변경:
  - `src/lib/number-base-tools.ts` 생성, 2/8/10/16진수 정수 변환 helper 추가
  - `src/components/number-base-converter.tsx` 생성, textarea + 변환/지우기 UI 구현
  - `app/services/number-base-converter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `number-base-converter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `진법 변환기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/number-base-converter` → 200 OK
  - 서비스/홈/실험실/search HTML에 `진법 변환기`, `/services/number-base-converter` 노출 확인
  - 실제 Chrome headless에서 `42`, `0xff`, `-15` 변환, 잘못된 입력 오류, 빈 입력 메시지 확인
  - 모바일 폭 Chrome 기준 진법 변환기 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 정수와 2/8/10/16진수 변환에 집중하며, 실수·구분자·더 많은 진법은 포함하지 않음

## 2026-03-10 20:53
- 요약: 허브 메인에 카테고리별 바로가기 섹션 추가
- 변경 이유: 빠른 시작과 최근 업데이트는 추가됐지만, 메인 허브에서 서비스 구조를 카테고리 기준으로 훑어보는 직접 경로는 아직 부족했기 때문
- 사용자 영향: 메인 허브에서 `카테고리별 바로가기`로 `core`, `operations`, `lab`, `productivity` 묶음을 즉시 확인하고 `/services/search?q=...`로 이동 가능
- 기술 변경:
  - `src/lib/home-discovery.ts`에 카테고리 바로가기 helper 추가
  - `app/page.tsx`에 `카테고리별 바로가기` 섹션 추가
  - 기존 `search-category-grid`, `search-category-card` 스타일을 재사용해 추가 CSS 변경 없이 반영
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/` HTML에 `카테고리별 바로가기`, `/services/search?q=productivity`, `/services/search?q=core`, `/services/search?q=operations`, `/services/search?q=lab` 포함 확인
  - 실제 Chrome headless에서 홈 카테고리 바로가기 섹션 노출, 카테고리 링크 이동, 모바일 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 현재 카테고리 바로가기는 `service-registry` 메타데이터를 기반으로 한 정적 분류이며, 개인화 순서나 사용 빈도는 반영하지 않음

## 2026-03-10 20:34
- 요약: 허브 메인에 빠르게 시작하기와 최근 업데이트 섹션 추가
- 변경 이유: 허브 검색과 서비스 수는 충분히 늘어났지만 메인 허브는 여전히 평면적인 카드 그리드 중심이라, 첫 진입 사용자가 어디서 시작할지 빠르게 고르기 어려웠기 때문
- 사용자 영향: 메인 허브에서 `빠르게 시작하기`로 핵심 경로를 바로 따라갈 수 있고, `최근 업데이트`로 최신 서비스 변화를 먼저 확인 가능
- 기술 변경:
  - `src/lib/home-discovery.ts` 생성, 추천 묶음 재사용 및 최근 업데이트 정렬 helper 추가
  - `app/page.tsx`에 `빠르게 시작하기`, `최근 업데이트` 섹션 추가
  - `app/globals.css`에 홈 전용 guided-access 레이아웃 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/` HTML에 `빠르게 시작하기`, `최근 업데이트`, `허브 시작하기`, `운영 빠른 점검`, `로컬 작업 도구` 포함 확인
  - `curl --max-time 20 'http://localhost:80/services/search?q=ops'` HTML에 `운영 빠른 점검`, `/services/server-status` 포함 확인
  - 실제 Chrome headless에서 홈 빠른 시작 섹션 노출, `ops` 링크 이동, 모바일 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 현재 빠른 시작은 추천 묶음과 최근 업데이트를 기반으로 한 고정형 안내이며, 개인화 추천이나 사용 통계 기반 정렬은 포함하지 않음

## 2026-03-10 19:46
- 요약: 허브에 로컬 전용 UUID 생성기 신규 서비스 추가
- 변경 이유: HTML 엔티티 인코더/디코더까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 UUID 생성기였기 때문
- 사용자 영향: 허브 메인에서 `UUID 생성기` 카드로 이동해 UUID v4를 즉시 생성하고 형식을 확인 가능
- 기술 변경:
  - `src/lib/uuid-tools.ts` 생성, UUID v4 생성 및 형식 확인 helper 추가
  - `src/components/uuid-generator.tsx` 생성, 생성/지우기 UI와 결과 표시 구현
  - `app/services/uuid-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `uuid-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `UUID 생성기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/uuid-generator` → 200 OK
  - 서비스/홈/실험실/search HTML에 `UUID 생성기`, `/services/uuid-generator` 노출 확인
  - 실제 Chrome headless에서 UUID v4 형식, 버전/variant 표시, 지우기, 모바일 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 브라우저 내 단일 UUID v4 생성에 집중하며, 배치 생성·복사 버튼·다른 UUID 버전은 포함하지 않음

## 2026-03-10 19:20
- 요약: 허브에 로컬 전용 HTML 엔티티 인코더/디코더 신규 서비스 추가
- 변경 이유: JWT 디코더까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 HTML 엔티티 도구였기 때문
- 사용자 영향: 허브 메인에서 `HTML 엔티티 인코더/디코더` 카드로 이동해 HTML 특수문자를 엔티티로 인코딩하거나 다시 디코딩 가능
- 기술 변경:
  - `src/lib/html-entity-tools.ts` 생성, 기본 HTML 특수문자/숫자 엔티티 encode/decode helper 추가
  - `src/components/html-entity-encoder.tsx` 생성, textarea + 인코딩/디코딩/지우기 UI 구현
  - `app/services/html-entity-encoder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `html-entity-encoder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `HTML 엔티티 인코더/디코더`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/html-entity-encoder` → 200 OK
  - 서비스/홈/실험실/search HTML에 `HTML 엔티티 인코더/디코더`, `/services/html-entity-encoder` 노출 확인
  - 실제 Chrome headless에서 인코딩/디코딩/숫자 엔티티 디코딩/빈 입력 오류 확인
  - 모바일 폭 Chrome 기준 HTML 엔티티 도구 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 기본 HTML 특수문자와 숫자 엔티티에 집중하며, 광범위한 엔티티 사전이나 HTML 렌더링 미리보기는 포함하지 않음

## 2026-03-10 18:41
- 요약: 허브에 로컬 전용 JWT 디코더 신규 서비스 추가
- 변경 이유: 쿼리 문자열 파서까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 JWT 디코더였기 때문
- 사용자 영향: 허브 메인에서 `JWT 디코더` 카드로 이동해 JWT의 header/payload와 표준 시간 claim을 decode-only 방식으로 확인 가능
- 기술 변경:
  - `src/lib/jwt-tools.ts` 생성, JWT 세그먼트 검증·base64url decode·JSON/time claim helper 추가
  - `src/components/jwt-decoder.tsx` 생성, textarea + decode/clear UI와 header/payload/time claim 표시 구현
  - `app/services/jwt-decoder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `jwt-decoder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `JWT 디코더`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/jwt-decoder` → 200 OK
  - 서비스/홈/실험실/search HTML에 `JWT 디코더`, `/services/jwt-decoder` 노출 확인
  - 실제 Chrome headless에서 valid JWT decode, 세그먼트 수 오류, JSON 오류, 빈 입력 메시지 확인
  - 모바일 폭 Chrome 기준 JWT 디코더 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 decode-only에 집중하며, 서명 검증이나 토큰 발급 기능은 포함하지 않음

## 2026-03-10 18:12
- 요약: 허브에 로컬 전용 쿼리 문자열 파서 신규 서비스 추가
- 변경 이유: 케이스 변환기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 쿼리 문자열 파서였기 때문
- 사용자 영향: 허브 메인에서 `쿼리 문자열 파서` 카드로 이동해 URL 또는 raw query를 파싱하고 키/값, 중복 키, 정규화 결과를 바로 확인 가능
- 기술 변경:
  - `src/lib/query-string-tools.ts` 생성, URL/raw query 파싱 및 정규화 helper 추가
  - `src/components/query-string-parser.tsx` 생성, textarea + 파싱/지우기 UI 구현
  - `app/services/query-string-parser/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `query-string-parser` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `쿼리 문자열 파서`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 파싱 결과 row 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/query-string-parser` → 200 OK
  - 서비스/홈/실험실/search HTML에 `쿼리 문자열 파서`, `/services/query-string-parser` 노출 확인
  - 실제 Chrome headless에서 valid URL, raw query, malformed encoding 오류, 빈 입력 메시지 확인
  - 모바일 폭 Chrome 기준 쿼리 문자열 파서 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 파싱과 정규화 결과 표시에 집중하며, URL 재조립 편집이나 쿼리 수정 기능은 포함하지 않음

## 2026-03-10 17:51
- 요약: 허브에 로컬 전용 케이스 변환기 신규 서비스 추가
- 변경 이유: 슬러그 생성기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 케이스 변환기였기 때문
- 사용자 영향: 허브 메인에서 `케이스 변환기` 카드로 이동해 텍스트를 camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case로 변환 가능
- 기술 변경:
  - `src/lib/case-tools.ts` 생성, 토큰화 및 6가지 케이스 변환 helper 추가
  - `src/components/case-converter.tsx` 생성, textarea + 변환/지우기 UI 구현
  - `app/services/case-converter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `case-converter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `케이스 변환기`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 결과 카드 grid 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/case-converter` → 200 OK
  - 서비스/홈/실험실/search HTML에 `케이스 변환기`, `/services/case-converter` 노출 확인
  - 실제 Chrome headless에서 `launch-ready_text 2026`와 `helloWorld` 변환 결과, 빈 입력 오류 확인
  - 모바일 폭 Chrome 기준 케이스 변환기 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 영문자/숫자 기반 케이스 변환에 집중하며, 언어별 음역 규칙이나 복사 버튼은 포함하지 않음

## 2026-03-10 10:40
- 요약: 허브에 로컬 전용 슬러그 생성기 신규 서비스 추가
- 변경 이유: 색상 변환기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 슬러그 생성기였기 때문
- 사용자 영향: 허브 메인에서 `슬러그 생성기` 카드로 이동해 텍스트를 URL/파일명용 ASCII slug로 변환 가능
- 기술 변경:
  - `src/lib/slug-tools.ts` 생성, ASCII kebab-case slug 변환 helper 추가
  - `src/components/slug-generator.tsx` 생성, textarea + 생성/지우기 UI 구현
  - `app/services/slug-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `slug-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `슬러그 생성기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/slug-generator` → 200 OK
  - 서비스/홈/실험실/search HTML에 `슬러그 생성기`, `/services/slug-generator` 노출 확인
  - 실제 Chrome headless에서 일반 입력, 정규화 입력, 잘못된 입력 오류, 빈 입력 안내 메시지 확인
  - 모바일 폭 Chrome 기준 슬러그 생성기 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 ASCII slug 생성에 집중하며, 완전한 다국어 음역 규칙이나 복사 버튼은 포함하지 않음

## 2026-03-10 10:20
- 요약: 허브에 로컬 전용 색상 변환기 신규 서비스 추가
- 변경 이유: 타임스탬프 변환기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 색상 변환기였기 때문
- 사용자 영향: 허브 메인에서 `색상 변환기` 카드로 이동해 HEX, RGB, HSL 색상 값을 서로 변환하고 미리보기를 바로 확인 가능
- 기술 변경:
  - `src/lib/color-tools.ts` 생성, HEX/RGB/HSL 변환 helper 추가
  - `src/components/color-converter.tsx` 생성, textarea + 변환/지우기 UI와 색상 미리보기 구현
  - `app/services/color-converter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `color-converter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `색상 변환기`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 색상 미리보기 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/color-converter` → 200 OK
  - 서비스/홈/실험실/search HTML에 `색상 변환기`, `/services/color-converter` 노출 확인
  - 실제 Chrome headless에서 HEX/RGB/HSL 상호 변환, 잘못된 입력 오류, 빈 입력 안내 메시지 확인
  - 모바일 폭 Chrome 기준 색상 변환기 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 3/6자리 HEX와 정수 RGB/HSL만 지원하며, 알파 채널/색상명/팔레트 저장은 포함하지 않음

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

## 2026-03-10 10:04
- 요약: 허브에 로컬 전용 타임스탬프 변환기 신규 서비스 추가
- 변경 이유: Base64 인코더/디코더까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 타임스탬프 변환기였기 때문
- 사용자 영향: 허브 메인에서 `타임스탬프 변환기` 카드로 이동해 Unix 초/밀리초와 ISO 8601 UTC 문자열을 서로 변환 가능
- 기술 변경:
  - `src/lib/timestamp-tools.ts` 생성, Unix/ISO 변환 helper 추가
  - `src/components/timestamp-converter.tsx` 생성, textarea + 변환/지우기 UI 구현
  - `app/services/timestamp-converter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `timestamp-converter` 서비스 등록
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/timestamp-converter` → 200 OK
  - 서비스/홈/search HTML에 `타임스탬프 변환기`, `/services/timestamp-converter` 노출 확인
  - 실제 Chrome headless에서 Unix 초/밀리초 ↔ ISO 변환, 잘못된 입력 오류, 빈 입력 메시지 확인
  - 모바일 폭 Chrome 기준 타임스탬프 변환기 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 현재는 UTC/Unix 값 변환에 집중하며, 로컬 타임존 문자열이나 상대 시간 표시는 포함하지 않음

## 2026-03-10 09:50
- 요약: 허브에 로컬 전용 Base64 인코더/디코더 신규 서비스 추가
- 변경 이유: URL 인코더/디코더까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 로컬 개발/생산성 유틸리티가 Base64 도구였기 때문
- 사용자 영향: 허브 메인에서 `Base64 인코더/디코더` 카드로 이동해 문자열을 Base64로 인코딩/디코딩하고 잘못된 입력 오류를 바로 확인 가능
- 기술 변경:
  - `src/lib/base64-tools.ts` 생성, UTF-8 안전 Base64 인코딩/디코딩 helper 추가
  - `src/components/base64-encoder.tsx` 생성, textarea + 인코딩/디코딩/지우기 UI 구현
  - `app/services/base64-encoder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `base64-encoder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `Base64 인코더/디코더`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/base64-encoder` → 200 OK
  - 서비스/홈/실험실/search HTML에 `Base64 인코더/디코더`, `/services/base64-encoder` 노출 확인
  - 실제 Chrome headless에서 인코딩/디코딩/UTF-8 round-trip/잘못된 입력 오류/빈 입력 메시지 확인
  - 모바일 폭 Chrome 기준 Base64 인코더 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 단일 문자열 인코딩/디코딩에 집중하며, 파일 업로드나 배치 변환은 포함하지 않음

## 2026-03-10 09:36
- 요약: 허브에 로컬 전용 URL 인코더/디코더 신규 서비스 추가
- 변경 이유: JSON 포맷터/검증기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 로컬 개발/생산성 유틸리티가 URL 도구였기 때문
- 사용자 영향: 허브 메인에서 `URL 인코더/디코더` 카드로 이동해 문자열을 URL 인코딩/디코딩하고 잘못된 입력 오류를 바로 확인 가능
- 기술 변경:
  - `src/lib/url-tools.ts` 생성, URL 인코딩/디코딩 helper 추가
  - `src/components/url-encoder.tsx` 생성, textarea + 인코딩/디코딩/지우기 UI 구현
  - `app/services/url-encoder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `url-encoder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `URL 인코더/디코더`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/url-encoder` → 200 OK
  - 서비스/홈/실험실/search HTML에 `URL 인코더/디코더`, `/services/url-encoder` 노출 확인
  - 실제 Chrome headless에서 인코딩/디코딩/잘못된 입력 오류/빈 입력 메시지 확인
  - 모바일 폭 Chrome 기준 URL 인코더 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 단순 percent-encoding/decoding에 집중하며, 쿼리 파라미터 분해나 배치 변환은 포함하지 않음

## 2026-03-10 09:22
- 요약: 허브에 로컬 전용 JSON 포맷터/검증기 신규 서비스 추가
- 변경 이유: 텍스트 카운터까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 기존 검색/운영 화면을 더 두껍게 만드는 것보다 가장 작은 다음 로컬 유틸리티를 추가하는 편이 더 적합했기 때문
- 사용자 영향: 허브 메인에서 `JSON 포맷터/검증기` 카드로 이동해 JSON 문자열을 포맷하고 유효성을 바로 확인 가능
- 기술 변경:
  - `src/lib/json-tools.ts` 생성, JSON 파싱/포맷/검증 helper 추가
  - `src/components/json-formatter.tsx` 생성, 입력 textarea와 포맷/검증/지우기 UI 구현
  - `app/services/json-formatter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `json-formatter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `JSON 포맷터/검증기`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 JSON 포맷터 전용 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/json-formatter` → 200 OK
  - 서비스/홈/실험실/search HTML에 `JSON 포맷터/검증기`, `/services/json-formatter` 노출 확인
  - 실제 Chrome headless에서 유효 JSON 포맷, 오류 JSON 검증, 빈 입력 안내 메시지 확인
  - 모바일 폭 Chrome 기준 JSON 포맷터 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 JSON 포맷/검증과 기본 메타정보 표시에 집중하며, 스키마 검증·파일 업로드·복사 버튼은 포함하지 않음

## 2026-03-10 08:49
- 요약: 허브에 로컬 전용 텍스트 카운터 신규 서비스 추가
- 변경 이유: 체크리스트까지 추가된 뒤에도 검색/운영 화면은 이미 충분히 강화된 반면, 허브 안에서 바로 쓰는 가장 작은 다음 미니 유틸리티가 더 필요했기 때문
- 사용자 영향: 허브 메인에서 `텍스트 카운터` 카드로 이동해 입력 텍스트의 문자 수, 공백 제외 문자 수, 단어 수, 줄 수를 즉시 확인 가능
- 기술 변경:
  - `src/lib/text-analysis.ts` 생성, 텍스트 통계 계산 helper 추가
  - `src/components/text-counter.tsx` 생성, textarea + 4개 지표 UI 구현
  - `app/services/text-counter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `text-counter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `텍스트 카운터`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 텍스트 카운터 전용 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl -I http://localhost:80/services/text-counter` → 200 OK
  - 서비스 HTML에 `문자 수`, `공백 제외`, `단어 수`, `줄 수` 포함 확인
  - 홈/실험실/search HTML에 `텍스트 카운터`, `/services/text-counter` 노출 확인
  - 실제 Chrome headless에서 `Hello world\nTwo lines` 입력 시 `21 / 18 / 4 / 2` 지표 확인
  - 모바일 폭 Chrome 기준 `텍스트 카운터` 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 현재는 단순 공백 기준 단어 수 계산만 제공하며, 언어별 형태소 분석이나 파일 입력 기능은 포함하지 않음

## 2026-03-10 08:41
- 요약: 허브에 로컬 전용 작업 체크리스트 신규 서비스 추가
- 변경 이유: 포모도로 타이머는 여전히 보류 상태이고, 검색/운영 화면은 이미 충분히 두터워진 반면, 허브 안에서 바로 쓸 수 있는 가장 작은 다음 생산성 서비스가 필요했기 때문
- 사용자 영향: 허브 메인에서 `작업 체크리스트` 카드로 이동해 할 일 추가, 완료 체크, 새로고침 후 유지, 삭제까지 로컬 브라우저 기준으로 수행 가능
- 기술 변경:
  - `src/lib/checklist-storage.ts` 생성, 체크리스트 파싱/추가/토글/삭제 helper 추가
  - `src/components/checklist-manager.tsx` 생성, localStorage 기반 체크리스트 UI 구현
  - `app/services/checklist/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `checklist` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `작업 체크리스트`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 체크리스트 전용 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl http://localhost:80/services/checklist` → 200 OK
  - 홈 HTML에 `작업 체크리스트`, `/services/checklist` 포함 확인
  - 실험실 HTML에 `작업 체크리스트`, `승격 완료`, `/services/checklist` 포함 확인
  - `curl 'http://localhost:80/services/search?q=productivity'` HTML에 `/services/checklist` 포함 확인
  - 실제 Chrome headless에서 추가 → 완료 체크 → 새로고침 후 유지 → 삭제 흐름과 localStorage 반영 확인
  - 모바일 폭 Chrome 기준 체크리스트 핵심 요소 표시 확인
- 리스크 / 제한사항:
  - 체크리스트는 현재 브라우저의 localStorage에만 저장되며, 편집/정렬/동기화 기능은 이번 단계에 포함하지 않음

## 2026-03-10 08:05
- 요약: 허브 검색 서비스에 추천 서비스 묶음 추가
- 변경 이유: 카테고리/태그 탐색 힌트는 강화됐지만, 사용자가 목적별로 바로 따라갈 수 있는 추천 경로가 없어 검색 결과가 없을 때 여전히 다음 행동이 모호할 수 있었기 때문
- 사용자 영향: 허브 검색에서 `허브 시작하기`, `운영 빠른 점검`, `로컬 작업 도구` 같은 추천 서비스 묶음을 보고 바로 관련 서비스로 이동 가능
- 기술 변경:
  - `src/lib/search-discovery.ts`에 query-aware 추천 묶음 helper 추가
  - `app/services/search/page.tsx`에 `추천 서비스 묶음` 섹션과 검색어 기반 관련도 표시 추가
  - `app/globals.css`에 추천 묶음 카드/링크 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `curl http://localhost:80/services/search` HTML에 `추천 서비스 묶음`, `허브 시작하기`, `운영 빠른 점검`, `로컬 작업 도구` 포함 확인
  - `curl 'http://localhost:80/services/search?q=ops'` HTML에 `운영 빠른 점검`, `/services/server-status` 포함 확인
  - `curl 'http://localhost:80/services/search?q=productivity'` HTML에 `로컬 작업 도구`, `/services/bookmarks` 포함 확인
  - `curl 'http://localhost:80/services/search?q=%EC%97%86%EB%8A%94%EA%B2%80%EC%83%89%EC%96%B4'` HTML에 `일치하는 서비스가 없습니다`, `추천 서비스 묶음` 포함 확인
  - 실제 Chrome headless에서 추천 묶음 노출, `ops` 묶음 링크 이동, 모바일 폭 표시 확인
- 리스크 / 제한사항:
  - 추천 묶음은 현재 `service-registry` 메타데이터와 고정된 묶음 정의를 기반으로 하며, 실사용 통계 기반 개인화 추천은 아직 포함하지 않음

## 2026-03-10 07:32
- 요약: 서버 상태 대시보드에 PM2 uptime 표시 추가
- 변경 이유: 기존 대시보드는 현재 상태와 에러 요약은 보여 주지만, 프로세스가 언제부터 살아 있었는지까지는 한 화면에서 바로 확인하기 어려웠기 때문
- 사용자 영향: 서버 상태 대시보드에서 `made-by-ai` 프로세스의 uptime과 PM2 시작 시각을 함께 확인 가능
- 기술 변경:
  - `app/services/server-status/page.tsx`에 `pm_uptime` 기반 `프로세스 uptime`, `pm2 시작 시각` 표시 추가
  - PM2 데이터가 없는 경우에도 `확인 불가` fallback으로 안전하게 렌더링되도록 처리
- 검증:
  - `pm2 jlist`에서 `made-by-ai`의 `pm_uptime` 존재 확인
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/server-status` HTML에 `프로세스 uptime`, `pm2 시작 시각` 및 ISO 시각 문자열 포함 확인
  - 실제 Chrome desktop/mobile DOM dump에서 두 항목 표시 확인
- 리스크 / 제한사항:
  - uptime은 실시간 값이라 절대 숫자 자체보다 항목 존재와 형식 기준으로 검증해야 하며, 프로세스 재시작 시 값이 달라질 수 있음

## 2026-03-10 07:18
- 요약: 서버 상태 대시보드에 반복 에러 그룹 요약 추가
- 변경 이유: 최근 에러 로그는 표시되고 있었지만 반복 경고와 단일 오류를 한눈에 구분하기 어려워 운영 판단 속도가 떨어질 수 있었기 때문
- 사용자 영향: 서버 상태 대시보드에서 고유 에러 그룹 수, 반복 발생 수, 반복 메시지별 마지막 시각을 함께 확인 가능
- 기술 변경:
  - `src/lib/pm2-log-summary.ts`에 timestamp 제거 기준의 보수적 그룹 요약 로직 추가
  - `app/services/server-status/page.tsx`에 `고유 에러 그룹 수`, `반복 발생 수`, `원본 최근 라인` 렌더링 추가
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/server-status` HTML에 `고유 에러 그룹 수`, `반복 발생 수`, `원본 최근 라인` 포함 확인
  - 동일 HTML에 `Cross origin request detected`, `Read more:` 반복 메시지 포함 확인
  - 실제 Chrome desktop/mobile DOM dump에서 새 그룹화 섹션과 반복 메시지 표시 확인
- 리스크 / 제한사항:
  - 현재 그룹화는 timestamp만 제거한 뒤 동일 문자열을 묶는 보수적 방식이며, 의미상 유사하지만 문자열이 다른 에러까지 합치지는 않음

## 2026-03-10 07:03
- 요약: 허브 검색 서비스에 카테고리/태그 기반 탐색 힌트 강화
- 변경 이유: 기존 검색 화면은 키워드 입력과 평면적인 힌트 칩만 보여 주어, 사용자가 서비스 구조를 훑어보며 탐색하기에는 정보 밀도가 부족했기 때문
- 사용자 영향: 허브 검색에서 카테고리별 서비스 수와 예시를 보고 바로 탐색할 수 있고, 태그 힌트도 빈도 기반으로 더 안정적으로 확인 가능
- 기술 변경:
  - `src/lib/search-discovery.ts` 생성, 카테고리/태그 탐색 요약 helper 추가
  - `app/services/search/page.tsx`에 카테고리 카드형 탐색 섹션과 빈 결과 fallback 힌트 추가
  - `app/globals.css`에 검색 탐색 카드/카운트 스타일 추가
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/search` HTML에 `카테고리별 둘러보기`, `개 서비스`, `태그로 바로 찾기` 포함 확인
  - `curl 'http://localhost:80/services/search?q=productivity'` HTML에 `productivity`, `검색 결과 2개`, `카테고리별 둘러보기` 포함 확인
  - `curl 'http://localhost:80/services/search?q=%EC%97%86%EB%8A%94%EA%B2%80%EC%83%89%EC%96%B4'` HTML에 `일치하는 서비스가 없습니다`, `다른 방식으로 둘러보기` 포함 확인
  - 실제 Chrome headless에서 카테고리 카드 노출, `productivity` 힌트 클릭 결과 반영, 모바일 폭 표시 확인
- 리스크 / 제한사항:
  - 현재 탐색 힌트는 `service-registry` 메타데이터를 기반으로 한 정적 요약이며, 실시간 사용 통계나 인기순 데이터는 반영하지 않음

## 2026-03-10 06:49
- 요약: 허브에 로컬 전용 마크다운 메모장 신규 서비스 추가
- 변경 이유: 북마크 관리까지 추가된 뒤에도 실험실에 남아 있는 가장 작은 신규 사용자용 후보였고, localStorage만으로 완결되는 안전한 생산성 서비스였기 때문
- 사용자 영향: 허브 메인에서 `마크다운 메모장` 카드로 이동해 제목과 메모를 저장, 새로고침 후 복원, 메모 비우기까지 로컬 브라우저 기준으로 수행 가능
- 기술 변경:
  - `src/components/markdown-memo.tsx` 생성, localStorage 기반 메모 저장/복원/비우기 구현
  - `app/services/markdown-memo/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `markdown-memo` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `마크다운 메모장`을 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 메모 폼/textarea/저장 상태 스타일 추가
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/markdown-memo` → 200 OK
  - 홈 HTML에 `마크다운 메모장`, `/services/markdown-memo` 포함 확인
  - 실험실 HTML에 `마크다운 메모장`, `승격 완료`, `/services/markdown-memo` 포함 확인
  - 실제 Chrome headless에서 메모 저장 → 새로고침 후 유지 → 메모 비우기 흐름 확인
  - 실제 Chrome headless에서 localStorage에 저장된 메모 JSON 반영 확인
  - 모바일 폭 Chrome DOM dump에서 `마크다운 메모장`, `메모 작성`, `메모 저장`, `저장된 메모가 없습니다` 표시 확인
- 리스크 / 제한사항:
  - 메모는 현재 브라우저의 localStorage에만 저장되며, 이번 단계에서는 마크다운 원문 저장/복원에 집중하고 별도 렌더링은 제공하지 않음

## 2026-03-10 06:33
- 요약: 허브에 로컬 전용 북마크 관리 신규 서비스 추가
- 변경 이유: 운영 화면 중심의 개선이 이어진 뒤, 허브 안에서 바로 접근 가능한 작고 실용적인 사용자용 신규 서비스를 하나 더 추가할 필요가 있었기 때문
- 사용자 영향: 허브 메인에서 `북마크 관리` 카드로 이동해 자주 여는 링크를 저장, 새로고침 후 유지, 제거까지 로컬 브라우저 기준으로 수행 가능
- 기술 변경:
  - `src/components/bookmark-manager.tsx` 생성, localStorage 기반 북마크 추가/제거/복원 구현
  - `app/services/bookmarks/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `bookmarks` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `북마크 관리`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 북마크 폼/목록 스타일 추가
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/bookmarks` → 200 OK
  - 홈 HTML에 `북마크 관리`, `/services/bookmarks` 포함 확인
  - 실험실 HTML에 `북마크 관리`, `승격 완료`, `/services/bookmarks` 포함 확인
  - 실제 Chrome headless에서 북마크 추가 → 새로고침 후 유지 → 제거 흐름 확인
  - 실제 Chrome headless에서 `http://` 입력 시 `URL 형식이 올바르지 않습니다` 인라인 오류 확인
  - 모바일 폭 Chrome DOM dump에서 `북마크 관리`, `북마크 저장`, `북마크 추가`, `저장된 북마크가 없습니다` 표시 확인
- 리스크 / 제한사항:
  - 북마크는 현재 브라우저의 localStorage에만 저장되며 다른 브라우저나 기기와 동기화되지 않음

## 2026-03-10 06:16
- 요약: 허브 전역 아이콘 추가 및 실제 Chrome 기준 브라우저 검증 완료
- 변경 이유: Oracle 검증 단계에서 허브/검색/운영 화면에 대한 실제 브라우저 확인이 부족했고, 검색 화면에서 불필요한 404 console 이벤트를 줄이기 위해 전역 아이콘이 필요했기 때문
- 사용자 영향: 허브 전역 아이콘이 적용되고, 주요 허브 경로가 실제 Chrome headless 기준으로 다시 검증됨
- 기술 변경:
  - `app/icon.svg` 추가
  - Chrome headless + DevTools 프로토콜로 메인 허브, 검색, 서버 상태, 실험실, 404 경로 재검증 수행
- 검증:
  - `npx tsc --noEmit` 통과
  - 실제 Chrome headless 재검증에서 `home`, `search`, `server-status`, `experiments` 경로 body 렌더링 확인
  - `search` 경로 console에서 불필요한 404 이벤트 제거 확인
  - 실제 Chrome DOM dump로 404 경로에 `페이지를 찾을 수 없습니다` 렌더링 확인
  - 모바일 폭 Chrome DOM dump에서 `서버 상태 대시보드`, `포트 및 진입 경로 상태`, `최근 에러 로그 요약` 표시 확인
- 리스크 / 제한사항:
  - 404 경로에서는 상태 코드 404 자체에 따른 브라우저 레벨 404 이벤트가 남을 수 있으나, 커스텀 404 콘텐츠 렌더링은 정상 동작함

## 2026-03-10 04:53
- 요약: 서버 상태 대시보드에 최근 PM2 에러 로그 요약 추가
- 변경 이유: 현재 대시보드는 헬스 체크, PM2 상태, 포트 상태는 보여 주지만 최근 에러 흔적까지는 한 화면에서 확인할 수 없어 운영 확인 흐름이 한 번 더 끊기고 있었기 때문
- 사용자 영향: 서버 상태 대시보드에서 최근 PM2 에러 로그 일부와 마지막 에러 시각, 로그 파일 상태를 함께 확인 가능
- 기술 변경:
  - `src/lib/pm2-log-summary.ts` 생성, `ops/logs/pm2-error.log` 읽기 전용 요약 helper 추가
  - `app/services/server-status/page.tsx`에 `최근 에러 로그 요약` 섹션 추가
- 검증:
  - `curl http://localhost:80/services/server-status | grep -F '최근 에러 로그 요약'` → 섹션 노출 확인
  - `curl http://localhost:80/services/server-status` → 200 OK
  - 응답 HTML에 `pm2-error.log`, `마지막 에러 시각`, 최근 에러 라인 문자열 포함 확인
  - `npx tsc --noEmit` 통과
- 리스크 / 제한사항:
  - 현재는 최근 몇 줄만 요약해서 보여 주며, 전체 로그 브라우징 기능은 제공하지 않음

## 2026-03-10 04:50
- 요약: 서버 상태 대시보드에 포트 및 진입 경로 상태 추가
- 변경 이유: PM2 상태만으로는 사용자가 실제 공개 포트와 내부 앱 포트가 모두 살아 있는지 한눈에 확인하기 어려웠기 때문
- 사용자 영향: 서버 상태 대시보드에서 공개 포트 80, 내부 앱 포트 4000, 두 진입 경로의 응답 상태를 함께 확인 가능
- 기술 변경:
  - `app/services/server-status/page.tsx`에 공개/내부 진입 경로 확인용 읽기 전용 endpoint 체크 추가
  - 포트 및 진입 경로 상태 섹션과 관련 KPI 표시 추가
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/server-status` → 200 OK
  - `curl http://127.0.0.1:80/` → 200 확인
  - `curl http://127.0.0.1:4000/` → 200 확인
  - 페이지 HTML에 `포트 및 진입 경로 상태`, `공개 포트 80 응답`, `내부 앱 포트 4000 응답`, `public entry`, `internal entry` 포함 확인
- 리스크 / 제한사항:
  - 내부 앱 포트 값은 현재 운영 구성 기준 4000에 맞춰 읽으며, 추후 포트 구성이 바뀌면 함께 갱신해야 함

## 2026-03-10 04:47
- 요약: 허브 맞춤 404 페이지 추가
- 변경 이유: 서비스 수가 늘어나는 허브형 구조에서 잘못된 경로나 오래된 링크로 들어왔을 때도 사용자가 허브 탐색 흐름을 잃지 않도록 하기 위해
- 사용자 영향: 존재하지 않는 경로에 접근해도 허브 메인, 허브 검색, 릴리즈 로그로 바로 이동할 수 있는 안내형 404 화면을 보게 됨
- 기술 변경:
  - `app/not-found.tsx` 생성
  - 허브 톤에 맞는 안내 문구와 주요 복귀 링크 카드 구성
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/nonexistent` → 404 확인
  - 404 HTML에 `페이지를 찾을 수 없습니다`, `허브 메인`, `허브 검색`, `릴리즈 로그` 포함 확인
- 리스크 / 제한사항:
  - 현재 404 화면의 추천 링크는 정적 구성이므로 향후 대표 서비스가 바뀌면 수동 갱신이 필요함

## 2026-03-10 04:44
- 요약: 허브에 쿼리 기반 검색 신규 서비스 추가
- 변경 이유: 서비스 수가 늘어날수록 허브 안에서 등록된 서비스를 바로 찾을 수 있는 전용 진입점이 필요했고, 브라우저 의존 없이도 curl로 검증 가능한 서버 렌더링 검색이 가장 안전했기 때문
- 사용자 영향: 허브 메인에서 `허브 검색` 카드로 이동해 키워드별 서비스 검색 결과와 빈 결과 상태를 바로 확인 가능
- 기술 변경:
  - `src/lib/service-registry.ts`에 `search` 서비스 등록
  - `app/services/search/page.tsx` 생성, `q` 쿼리스트링 기반 서버 렌더링 검색 구현
  - `app/services/experiments/page.tsx`에서 `허브 검색` 항목을 `승격 완료`와 실제 서비스 링크로 갱신
  - `app/globals.css`에 검색 폼 스타일 추가
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/search` → 200 OK
  - `curl 'http://localhost:80/services/search?q=%EB%A6%B4%EB%A6%AC%EC%A6%88'` 결과 HTML에 `릴리즈 로그`, `검색 결과 1개` 포함 확인
  - `curl 'http://localhost:80/services/search?q=%EC%97%86%EB%8A%94%EA%B2%80%EC%83%89%EC%96%B4'` 결과 HTML에 `일치하는 서비스가 없습니다` 포함 확인
  - 홈 HTML에 `허브 검색` 및 `/services/search` 포함 확인
- 리스크 / 제한사항:
  - 현재 검색은 쿼리 제출형 서버 렌더링 방식이며, 즉시 반응형 클라이언트 검색은 아님

## 2026-03-10 04:41
- 요약: 서버 상태 대시보드에 PM2 프로세스 상태 표시 추가
- 변경 이유: 기존 대시보드는 `/api/health` 기반 최소 상태만 보여 주어 실제 상시 서비스 프로세스가 온라인인지 한 화면에서 확인하기 어려웠기 때문
- 사용자 영향: 서버 상태 대시보드에서 `made-by-ai` PM2 프로세스의 상태, 재시작 횟수, 메모리, CPU 정보를 함께 확인 가능
- 기술 변경:
  - `app/services/server-status/page.tsx`에 `pm2 jlist` 기반 읽기 전용 상태 조회 추가
  - PM2 상태, 재시작 횟수, 메모리 사용량, CPU 사용률 섹션 렌더링 추가
- 검증:
  - `npx tsc --noEmit` 통과
  - `curl http://localhost:80/services/server-status` → 200 OK
  - `pm2 jlist`에서 `made-by-ai` 프로세스 `online` 상태 확인
  - 페이지 HTML에 `PM2 프로세스 상태`, `online`, `made-by-ai`, `재시작 횟수`, `메모리 사용량` 포함 확인
- 리스크 / 제한사항:
  - PM2 조회는 현재 서버 로컬 명령 실행에 의존하므로 PM2가 없는 환경에서는 `unavailable` fallback으로 표시됨

## 2026-03-10 04:35
- 요약: 실험실 페이지에서 서버 상태 대시보드 승격 상태를 실제 서비스 기준으로 반영
- 변경 이유: 새로 추가된 `서버 상태 대시보드`가 실험실 페이지에서는 아직 "설계 중"으로 보여 허브 내부 정보가 서로 어긋나고 있었기 때문
- 사용자 영향: 실험실에서 해당 아이디어가 이미 정식 서비스로 승격되었음을 바로 확인하고, 카드 클릭으로 실제 서비스에 이동 가능
- 기술 변경:
  - `app/services/experiments/page.tsx`에서 `서버 상태 대시보드` 항목 상태를 `승격 완료`로 변경
  - 해당 항목에 `/services/server-status` 링크를 연결해 실험실에서도 실제 서비스로 이동 가능하게 구성
- 검증:
  - `curl http://localhost:80/services/experiments` → 200 OK
  - 응답 HTML에 `승격 완료`, `서버 상태 대시보드`, `/services/server-status` 포함 확인
  - `npx tsc --noEmit` 통과
- 리스크 / 제한사항:
  - 실험실 아이디어 목록은 정적 배열이므로 향후 승격 상태도 수동 갱신이 필요함

## 2026-03-10 04:32
- 요약: approval queue 디렉터리 경로를 `rejected` 기준으로 통일
- 변경 이유: 승인 봇은 `ops/approvals/rejected`를 사용하지만 공통 셸 스크립트 일부가 `discarded`를 생성해 승인/폐기 흐름의 경로 정합성이 깨질 수 있었기 때문
- 사용자 영향: 승인/폐기 처리 후 파일이 저장되는 디렉터리 기준이 스크립트 전반에서 일치함
- 기술 변경:
  - `scripts/common.sh`의 approval 디렉터리 생성 경로를 `rejected`로 수정
  - `scripts/omo-autoloop.sh`의 approval 디렉터리 생성 경로를 `rejected`로 수정
- 검증:
  - `grep` 기준으로 실행 스크립트 내 `discarded` 참조 제거 확인
  - `bash -n scripts/common.sh && bash -n scripts/omo-autoloop.sh` 통과
  - `python3 -m py_compile scripts/approval_bot.py scripts/request_approval.py` 통과
- 리스크 / 제한사항:
  - 문서형 요약 파일에는 과거 작업 후보 문맥으로 `discarded` 문자열이 남아 있을 수 있으나 실행 경로에는 영향 없음

## 2026-03-10 04:30
- 요약: 허브에 서버 상태 대시보드 신규 서비스 추가
- 변경 이유: 허브 안에서 바로 접근 가능한 작은 운영 서비스를 늘리면서도 기존 `/api/health` 경로를 활용해 안전하게 사용자 가치를 추가하기 위해
- 사용자 영향: 허브 메인에서 "서버 상태 대시보드" 카드를 통해 현재 헬스 체크 결과와 점검 경로를 바로 확인 가능
- 기술 변경:
  - `src/lib/service-registry.ts`에 `server-status` 서비스 등록
  - `app/services/server-status/page.tsx` 생성
  - 서버에서 `/api/health`를 읽어 상태, 응답 코드, 서비스 이름, 점검 경로를 표시하도록 구성
- 검증:
  - `curl http://localhost:80/services/server-status` → 200 OK
  - `curl http://localhost:80/api/health` → `{"ok":true,"service":"made-by-ai",...}` 확인
  - 홈 HTML에 `서버 상태 대시보드` 및 `/services/server-status` 문자열 포함 확인
  - `npx tsc --noEmit` 통과
- 리스크 / 제한사항:
  - 상태 정보는 현재 `/api/health` 기반의 최소 헬스 체크이며 PM2 상세 상태까지는 아직 포함하지 않음

## 2026-03-10 04:16
- 요약: 승인 봇에 텔레그램 자연어 응답 해석과 보류 메타데이터 반영 추가
- 변경 이유: AGENTS.md는 텔레그램의 짧은 자연어 답변도 해석해 승인 상태를 반영하라고 요구하지만 기존 `scripts/approval_bot.py`는 정해진 명령어만 처리해 승인 대기 작업이 멈출 수 있었기 때문
- 사용자 영향: `해`, `계속`, `나중에`, `그건 폐기`, `작게만 해`, `오늘은 배포하지마` 같은 답변을 approval bot이 더 자연스럽게 해석 가능
- 기술 변경:
  - `scripts/approval_bot.py`에 자연어 답변 패턴 추가
  - 답장한 승인 메시지나 단일 pending 항목 기준으로 승인 ID를 추론하는 로직 추가
  - 보류 / 다른 작업 우선 / 범위 축소 / 배포 금지 요청을 pending JSON 메타데이터로 반영하는 처리 추가
- 검증:
  - `python3 -m py_compile scripts/approval_bot.py` 통과
  - 임시 approval JSON으로 `해`, `나중에`, `작게만 해`, `오늘은 배포하지마`를 시뮬레이션해 각각 `approved`, `on_hold`, `scope_reduction_requested`, `deployment_blocked` 반영 확인
  - `그건 폐기` 답변과 reply-to-message의 `ID:` 문맥으로 `rejected` 이동 확인
- 리스크 / 제한사항:
  - pending 항목이 여러 개인데 ID도 답장 문맥도 없으면 봇은 보수적으로 ID 안내 메시지를 반환함

## 2026-03-10 04:12
- 요약: 텔레그램 텍스트 전송 스크립트에 `\\n` 개행 정규화 추가
- 변경 이유: 여러 스크립트가 텔레그램 메시지를 한 줄 인자로 넘기면서 `\n` 문자열이 그대로 보일 수 있어 사람이 읽기 쉬운 보고 형식을 안정적으로 유지하기 위해
- 사용자 영향: 텔레그램 진행 보고에서 `\n` 리터럴 대신 실제 줄바꿈으로 메시지를 읽을 수 있음
- 기술 변경:
  - `scripts/telegram_send.py`에 `normalize_text()` 추가
  - 전송 직전 `\\n` 문자열을 실제 개행 문자로 변환하도록 적용
- 검증:
  - `python3 - <<'PY' ... print(repr(mod.normalize_text('[작업 시작]\\n현재 단계: 점검\\n다음 행동: 검증'))) ... PY` 결과가 실제 개행 문자열로 출력됨
  - `python3 scripts/telegram_send.py '[작업 시작]\n현재 단계: 줄바꿈 처리 점검\n작업 내용: 텔레그램 메시지 개행 경로 확인\n이유: literal \\n 대신 실제 줄바꿈으로 읽히게 하기 위함\n결과: 중앙 정규화 적용 후 전송 테스트\n다음 행동: 기록 반영'` 종료 코드 0
  - `python3 -m py_compile scripts/telegram_send.py scripts/telegram_send_document.py` 통과
- 리스크 / 제한사항:
  - 메시지 안에 `\\n` 문자열 자체를 문자 그대로 보여 주고 싶은 특수 경우에는 개행으로 변환됨

## 2026-03-10 04:03
- 요약: 텔레그램 요약 문서 전송 스크립트에 캡션 인자 호환 추가
- 변경 이유: `scripts/omo-autoloop.sh`가 요약 문서 전송 시 파일 경로와 캡션을 함께 넘기는데 기존 스크립트가 1개 인자만 받아 자동 보고가 중간에 실패했기 때문
- 사용자 영향: 자동 루프의 텔레그램 요약 문서 전송이 기존 호출 방식 그대로 동작하며, 사람이 읽기 쉬운 캡션도 함께 전달 가능
- 기술 변경:
  - `scripts/telegram_send_document.py`가 1개 또는 2개 인자를 모두 허용하도록 수정
  - 두 번째 인자가 있을 경우 `sendDocument`의 `caption` 필드로 함께 전송
- 검증:
  - `python3 scripts/telegram_send_document.py ops/last-summary.md '[사이클 요약] 가독성 테스트'` 종료 코드 0
  - `python3 scripts/telegram_send.py '[사이클 시작]\n선택한 작업: 텔레그램 보고 경로 점검\n이유: 운영 보고 경로 유지\n변경 범위: 문서 전송 인자 처리\n현재 상태: 전송 테스트 중\n다음 행동: 오토루프 경로 검증'` 종료 코드 0
  - `python3 -m py_compile scripts/telegram_send.py scripts/telegram_send_document.py` 통과
- 리스크 / 제한사항:
  - 실제 전송 성공은 `.env.local`의 봇 토큰과 채팅 ID 유효성에 계속 의존함

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
