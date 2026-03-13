# 마지막 자동 개발 요약

## 2026-03-12 18:05

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 cert/CSR/public-key/JWK/SSH inspector까지 충분히 넓어졌고, 다음 단계로는 pasted PEM text가 무엇인지 먼저 triage해 주는 low-risk front-door utility가 가장 작은 gap이었음
- Oracle tie-break 기준으로 `private key inspector`보다 `PEM 블록 식별기`가 더 작고 안전하며, existing inspector cluster를 더 잘 연결하는 entry-point utility로 평가됐음

### 선택한 작업
PEM 블록 식별기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 사용자가 복붙한 PEM artifact를 어떤 inspector로 보내야 하는지 결정하는 triage gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/pem-block-tools.ts` 생성, label-only PEM boundary scanner + block summary/issue classifier 추가
- `src/lib/pem-block-tools.test.ts` 생성, helper regression harness 추가
- `src/components/pem-block-inspector.tsx` 생성, textarea 입력 + identify/clear UI와 classification panel 구현
- `app/services/pem-block-inspector/page.tsx` 생성
- `package.json`에 `test:pem-block-tools` 스크립트 추가
- `src/lib/service-registry.ts`에 `pem-block-inspector` 서비스 등록
- `app/services/experiments/page.tsx`에서 `PEM 블록 식별기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `pem`/`bundle`/`identify`/`triage` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- `package.json`은 biome 미설치로 diagnostics unavailable이지만 `pnpm lint`와 `pnpm build`는 통과
- `pnpm test:pem-block-tools`에서 blank input, no-PEM text, single cert, single CSR, single public key, single private key, encrypted private key, same-label bundle, mixed bundle, mismatched boundary, stray END, missing END 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/pem-block-inspector` → 200, 홈/실험실/search HTML에 `/services/pem-block-inspector`, `PEM 블록 식별기` 노출 확인
- headless Chrome + DevTools protocol에서 single cert classification, mixed bundle classification, mismatch error state, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 cycle 자체는 safe 판정했고 wording은 `label-only PEM triage`, `complete matched blocks`, `known block labels` 기준을 유지해야 한다는 caveat를 확인함

### 결과
- 사용자는 허브 안에서 PEM text를 붙여 넣어 어떤 block이 들어 있는지, bundle이 같은 label인지 mixed인지, malformed boundary issue가 있는지, 그리고 어떤 downstream inspector를 열어야 하는지 바로 판단할 수 있게 됨
- `encoding-security` cluster 앞단에 triage utility가 추가되면서 inspector surface가 더 자연스럽게 연결됨

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`private key inspector`의 더 좁은 범위 MVP 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 17:18

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 PEM/SSH/JWT utility까지 충분히 넓어졌고, 다음 단계로는 JOSE-native key material을 직접 읽는 single JWK inspect utility가 가장 작은 후보였음
- background research와 plan 모두 `private key inspector`보다 `JWK 요약기`가 더 작고 안전하며, existing `jwt-encoder`/`jwt-decoder`/`base64url-encoder` 흐름과 더 자연스럽게 이어진다고 평가했음

### 선택한 작업
JWK 요약기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, single JWK object의 local metadata/thumbprint inspection gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/jwk-tools.ts` 생성, single-object RSA/EC JWK parse + RFC 7638 thumbprint helper 추가
- `src/components/jwk-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
- `app/services/jwk-inspector/page.tsx` 생성
- `src/lib/service-registry.ts`에 `jwk-inspector` 서비스 등록
- `app/services/experiments/page.tsx`에서 `JWK 요약기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `jwk`/`jwks`/`jose`/`thumbprint` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 generated RSA/EC public JWK, public/private same thumbprint, blank input, non-object JSON, JWKS rejection, `oct` rejection, missing member rejection, malformed base64url rejection, unsupported curve rejection 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/jwk-inspector` → 200, 홈/실험실/search HTML에 `/services/jwk-inspector`, `JWK 요약기` 노출 확인
- headless Chrome + DevTools protocol에서 valid RSA flow, valid EC flow, private visibility, JWKS rejection, thumbprint copy, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 RFC 7638 thumbprint path는 safe 판정했고, wording은 `public-members thumbprint`, `visibility is metadata`, `no full private key validation` 기준을 유지해야 한다는 caveat를 확인함

### 결과
- 사용자는 허브 안에서 single RSA/EC JWK JSON object를 붙여 넣어 key metadata와 RFC 7638 SHA-256 thumbprint를 바로 확인하고 복사할 수 있게 됨
- `encoding-security` cluster가 PEM/SSH artifact inspect에서 JOSE-native JWK inspect까지 이어지면서 JWT/JWK workflow coverage가 더 자연스럽게 닫히게 됨

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`private key inspector`의 더 좁은 범위 MVP 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 16:31

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 generator/inspector utility가 충분히 넓어졌고, `jwt-decoder`는 이미 있었지만 compact JWT를 직접 만들어 보는 pair-side utility는 아직 없었음
- background research와 plan/oracle tie-break 모두 `private key inspector`보다 `JWT 인코더`가 더 작고 재사용 가치가 높으며, existing `jwt-decoder`/`hmac-generator`를 자연스럽게 이어 준다고 평가했음

### 선택한 작업
JWT 인코더 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, local compact JWT construction/signing workflow gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/hmac-tools.ts`에 raw signature를 재사용할 수 있는 `generateRawHmac()` helper 추가
- `src/lib/jwt-tools.ts`에 JSON object parse + header.alg injection/guard + HS256/384/512 compact JWT construction helper 추가
- `src/components/jwt-encoder.tsx` 생성, header/payload/secret 입력 + algorithm selector + generate/clear/copy UI 구현
- `app/services/jwt-encoder/page.tsx` 생성
- `src/lib/service-registry.ts`에 `jwt-encoder` 서비스 등록
- `app/services/experiments/page.tsx`에서 `JWT 인코더`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `jwt encoder`/`hs256`/`sign` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 valid HS256/384/512 signing, decoder round-trip, blank secret rejection, non-object header rejection, non-object payload rejection, `header.alg` mismatch rejection, non-string `header.alg` rejection 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/jwt-encoder` → 200, 홈/실험실/search HTML에 `/services/jwt-encoder`, `JWT 인코더` 노출 확인
- headless Chrome + DevTools protocol에서 HS256 generation, HS512 switch, copy success, decoder round-trip, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 HS-only signing path는 safe 판정했고, wording은 `local compact JWT construction/signing`과 `JSON object re-serialization before signing` 기준을 유지해야 한다는 caveat를 확인함

### 결과
- 사용자는 허브 안에서 JSON header/payload와 시크릿을 입력해 HS256/384/512 compact JWT를 로컬에서 생성하고 바로 복사할 수 있게 됨
- `encoding-security` cluster 안에서 `jwt-decoder`와 `jwt-encoder`가 짝을 이루며 local JWT workflow가 더 완결된 형태가 됨

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`private key inspector`의 더 좁은 범위 MVP 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 15:48

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 generator/inspector utility가 충분히 넓어졌고, standard `base64-encoder`는 이미 있지만 JWT-safe URL-safe variant를 다루는 standalone utility는 아직 없었음
- background research와 plan/oracle tie-break 모두 `private key inspector`나 `jwt-encoder`보다 `Base64URL 인코더/디코더`가 더 작고 안전하며, existing `base64-encoder`/`jwt-decoder` 사이의 workflow gap을 자연스럽게 메운다고 평가했음

### 선택한 작업
Base64URL 인코더/디코더 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, JWT-safe URL-safe Base64 text transform gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/base64url-tools.ts` 생성, exact-input Base64URL encode/decode helper와 URL-safe alphabet/padding normalization 추가
- `src/components/base64url-encoder.tsx` 생성, encode/decode/clear/copy UI 구현
- `app/services/base64url-encoder/page.tsx` 생성
- `src/lib/service-registry.ts`에 `base64url-encoder` 서비스 등록
- `app/services/experiments/page.tsx`에서 `Base64URL 인코더/디코더`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `base64url`/`url-safe` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 exact JWT-header encode, exact JWT-header decode, URL-safe decode, padded Base64URL decode, standard Base64 rejection, invalid UTF-8 rejection, blank input rejection, exact-space encoding 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/base64url-encoder` → 200, 홈/실험실/search HTML에 `/services/base64url-encoder`, `Base64URL 인코더/디코더` 노출 확인
- headless Chrome + DevTools protocol에서 exact encode result, exact decode result, padded decode result, invalid decode rejection, copy, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 alphabet/padding path는 safe 판정했고, wording은 `Base64URL -> UTF-8 text` 및 generic invalid decode message 기준을 유지해야 한다는 caveat를 확인함

### 결과
- 사용자는 허브 안에서 UTF-8 텍스트를 Base64URL로 변환하거나, Base64URL 문자열을 다시 UTF-8 텍스트로 되돌리는 URL-safe transform workflow를 바로 사용할 수 있게 됨
- `encoding-security` cluster 안에서 standard Base64와 URL-safe Base64가 분리되면서 JWT-safe text transform coverage가 더 자연스럽게 닫히게 됨

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`private key inspector`의 더 좁은 범위 MVP, `JWT encoder` 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 15:01

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 inspect/generator utility가 이미 충분히 넓어졌고, `sha256-generator` 옆에 대응하는 verify-side utility가 없어 generator/verifier pair가 닫혀 있지 않았음
- Oracle tie-break 기준으로 `private key inspector`나 `jwt-encoder`보다 `SHA-256 검증기`가 더 작고 안전하며, 기존 `hash-tools.ts`를 재사용해 semantics drift 없이 구현할 수 있었음

### 선택한 작업
SHA-256 검증기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 텍스트와 pasted digest를 로컬에서 빠르게 비교하는 digest equality gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/hash-tools.ts`에 expected digest normalization + `verifySha256Digest()` helper 추가
- `src/components/sha256-verifier.tsx` 생성, text/digest 입력 + verify/clear/copy UI 구현
- `app/services/sha256-verifier/page.tsx` 생성
- `src/lib/service-registry.ts`에 `sha256-verifier` 서비스 등록
- `app/services/experiments/page.tsx`에서 `SHA-256 검증기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `verify`/`checksum`/`digest` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 valid match, uppercase digest normalization, valid mismatch, blank text, blank digest, wrong-length digest, non-hex digest, multiline digest rejection 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/sha256-verifier` → 200, 홈/실험실/search HTML에 `/services/sha256-verifier`, `SHA-256 검증기` 노출 확인
- headless Chrome + DevTools protocol에서 match flow, mismatch flow, invalid digest error, computed digest copy, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 generator와 verifier가 같은 trim-normalized path를 쓰는 점은 safe 판정했고, wording은 `local digest equality` 기준을 유지해야 한다는 caveat를 확인함

### 결과
- 사용자는 허브 안에서 trim-normalized 텍스트의 SHA-256을 계산하고 pasted hex digest와 바로 비교해 match/mismatch를 확인할 수 있게 됨
- `encoding-security` cluster 안에서 `sha256-generator`와 `sha256-verifier`가 짝을 이루며 local hash workflow가 더 완결된 형태가 됨

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`private key inspector`의 더 좁은 범위 MVP, `JWT encoder`, `base64url` utility 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 14:02

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 PKI/credential triage utility까지 충분히 넓어졌고, 다음 단계로는 PEM이 아닌 OpenSSH public key format을 바로 읽는 adjacent inspect utility가 가장 작은 후보였음
- background research와 plan/oracle tie-break 모두 `jwt-encoder`보다 `SSH 키 지문 생성기`가 더 작은 read-only utility이며 현재 key-inspection 흐름과 더 자연스럽게 이어진다고 평가했음

### 선택한 작업
SSH 키 지문 생성기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, GitHub/server 등록 전 OpenSSH public key 한 줄의 type과 fingerprint를 로컬에서 빠르게 확인하는 gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/ssh-key-tools.ts` 생성, single-line OpenSSH public key parser + SHA-256 blob fingerprint helper 추가
- `src/components/ssh-key-fingerprint.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
- `app/services/ssh-key-fingerprint/page.tsx` 생성
- `src/lib/service-registry.ts`에 `ssh-key-fingerprint` 서비스 등록
- `app/services/experiments/page.tsx`에서 `SSH 키 지문 생성기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `ssh`/`openssh`/`authorized_keys`/`ed25519`/`ecdsa` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 real `ssh-keygen` fixture 기준 valid ed25519, valid RSA 2048, valid ECDSA nistp256, blank input, multiline rejection, PEM rejection, malformed base64 rejection, SSH certificate rejection, authorized_keys option rejection, unsupported `sk-ssh-*` type rejection 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/ssh-key-fingerprint` → 200, 홈/실험실/search HTML에 `/services/ssh-key-fingerprint`, `SSH 키 지문 생성기` 노출 확인
- headless Chrome + DevTools protocol에서 valid ed25519 flow, valid RSA flow, fingerprint copy, PEM rejection, malformed key rejection, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 parser/fingerprint path는 safe 판정했고, wording은 `OpenSSH public key inspection`과 `SHA-256 blob fingerprint` 기준을 유지해야 한다는 caveat를 확인함

### 결과
- 사용자는 허브 안에서 단일 OpenSSH 공개키 한 줄을 붙여 넣어 key type, key detail, comment, SHA-256 fingerprint를 바로 확인하고 복사할 수 있게 됨
- `encoding-security` cluster가 PEM/PKI artifact coverage를 넘어 OpenSSH public key workflow까지 다루면서 developer key-inspection coverage가 더 넓어짐

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`private key inspector`의 더 좁은 범위 MVP, `JWT encoder` 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 13:10

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 PKI/secret utility가 충분히 두꺼워졌고, 다음 단계로는 private key처럼 더 민감한 material을 다루기보다 자주 복붙하는 one-line key/token 문자열의 provider 후보를 pattern-based로 식별하는 utility가 더 작고 안전한 후보였음
- background research와 plan/oracle tie-break 모두 `API 키 형식 판별기`를 `private key inspector`보다 더 bounded하고 재사용 가치 높은 방향으로 평가했음

### 선택한 작업
API 키 형식 판별기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, developer workflow에서 자주 마주치는 key/token string의 provider/format candidate를 로컬에서 빠르게 식별하는 gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/api-key-format-tools.ts` 생성, bounded detector table + masked preview helper 추가
- `src/components/api-key-format-inspector.tsx` 생성, textarea 입력 + inspect/clear UI와 classification panel 구현
- `app/services/api-key-format-inspector/page.tsx` 생성
- `src/lib/service-registry.ts`에 `api-key-format-inspector` 서비스 등록
- `app/services/experiments/page.tsx`에서 `API 키 형식 판별기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `api key`/`github`/`aws`/`google`/`stripe`/`telegram`/`slack` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 AWS/Google/GitHub/Stripe/Telegram/Slack sample, ambiguous unknown case, blank input, raw CR/LF multiline rejection, short-preview masking 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/api-key-format-inspector` → 200, 홈/실험실/search HTML에 `/services/api-key-format-inspector`, `API 키 형식 판별기` 노출 확인
- headless Chrome + DevTools protocol에서 GitHub detection, Telegram detection, unknown handling, multiline rejection, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 matcher 자체는 safe 판정했고, changelog/summary는 `pattern-based candidate identification` wording을 유지해야 하며 result panel masking 범위를 명확히 써야 한다는 caveat를 확인함

### 결과
- 사용자는 허브 안에서 한 줄짜리 key/token 문자열을 붙여 넣어 known provider/format candidate를 빠르게 식별하고, 지원하지 않거나 애매한 형식은 `unknown`으로 확인할 수 있게 됨
- `encoding-security` cluster가 생성/inspect/PKI utility를 넘어 credential triage utility까지 포함하면서 실제 developer workflow coverage가 더 넓어짐

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`private key inspector`의 더 좁은 범위 MVP, `SSH key fingerprint` 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 12:08

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 인증서/CSR inspect까지 이미 확장됐고, 다음 단계로는 secret material을 직접 받지 않으면서 같은 PKI 흐름에 붙는 read-only public key utility가 가장 작은 후보였음
- `certificate-inspector`와 `csr-inspector`가 이미 공개키 메타데이터를 간접적으로 보여 주지만, standalone `BEGIN PUBLIC KEY` artifact를 바로 읽는 도구는 아직 없었음

### 선택한 작업
공개키 요약기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, PEM 공개키를 빠르게 식별/복사해 보는 inspect gap을 가장 작은 범위로 메울 수 있었고 private key handling ambiguity도 피할 수 있었기 때문

### 변경 내용
- `src/lib/public-key-tools.ts` 생성, 단일 PEM `PUBLIC KEY` gating + SPKI summary + fingerprint helper 추가
- `src/components/public-key-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
- `app/services/public-key-inspector/page.tsx` 생성
- `src/lib/service-registry.ts`에 `public-key-inspector` 서비스 등록
- `app/services/experiments/page.tsx`에서 `공개키 요약기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `public-key`/`spki`/`rsa`/`ec` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 OpenSSL-generated valid RSA public key, valid EC public key, blank input, malformed PEM, certificate rejection, CSR rejection, private key rejection, multi-PEM rejection 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/public-key-inspector` → 200, 홈/실험실/search HTML에 `/services/public-key-inspector`, `공개키 요약기` 노출 확인
- headless Chrome + DevTools protocol에서 valid RSA flow, valid EC curve detail, certificate rejection, private key rejection, fingerprint copy, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 PEM gating, SPKI parsing, fingerprint path는 safe 판정했고, algorithm label과 SPKI byte length wording caveat를 확인함

### 결과
- 사용자는 허브 안에서 단일 PEM `BEGIN PUBLIC KEY`를 붙여 넣어 알고리즘, 키 세부 정보, SPKI byte length, SHA-256 fingerprint를 바로 확인하고 복사할 수 있게 됨
- `encoding-security` cluster가 certificate → CSR → public key inspect 흐름까지 이어지며 PKI artifact coverage가 더 자연스럽게 닫히게 됨

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 utility 후보 재평가 (`API 키 형식 판별기`, `private key inspector`의 더 좁은 범위 MVP 등)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 11:36

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 certificate inspect까지 이미 확장됐고, 다음 단계로는 인증서 바로 앞 단계 artifact인 PKCS#10 CSR을 읽는 adjacent inspect utility가 가장 작은 후보였음
- `인증서 요약기`가 이미 단일 PEM X.509를 요약하므로, `CSR 요약기`는 같은 copy/paste 흐름을 유지하면서도 발급 전 요청 정보(subject/SAN/public key)를 보는 distinct utility 역할을 가짐

### 선택한 작업
CSR 요약기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 개발/운영 중 발급 전 CSR을 빠르게 확인하는 inspect gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/csr-tools.ts` 생성, 단일 PEM CSR gating + PKCS#10 summary + SPKI fingerprint helper 추가
- `src/components/csr-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
- `app/services/csr-inspector/page.tsx` 생성
- `src/lib/service-registry.ts`에 `csr-inspector` 서비스 등록
- `app/services/experiments/page.tsx`에서 `CSR 요약기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `csr`/`certificate-request`/`pkcs10` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 OpenSSL-generated valid CSR, blank input, malformed PEM, certificate PEM rejection, key PEM rejection, multi-CSR rejection 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/csr-inspector` → 200, 홈/실험실/search HTML에 `/services/csr-inspector`, `CSR 요약기` 노출 확인
- headless Chrome + DevTools protocol에서 valid CSR summary, 공개키 fingerprint copy, certificate rejection, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 PEM gating, CSR parsing, SAN extraction, SPKI fingerprint path는 safe 판정했고, requested extension wording과 self-signature status wording caveat를 확인함

### 결과
- 사용자는 허브 안에서 단일 PEM PKCS#10 CSR을 붙여 넣어 subject, SAN, 공개키 메타데이터, self-signature 상태, SHA-256 공개키 fingerprint를 바로 확인하고 복사할 수 있게 됨
- `encoding-security` cluster가 certificate artifact inspect에서 한 단계 더 앞선 CSR inspect까지 다루면서 PKI workflow coverage가 더 자연스럽게 이어짐

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 standalone inspect utility 후보 재평가 (`키 페어 정보 도구`, `API 키 형식 판별기` 같은 adjacent utility)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 11:02

### 관찰
- current repo state 기준으로 `encoding-security` cluster는 generator/inspector utility가 이미 충분히 풍부해졌고, 다음 단계로는 copy/paste한 PEM 인증서를 빠르게 읽는 single-certificate inspect tool이 가장 작은 후보였음
- `JWT 디코더`, `TOTP 코드 해석기`, `HMAC 생성기`가 이미 존재해 inspect/generate 흐름은 넓어졌지만, 실제 TLS/X.509 artifact를 다루는 read-side utility는 아직 없었음

### 선택한 작업
인증서 요약기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 개발/운영 중 자주 복붙하는 PEM 인증서를 로컬에서 빠르게 요약해 보는 inspect gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `package.json`, `pnpm-lock.yaml`에 `@peculiar/x509` 추가
- `src/lib/certificate-tools.ts` 생성, 단일 PEM gating + X.509 summary + DER fingerprint helper 추가
- `src/components/certificate-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
- `app/services/certificate-inspector/page.tsx` 생성
- `src/lib/service-registry.ts`에 `certificate-inspector` 서비스 등록
- `app/services/experiments/page.tsx`에서 `인증서 요약기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `certificate`/`cert`/`x509`/`pem`/`tls`/`ssl`/`fingerprint` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 OpenSSL-generated valid PEM, malformed PEM, CSR PEM rejection, key PEM rejection, multi-cert rejection 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/certificate-inspector` → 200, 홈/실험실/search HTML에 `/services/certificate-inspector`, `인증서 요약기` 노출 확인
- headless Chrome + DevTools protocol에서 valid PEM summary, fingerprint copy, CSR rejection, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 PEM gating과 DER fingerprint path는 safe 판정, signature label은 family-level naming이고 validity 상태는 local browser time 기준이라는 caveat 확인

### 결과
- 사용자는 허브 안에서 단일 PEM X.509 인증서를 붙여 넣어 subject, issuer, serial, validity, SAN, 공개키 메타데이터, SHA-256 fingerprint를 바로 확인하고 복사할 수 있게 됨
- `encoding-security` cluster가 secret/token/auth artifact를 넘어 실제 certificate artifact inspect까지 다루면서 개발/운영 보조 가치가 한 단계 더 넓어짐

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 standalone inspect utility 후보 재평가 (`CSR 요약기`, `키 페어 정보 도구` 같은 adjacent inspect utility)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 10:07

### 관찰
- current repo state 기준으로 discovery surface는 이미 충분했고, `encoding-security` cluster 안에서는 inspect utility를 더 넓히는 방향보다 keyed hash utility를 하나 추가하는 편이 더 작고 즉시 재사용 가치가 높았음
- `sha256-generator`는 unkeyed hash, `secret-generator`는 secret source utility였기 때문에, 정확한 메시지/시크릿 입력으로 HMAC를 생성하는 `HMAC 생성기`는 adjacent utility이면서도 역할이 명확히 달랐음

### 선택한 작업
HMAC 생성기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, webhook/API 서명 테스트처럼 개발자가 바로 다시 쓰게 될 keyed hash gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/hmac-tools.ts` 생성, exact UTF-8 input + Web Crypto HMAC helper 추가
- `src/components/hmac-generator.tsx` 생성, message/secret textarea + algorithm selector + generate/reset/copy UI 구현
- `app/services/hmac-generator/page.tsx` 생성
- `src/lib/service-registry.ts`에 `hmac-generator` 서비스 등록
- `app/services/experiments/page.tsx`에서 `HMAC 생성기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `hmac`/`mac`/`signature` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 SHA-256/384/512 known vector, exact whitespace case, exact Unicode case, blank secret rejection, blank message rejection, invalid algorithm rejection, no-crypto path 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/hmac-generator` → 200, 홈/실험실/search HTML에 `/services/hmac-generator`, `HMAC 생성기` 노출 확인
- headless Chrome + DevTools protocol에서 default digest, SHA-512 switch, exact whitespace digest, copy, reset-to-defaults, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 exact UTF-8 wording과 reset-to-defaults caveat를 확인했고 코드 변경 없이 finalize safe 판정 확인

### 결과
- 사용자는 허브 안에서 메시지와 시크릿의 exact UTF-8 입력으로 HMAC-SHA-256/384/512 hex digest를 바로 생성하고 복사할 수 있게 됨
- `encoding-security` cluster가 inspect/generate utility를 넘어 실제 signature debugging 보조까지 포함하면서 개발 보조 가치가 더 넓어짐

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 standalone utility 후보 재평가 (`인증서/CSR 요약기`, `키 페어 정보 도구` 같은 adjacent inspect utility)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 09:26

### 관찰
- current repo state 기준으로 recent/pinned/family discovery는 이미 충분했고, 다음 단계로는 `encoding-security` cluster에서 실제 secret-bearing input을 해석하는 inspect utility가 가장 작은 후보였음
- `JWT 디코더`는 decode-only token inspect, `시크릿 생성기`는 opaque output generate였기 때문에, `otpauth://totp/...` URI를 해석하고 현재 코드를 계산해 보는 `TOTP 코드 해석기`는 adjacent utility이면서도 역할이 명확히 달랐음

### 선택한 작업
TOTP 코드 해석기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 로컬 인증 설정이나 테스트 중 자주 다시 확인하게 되는 otpauth/TOTP inspect gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/totp-tools.ts` 생성, TOTP URI parser + Base32 decoder + Web Crypto HMAC 기반 code generator 추가
- `src/components/totp-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 metadata/code panel 구현
- `app/services/totp-inspector/page.tsx` 생성
- `src/lib/service-registry.ts`에 `totp-inspector` 서비스 등록
- `app/services/experiments/page.tsx`에서 `TOTP 코드 해석기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 `totp`/`otp`/`otpauth` 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 valid parse, HOTP rejection, invalid base32 rejection, invalid base32 length rejection, RFC 6238 SHA1/SHA256/SHA512 vector, no-crypto path 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/totp-inspector` → 200, 홈/실험실/search HTML에 `/services/totp-inspector`, `TOTP 코드 해석기` 노출 확인
- 초기 headless Chrome + DevTools protocol browser verification에서 valid TOTP flow, copy, HOTP rejection, clear reset, 모바일 표시 확인
- Oracle post-review에서 Base32 strictness edge를 지적했고, malformed secret 길이와 leftover-bit 검증을 helper에 추가한 뒤 helper/build/route 검증 재통과 확인

### 결과
- 사용자는 허브 안에서 `otpauth://totp/...` URI를 붙여 넣어 issuer/account/algorithm/digits/period를 확인하고 현재 TOTP 코드를 바로 계산/복사할 수 있게 됨
- `encoding-security` cluster가 opaque secret generation뿐 아니라 auth setup inspect까지 다루기 시작하면서 실제 보안/인증 보조 가치가 한 단계 더 넓어짐

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 standalone utility 후보 재평가 (`키 페어 정보 도구`, `인증서/CSR 요약기` 같은 adjacent inspect utility)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 08:29

### 관찰
- current repo state 기준으로 home/search discovery는 이미 충분히 두꺼웠고, 다음 단계로는 `encoding-security` cluster를 한 칸 더 넓히는 standalone utility가 가장 작은 후보였음
- `password-generator`는 human-facing secret, `ULID/UUID`는 identifier에 가까웠기 때문에, `.env`/앱 설정용 opaque secret을 바로 생성하는 `시크릿 생성기`는 adjacent utility이면서도 역할이 명확히 분리됐음

### 선택한 작업
시크릿 생성기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 개발 설정/테스트 환경에서 바로 다시 쓰게 될 machine-secret utility gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/secret-generator-tools.ts` 생성, bounded byte-length validation + deterministic `hex`/`base64url`/`base64` helper 추가
- `src/components/secret-generator.tsx` 생성, byte length/form selector + generate/clear/copy UI 구현
- `app/services/secret-generator/page.tsx` 생성
- `src/lib/service-registry.ts`에 `secret-generator` 서비스 등록
- `app/services/experiments/page.tsx`에서 `시크릿 생성기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 secret/token/key 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 deterministic `hex`, `base64url`, `base64` 출력, blank/non-integer/out-of-range 길이 오류, injected byte-length mismatch, invalid format rejection, no-crypto path 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/secret-generator` → 200, 홈/실험실/search HTML에 `/services/secret-generator`, `시크릿 생성기` 노출 확인
- headless Chrome + DevTools protocol에서 default generate, format switching, invalid length error, copy 성공, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 runtime format guard와 wording caveat를 지적했고, helper에 explicit format rejection을 추가하고 wording을 `출력 형식` 기준으로 정리한 뒤 helper/build 검증 재통과 확인

### 결과
- 사용자는 허브 안에서 앱 설정용 opaque secret을 원하는 출력 형식으로 바로 생성하고 복사할 수 있게 됨
- `encoding-security` cluster가 password/hash/jwt/uuid/ulid에 이어 machine-secret utility까지 포함하면서 실제 개발 설정 보조 가치가 더 커짐

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 standalone utility 후보 재평가 (`OTP/TOTP 코드 해석기`, `키 페어 정보 도구` 같은 adjacent local utility)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 07:43

### 관찰
- current repo state 기준으로 recent/pinned/family discovery는 이미 충분했고, adjacent next-step utility로는 `encoding-security` cluster를 잇는 식별자 도구가 가장 작은 다음 후보였음
- `UUID 생성기`는 이미 있었지만, 시간 정렬 가능한 identifier를 바로 생성하는 `ULID 생성기`는 아직 registry에 없었고, dependency 없이 browser crypto만으로 구현 가능해 scope를 매우 좁게 유지할 수 있었음

### 선택한 작업
ULID 생성기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, password/uuid/jwt/hash 옆에 바로 붙는 adjacent security utility gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/ulid-tools.ts` 생성, dependency-free ULID helper + deterministic validation path 추가
- `src/components/ulid-generator.tsx` 생성, generate/clear/copy UI와 timestamp metadata 패널 구현
- `app/services/ulid-generator/page.tsx` 생성
- `src/lib/service-registry.ts`에 `ulid-generator` 서비스 등록
- `app/services/experiments/page.tsx`에서 `ULID 생성기`를 `승격 완료`와 실제 링크로 반영
- `src/lib/search-discovery.ts`의 `encoding-security` family 설명/query에 ULID 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments/search-discovery 모두 오류 없음
- helper-level verification에서 zero ULID, valid generated ULID, invalid leading char rejection, bad timestamp, bad random byte length, no-crypto path 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/ulid-generator` → 200, 홈/실험실/search HTML에 `/services/ulid-generator`, `ULID 생성기` 노출 확인
- headless Chrome + DevTools protocol에서 generate, copy, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인
- Oracle post-review에서 `isUlid` leading-character edge를 지적했고, spec-safe regex로 보정 후 helper/build 검증 재통과 확인

### 결과
- 사용자는 허브 안에서 시간 정렬 가능한 ULID를 바로 생성하고 복사할 수 있게 됨
- `encoding-security` cluster가 password/hash/jwt/uuid에서 한 단계 더 넓어지며, identifier utility coverage가 더 실용적인 형태가 됨

### 다음 작업 후보
1. `encoding-security` cluster를 잇는 다음 standalone utility 후보 재평가 (`토큰/시크릿 생성기` 같은 adjacent local utility)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 06:58

### 관찰
- current repo state 기준으로 parser/builder/converter cluster와 discovery layer는 이미 충분히 넓어져 있었고, experiments backlog도 사실상 비어 있어 다음 단계로는 바로 이해되고 자주 다시 쓰게 될 standalone utility 하나가 더 적합했음
- `비밀번호 생성기`는 아직 registry에 없으면서도 local-only/browser-only로 안전하게 닫히고, 기존 `SHA-256 생성기`, `UUID 생성기`, `JWT 디코더`와 같은 encoding/security cluster 옆에 자연스럽게 붙는 작은 utility였음

### 선택한 작업
비밀번호 생성기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 개발/운영/일상 계정 생성 흐름에서 바로 다시 쓰게 될 가능성이 높은 security utility gap을 가장 작은 범위로 메울 수 있었기 때문

### 변경 내용
- `src/lib/password-generator-tools.ts` 생성, bounded length validation + selected character group guarantee + browser crypto helper 추가
- `src/components/password-generator.tsx` 생성, 길이 입력 + 문자 그룹 체크박스 + generate/clear/copy UI 구현
- `app/services/password-generator/page.tsx` 생성
- `src/lib/service-registry.ts`에 `password-generator` 서비스 등록
- `app/services/experiments/page.tsx`에서 `비밀번호 생성기`를 `승격 완료`와 실제 링크로 반영
- `app/globals.css`에 password option card 스타일 추가

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments 모두 오류 없음
- `app/globals.css`는 biome 미설치로 diagnostics unavailable이지만 `pnpm lint`와 `pnpm build`는 통과
- helper-level verification에서 `12자 소문자 only`, `16자 대/소문자+숫자`, `20자 전체 그룹`, `7자 오류`, `65자 오류`, `문자 그룹 미선택 오류` 확인
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/password-generator` → 200, 홈/실험실/search HTML에 `/services/password-generator`, `비밀번호 생성기` 노출 확인
- headless Chrome + DevTools protocol에서 default generate 성공, no-group validation error, 20자 generation, copy 성공, clear reset, 모바일 표시 확인
- browser verification 기준 runtime exception 및 captured browser error 없음 확인

### 결과
- 사용자는 허브 안에서 길이와 문자 종류를 선택해 비밀번호를 바로 생성하고 복사할 수 있게 됨
- text/data utility 중심의 허브에 small security utility 하나가 더 추가되면서, local-only productivity surface가 조금 더 넓어짐

### 다음 작업 후보
1. 기존 보안/인코딩 cluster를 잇는 다음 standalone utility 후보 재평가 (`ULID 생성기`, `토큰/시크릿 생성기` 같은 adjacent local utility)
2. search/home discovery surface에서 family나 pin 기반 재정렬 보강 검토
3. 결과형 도구 중 remaining polish 후보 재점검

## 2026-03-12 05:13

### 관찰
- current repo state 기준으로 parser/builder/converter cluster와 discovery layer는 이미 충분히 넓어져 있었고, 다음 단계로는 반복 사용 가치가 높은 작은 productivity service 하나를 추가하는 편이 더 적합했음
- `포모도로 타이머`는 experiments에 오래 남아 있던 유일한 보류 서비스였고, 현재 단계에서 narrow local MVP로 구현하면 허브 방향성과도 맞고 scope도 충분히 통제 가능했음

### 선택한 작업
포모도로 타이머 신규 서비스 추가

### 이유
새로운 standalone utility를 또 추가하기보다, 현재 허브에 부족한 local productivity behavior 하나를 채우는 편이 더 균형 잡힌 다음 단계였고, existing experiments backlog에서 가장 명확한 후보가 포모도로 타이머였기 때문

### 변경 내용
- `src/lib/pomodoro-timer-tools.ts` 생성, bounded minute validation/formatting/phase transition helper 추가
- `src/components/pomodoro-timer.tsx` 생성, focus/break input + start/pause/reset/skip UI와 countdown 구현
- `app/services/pomodoro-timer/page.tsx` 생성
- `src/lib/service-registry.ts`에 `pomodoro-timer` 서비스 등록
- `app/services/experiments/page.tsx`에서 `포모도로 타이머`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments 모두 오류 없음
- helper-level verification에서 `25:00` formatting, invalid minute rejection, focus→break, break→focus transition 성공
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/pomodoro-timer` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/pomodoro-timer`, `포모도로 타이머` 노출 확인
- headless Chrome + DevTools protocol에서 1분 focus/1분 break 기준 countdown 감소, pause freeze, skip to break, reset to focus, invalid minute error, 모바일 표시 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 로컬 focus/break 타이머를 바로 사용할 수 있게 됨
- experiments에 오래 남아 있던 Pomodoro idea가 실제 서비스로 승격되면서, 허브가 text/data utility 중심에서 한 단계 더 넓은 productivity surface를 갖게 됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`duration humanizer`, `QR code generator` 등 current repo state의 fresh gap 재평가)
2. grouped/favorites 류 discovery surface를 더 확장하는 상위 계층 검토
3. remaining result-tool polish 후보 재평가

## 2026-03-12 04:20

### 관찰
- current repo state 기준으로는 `query-string-parser`, `query-string-builder`, `url-builder`는 이미 있었지만, 사용자가 붙여 넣은 full URL을 read-side로 해석해서 보여 주는 역방향 parser는 아직 없었음
- 새 standalone utility를 더 추가하는 것보다, 이미 존재하는 URL/query workflow cluster를 닫는 `URL 파서`가 더 작고 hub-connected 한 다음 단계였음

### 선택한 작업
URL 파서 신규 서비스 추가

### 이유
raw query parser/builder와 full URL builder 사이의 read-side gap을 메우면 기존 URL workflow cluster가 한 단계 더 완성되고, 이는 AGENTS.md의 small/useful/reversible/hub-connected 기준에 가장 잘 맞았기 때문

### 변경 내용
- `src/lib/url-parser-tools.ts` 생성, absolute URL parser helper 추가
- `src/components/url-parser.tsx` 생성, parse/clear/copy UI와 origin/path/hash/query rows 렌더링 구현
- `app/services/url-parser/page.tsx` 생성
- `src/lib/service-registry.ts`에 `url-parser` 서비스 등록
- `app/services/experiments/page.tsx`에서 `URL 파서`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/url-parser` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/url-parser`, `URL 파서` 노출 확인
- headless Chrome + DevTools protocol에서 valid URL parse 성공, zero-query URL 성공, invalid absolute URL 오류, invalid percent-decoding 오류, copy 성공, clear reset, 모바일 표시 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 absolute URL을 붙여 넣어 구조화된 URL parts와 normalized URL을 바로 확인하고 복사할 수 있게 됨
- 기존 query parser/builder + URL builder cluster가 `read full URL`까지 포함하면서 URL workflow utility set이 더 완성된 형태가 됨

### 다음 작업 후보
1. 다음 standalone deterministic utility 후보 추가 (`duration humanizer`, `QR code generator`처럼 이미 있는 후보가 아닌 fresh utility 재검토)
2. grouped/favorites 류 discovery surface 고도화 검토
3. remaining result-tool polish 후보 재평가

## 2026-03-12 03:37

### 관찰
- current repo state 기준으로 recent/pinned discovery layer는 이미 충분히 작동하고 있었지만, 실제 도구 수가 늘어나면서 category/tag만으로는 `productivity` 내부를 다시 찾기 어려워지는 문제가 더 두드러졌음
- 새로운 standalone utility를 더하는 것보다, 이미 있는 수십 개 도구를 semantic family 관점으로 다시 찾게 만드는 편이 현재 단계에서 전체 허브 가치에 더 직접적인 영향을 줬음

### 선택한 작업
home/search semantic tool family discovery layer 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, category-level discovery의 포화 문제를 가장 작은 범위로 완화하고 현재 허브 전체의 탐색 효율을 높일 수 있었기 때문

### 변경 내용
- `src/types/service.ts`에 primary `family` 필드 추가
- `src/lib/service-registry.ts`의 모든 서비스에 single family metadata 부여
- `src/lib/search-discovery.ts`에 family definitions와 `getFamilySummaries()` 추가
- `src/lib/home-discovery.ts`에 `getHomeFamilyBundles()` 추가
- `app/page.tsx`에 `도구 묶음으로 찾기` 섹션 추가
- `app/services/search/page.tsx`에 `도구 묶음으로 둘러보기` 섹션 추가
- `app/globals.css`에서 home family section spacing을 existing guided section flow에 통합

### 검증 결과
- `lsp_diagnostics` 기준 types/registry/discovery/home/search 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- 홈 HTML에 `도구 묶음으로 찾기`, 검색 HTML에 `도구 묶음으로 둘러보기` 확인
- headless Chrome + DevTools protocol에서 home family cards 4개(`텍스트 정리 · 생성`, `구조화 데이터`, `인코딩 · 보안`, `허브 운영`) visible, search family cards 12개 visible, family link 클릭 시 family query로 재검색 확인, 모바일 폭 390 기준 home family section/card visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 category보다 더 실제 작업 맥락에 가까운 semantic family 기준으로 관련 도구를 다시 찾을 수 있게 됨
- standalone utility 하나를 더 추가하지 않고도, 이미 쌓인 dozens of tools 전체의 재탐색 비용을 낮추는 discovery quality 개선이 반영됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`duration humanizer`, `QR code generator` 같은 standalone utility gap 재검토)
2. grouped/favorites 류 discovery surface를 더 확장하는 상위 계층 검토
3. remaining result-tool polish 후보 재평가

## 2026-03-12 01:42

### 관찰
- current repo state 기준으로 recent/pinned discovery layer는 이미 충분히 갖춰져 있었고, 그 다음으로는 바로 이해되고 다시 쓰기 쉬운 standalone utility 하나를 더하는 편이 더 적합했음
- 여러 standalone 후보 중 Lorem Ipsum 생성기는 dependency 없이 구현 가능하고, paragraph/sentence/word 단위만으로도 디자인/문서/프론트엔드 작업에서 반복 사용 가치가 높았음

### 선택한 작업
Lorem Ipsum 생성기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 현재 허브에 없는 명확한 placeholder-text gap을 메우는 작은 standalone utility였기 때문

### 변경 내용
- `src/lib/lorem-ipsum-tools.ts` 생성, fixed internal corpus 기반 deterministic helper 추가
- `src/components/lorem-ipsum-generator.tsx` 생성, mode selector/count input/generate/clear/copy UI 구현
- `app/services/lorem-ipsum-generator/page.tsx` 생성
- `src/lib/service-registry.ts`에 `lorem-ipsum-generator` 서비스 등록
- `app/services/experiments/page.tsx`에서 `Lorem Ipsum 생성기`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/lorem-ipsum-generator` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/lorem-ipsum-generator`, `Lorem Ipsum 생성기` 노출 확인
- headless Chrome + DevTools protocol에서 paragraphs 2개 생성 성공, sentences 3개 생성 성공, words 5개 생성 성공, copy 성공, invalid count 오류, clear reset, mobile 표시 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 paragraph/sentence/word 단위 placeholder text를 로컬에서 바로 생성하고 복사할 수 있게 됨
- parser/builder/converter 중심 utility cluster 옆에 가볍고 바로 쓰기 쉬운 standalone text utility가 하나 더 추가되면서, 허브의 실용 범위가 더 다양해짐

### 다음 작업 후보
1. 다음 standalone deterministic utility 후보 추가 (`duration humanizer`, `QR code generator` 등 current repo state에서 아직 없는 후보 재평가)
2. grouped/favorites 류 discovery surface 고도화 검토
3. remaining result-tool polish 후보 재평가

## 2026-03-12 01:10

### 관찰
- current repo state 기준으로 parser/builder/converter cluster와 discovery layer는 이미 충분히 넓어져 있었고, 그 다음으로는 바로 이해되고 다시 쓰기 쉬운 standalone utility 하나가 더 적합했음
- 여러 후보 중 `QR 코드 생성기`는 dependency surface가 아주 작고, URL/텍스트/와이파이 문자열 같은 실사용 payload를 바로 시각화할 수 있어 체감 가치가 높았음

### 선택한 작업
QR 코드 생성기 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, 현재 허브에 없는 명확한 standalone utility gap을 메우고 실제 재사용 가치가 높은 도구였기 때문

### 변경 내용
- `package.json`에 `qrcode`, `@types/qrcode` 추가
- `src/lib/qr-code-tools.ts` 생성, bounded text payload 기반 QR helper 추가
- `src/components/qr-code-generator.tsx` 생성, generate/clear/copy/download UI 구현
- `app/services/qr-code-generator/page.tsx` 생성
- `src/lib/service-registry.ts`에 `qr-code-generator` 서비스 등록
- `app/services/experiments/page.tsx`에서 `QR 코드 생성기`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/qr-code-generator` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/qr-code-generator`, `QR 코드 생성기` 노출 확인
- headless Chrome + DevTools protocol에서 기본 URL payload QR 생성 성공, 원문 copy 성공, 512자 초과 오류, stale copy reset, clear reset, 모바일 이미지 표시 확인
- `next/image` unoptimized preview로 lint warning 없이 clean build 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 텍스트를 QR 코드 이미지로 바로 생성하고, 원문을 복사하거나 PNG를 다운로드할 수 있게 됨
- parser/builder/converter 위주의 utility cluster 옆에 시각 출력형 standalone utility 하나가 추가되면서 허브의 실사용 범위가 더 다양해짐

### 다음 작업 후보
1. 다음 deterministic standalone utility 후보 추가 (`duration humanizer`, `lorem ipsum generator` 등)
2. 검색/홈 discovery surface를 더 확장하는 grouped/favorites 류 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-12 00:31

### 관찰
- current repo state에는 timestamp/cron 관련 시간 도구는 이미 충분했지만, 숫자 duration 자체를 compact하게 읽기 쉬운 문자열로 바꾸는 전용 utility는 아직 없었음
- QR code generator나 다른 standalone utility도 후보였지만, 현재 허브의 시간 관련 utility cluster를 가장 작은 범위로 확장하는 다음 단계는 `지속 시간 휴머나이저`가 더 적합했음

### 선택한 작업
지속 시간 휴머나이저 신규 서비스 추가

### 이유
AGENTS.md의 small/useful/reversible/hub-connected 기준을 만족하면서, timestamp/cron utilities 옆에 바로 놓일 수 있는 명확한 시간 표현 gap을 메우는 작은 신규 서비스였기 때문

### 변경 내용
- `src/lib/duration-humanizer-tools.ts` 생성, numeric duration + unit 기반 deterministic helper 추가
- `src/components/duration-humanizer.tsx` 생성, input/unit selector/convert/clear/copy UI 구현
- `app/services/duration-humanizer/page.tsx` 생성
- `src/lib/service-registry.ts`에 `duration-humanizer` 서비스 등록
- `app/services/experiments/page.tsx`에서 `지속 시간 휴머나이저`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/duration-humanizer` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/duration-humanizer`, `지속 시간 휴머나이저` 노출 확인
- headless Chrome + DevTools protocol에서 `93784 seconds → 1d 2h 3m 4s`, `1500 milliseconds → 1s 500ms`, `1.5 hours → 1h 30m`, `0 milliseconds → 0ms`, copy 성공, stale copy reset, blank/negative/invalid 오류, clear reset, 모바일 표시 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 숫자 duration과 단위를 compact human-readable string으로 바로 바꾸고 곧바로 복사할 수 있게 됨
- timestamp/cron 도구 곁에 작은 duration utility가 추가되면서, 시간 관련 utility cluster가 한 단계 더 완성됨

### 다음 작업 후보
1. 다음 deterministic utility 후보 추가 (`QR code generator`, `duration` 이후 다른 standalone utility, grouped discovery 보강 등)
2. 검색/홈 discovery surface를 더 확장하는 grouped/favorites 류 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 18:05

### 관찰
- current repo state 기준으로 structured-text utility cluster는 JSON/YAML/TOML까지는 이미 잘 채워져 있었지만, XML은 아직 비어 있었고 이 공백이 실제 다음 확장 지점으로 가장 자연스럽게 보였음
- standalone utility 후보로 QR code generator, duration humanizer 같은 것도 있었지만, 지금 시점에는 기존 converter/formatter cluster를 이어 확장하는 편이 더 작고 hub-connected 하면서도 체감 가치가 높았음

### 선택한 작업
XML 포맷터/검증기 신규 서비스 추가

### 이유
AGENTS.md가 요구하는 small/useful/reversible/hub-connected 기준을 만족하면서, 현재 허브의 structured-text tool family에서 가장 명확한 gap을 메우는 서비스였기 때문

### 변경 내용
- `src/lib/xml-tools.ts` 생성, well-formed validation + pretty-print helper 추가
- `src/components/xml-formatter.tsx` 생성, format/validate/clear/copy UI 구현
- `app/services/xml-formatter/page.tsx` 생성
- `src/lib/service-registry.ts`에 `xml-formatter` 서비스 등록
- `app/services/experiments/page.tsx`에서 `XML 포맷터/검증기`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page/registry/experiments 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/xml-formatter` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/xml-formatter`, `XML 포맷터/검증기` 노출 확인
- headless Chrome + DevTools protocol에서 valid XML pretty-print 결과 `<root> ... </root>` 성공, invalid XML error panel 성공, copy 성공, clear reset, mobile 표시 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 XML 문자열을 로컬에서 바로 검증하고 포맷한 뒤 결과를 곧바로 복사할 수 있게 됨
- JSON/YAML/TOML에 이어 XML까지 커버되면서, structured-text parser/formatter cluster가 더 완성된 형태에 가까워짐

### 다음 작업 후보
1. 다음 deterministic utility 후보 추가 (`duration humanizer`, `QR code generator` 등 standalone utility 재검토)
2. 검색/홈 discovery surface를 더 확장하는 grouped/favorites 류 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 16:53

### 관찰
- 최근 사용한 서비스가 time-based discovery를 채워 주긴 했지만, 사용자가 의도적으로 오래 유지하고 싶은 도구를 홈 상단에 고정하는 durable discovery layer는 아직 없었음
- generic `[slug]` page에만 pin을 넣는 방식으로는 dedicated service pages에서 버튼이 보이지 않는다는 점이 실제 검증 과정에서 드러났고, 이를 route-agnostic layout-mounted pin control로 바꾸는 것이 가장 안전한 해결책이었음

### 선택한 작업
서비스 pinning과 홈의 고정한 서비스 섹션 추가

### 이유
새로운 standalone utility 하나를 더 추가하기보다, 이미 충분히 많은 도구가 쌓인 허브에서 사용자가 자주 쓰는 실서비스를 durable 하게 다시 찾을 수 있게 만드는 편이 현재 단계의 체감 가치가 더 컸기 때문

### 변경 내용
- `src/lib/pinned-services.ts` 생성, pinned slug parse/toggle/resolve helper 추가
- `src/components/pin-service-button.tsx` 생성, localStorage 기반 pin/unpin toggle 구현
- `src/components/pinned-services.tsx` 생성, 홈 `고정한 서비스` 섹션 구현
- `src/components/service-page-pin-control.tsx` 생성, 실제 service routes 공통 pin control 구현
- `app/layout.tsx`에 pin control mount 추가
- `app/services/[slug]/page.tsx`에서 generic-only pin mount 제거
- `app/page.tsx`에 pinned services 섹션 추가
- `app/globals.css`에 pinned section/button 스타일 추가

### 검증 결과
- `lsp_diagnostics` 기준 새 helper/components와 `app/layout.tsx`, `app/page.tsx`, `app/services/[slug]/page.tsx` 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/`, `http://localhost:80/services/url-builder` → 200 확인
- headless Chrome + DevTools protocol에서 `/services/url-builder`에 `홈에 고정` 노출, pin 후 localStorage `["url-builder"]` 저장, home `고정한 서비스` 섹션에 `URL 빌더` 카드 노출, `/services/search`에는 pin button 미노출, unpin 후 storage `[]` 복구 확인
- 모바일 폭 390 기준 pinned section/card visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 실제 서비스 상세 화면에서 자주 쓰는 도구를 pin/unpin 하고, 홈 상단에서 durable 하게 다시 열 수 있게 됨
- 최근 사용한 서비스와 함께 time-based + intent-based discovery 층이 모두 생기면서, 이미 큰 허브 전체의 재탐색 비용이 줄어듦

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`XML formatter`, `duration humanizer`, `QR code generator` 등)
2. search/home discovery를 더 확장하는 favorites sorting / grouped pinning 류 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 15:51

### 관찰
- 현재 허브는 quick start / recent updates / search / full grid까지 이미 충분히 갖추고 있지만, 사용자가 실제로 방금 열었던 서비스로 빠르게 돌아가는 time-based discovery는 아직 없었음
- 서비스 수가 충분히 누적된 시점이라 또 하나의 작은 utility를 더하는 것보다, 이미 존재하는 도구 재방문 마찰을 줄이는 편이 더 높은 체감 가치를 만들 수 있는 상황이었음

### 선택한 작업
홈 화면에 최근 사용한 서비스 섹션 추가

### 이유
AGENTS.md 기준으로 small/useful/reversible/hub-connected 개선을 고르면, 최근 사용 추적은 로컬만으로 완결되고 기존 40+ 서비스 전체의 재사용성을 함께 높이기 때문에 현재 단계에서 가장 효율적인 허브 표면 보강이었기 때문

### 변경 내용
- `src/lib/recent-services.ts` 생성, recent slug parsing/dedupe/limit/filter helper 추가
- `src/components/recent-service-tracker.tsx` 생성, 실제 `/services/*` 방문을 localStorage에 기록하는 tracker 구현
- `src/components/recently-used-services.tsx` 생성, 홈에서 recent cards를 렌더링하는 client section 구현
- `app/layout.tsx`에 tracker mount 추가
- `app/page.tsx`에 `최근 사용한 서비스` 섹션 추가
- `app/globals.css`에 home recent section spacing 보강

### 검증 결과
- `lsp_diagnostics` 기준 새 helper/components와 `app/layout.tsx`, `app/page.tsx` 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/` → 200 및 기존 홈 섹션 유지 확인
- headless Chrome + DevTools protocol에서 `/services/url-builder`, `/services/number-formatter`, `/services/search`, `/services/query-string-parser` 방문 후 localStorage가 `["query-string-parser","number-formatter","url-builder"]`로 저장되고 home에 같은 순서의 cards가 표시됨 확인
- 같은 검증에서 `search`, `release-log`, `hub-intro`, `experiments` 같은 meta surface는 recent list에서 제외됨 확인
- 모바일 폭 390 기준 section/card visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 실제로 최근 사용한 서비스들로 바로 돌아갈 수 있게 되어, 이미 추가된 도구들의 재방문 마찰이 줄어듦
- 또 하나의 standalone utility를 늘리지 않고도, 현재 허브 전체의 실제 사용 흐름을 더 매끄럽게 만드는 작은 behavior-based discovery가 추가됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`XML formatter`, `duration humanizer`, `QR code generator` 등)
2. 검색/홈 discovery를 더 확장하는 favorites/pinning 류 후보 재검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 15:15

### 관찰
- current repo state 기준으로는 `쿼리 문자열 파서/빌더`가 raw query 수준까지만 다루고 있어 full URL composition workflow가 아직 허브 안에서 끊겨 있었음
- 같은 cycle에서 QR code generator, lorem ipsum 같은 standalone utility 후보도 있었지만, 지금 상태에서는 이미 존재하는 query tool cluster를 완성하는 `URL 빌더`가 더 작고 hub-connected 한 다음 단계였음

### 선택한 작업
URL 빌더 신규 서비스 추가

### 이유
base URL + path + query + hash를 한 번에 조합하는 작은 도구는 query parser/builder와 자연스럽게 이어지고, 이는 AGENTS.md가 요구하는 small/useful/reversible/hub-connected 개선 기준에 가장 잘 맞았기 때문

### 변경 내용
- `src/lib/url-builder-tools.ts` 생성, full URL composition helper 추가
- `src/components/url-builder.tsx` 생성, URL 입력 + query row 편집 + build/clear/copy UI 구현
- `app/services/url-builder/page.tsx` 생성
- `src/lib/service-registry.ts`에 `url-builder` 서비스 등록
- `app/services/experiments/page.tsx`에서 `URL 빌더`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/url-builder` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/url-builder`, `URL 빌더` 노출 확인
- headless Chrome + DevTools protocol에서 canonical full URL `https://example.com/docs?page=1&sort=updated_at&tag=hub#details` 성공, copy 성공, invalid base URL 오류, blank key 오류, clear reset, mobile 표시 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 raw query string뿐 아니라 full URL까지 한 번에 조합하고 바로 복사할 수 있게 됨
- 기존 query parser/builder cluster가 full URL composition까지 확장되면서, 하나의 workflow cluster가 더 완성된 상태가 됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`XML formatter`, `duration humanizer`, `QR code generator` 등)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 14:38

### 관찰
- 현재 `텍스트 비교 도구`는 exact compare와 첫 차이 위치는 잘 보여 주지만, 실제로 어떤 줄이 추가/삭제/변경됐는지는 읽기 어려웠고, 이는 최근 여러 차례 후보로 남아 있던 `diff-friendly formatter` 성격의 공백과 직접 연결되어 있었음
- 완전히 새로운 diff 전용 서비스를 추가하는 대신 기존 `text-diff-checker`를 line-based readable diff까지 보여 주는 방향으로 보강하면, 범위를 작게 유지하면서도 체감 가치를 가장 직접적으로 만들 수 있었음

### 선택한 작업
텍스트 비교 도구 line-based readable diff 보강

### 이유
새로운 독립 서비스보다 더 작은 변경으로 기존 비교 도구를 실제로 더 읽기 쉬운 도구로 만들 수 있었고, 최근 deterministic utility 확장 흐름 다음에 가장 자연스럽게 채워야 할 gap이 바로 readable diff output이었기 때문

### 변경 내용
- `src/lib/text-diff-tools.ts`에 line-based diff row model 추가
- `src/components/text-diff-checker.tsx`에 same/changed/added/removed 상태별 diff row 렌더링 추가
- `app/services/text-diff-checker/page.tsx` 안내를 readable diff 기준으로 갱신
- `app/globals.css`에 diff row/card/grid 스타일 추가

### 검증 결과
- `lsp_diagnostics` 기준 helper/component/page 파일 모두 오류 없음
- CSS는 biome LSP 미설치로 diagnostics unavailable이지만 `pnpm lint`와 `pnpm build`는 통과
- `http://localhost:80/services/text-diff-checker` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 different fixture 기준 `line 2, column 4`, changed row 1건, same fixture 기준 same rows 3건, 빈 입력 오류, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 diff row visible, columns stacked 확인
- 최종 clean browser rerun 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 두 텍스트가 같은지 여부뿐 아니라 어떤 줄이 추가/삭제/변경됐는지를 바로 읽을 수 있게 됨
- 기존 `text-diff-checker`가 “요약만 주는 도구”에서 “실제로 비교 내용을 읽을 수 있는 도구”로 한 단계 올라가면서, 신규 utility 추가 없이도 개발 보조 가치가 크게 높아짐

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`diff-friendly formatter`를 더 넓히는 대신 QR code generator, duration humanizer, XML formatter 등 재검토)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 14:14

### 관찰
- `크론 빌더`까지 추가한 직후에는 완전히 다른 utility로 넘어가기보다, 이미 존재하는 `쿼리 문자열 파서`를 실제로 다시 쓰게 만드는 역방향 도구를 붙이는 편이 더 작은 다음 단계였음
- query string은 duplicate key, empty value, row order 같은 semantics가 중요하므로, 이번 builder는 parser와 round-trip 완전 동기화까지 욕심내지 않고 deterministic raw query output 생성에만 집중하는 편이 가장 안전했음

### 선택한 작업
쿼리 문자열 빌더 신규 서비스 추가

### 이유
parser + builder 쌍을 맞추면 허브 안에서 query string을 해석하는 흐름과 생성하는 흐름이 함께 완성되고, 이는 AGENTS.md가 요구하는 작은 신규 서비스 확장과 반복 사용 가치 측면에서 가장 적합한 다음 단계였기 때문

### 변경 내용
- `src/lib/query-string-builder-tools.ts` 생성, ordered rows 기반 helper 추가
- `src/components/query-string-builder.tsx` 생성, row-based 입력/행 추가/행 삭제/build/clear/copy UI 구현
- `app/services/query-string-builder/page.tsx` 생성
- `src/lib/service-registry.ts`에 `query-string-builder` 서비스 등록
- `app/services/experiments/page.tsx`에서 `쿼리 문자열 빌더`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/query-string-builder` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/query-string-builder`, `쿼리 문자열 빌더` 노출 확인
- headless Chrome + DevTools protocol에서 canonical output `page=1&sort=updated_at&tag=hub&tag=local&empty=` 성공, copy 성공, blank key 오류, stale copy reset, clear reset, 모바일 표시 확인
- helper-level verification에서 multiline rejection과 canonical output(`?page=1&sort=updated_at&tag=hub&tag=local&empty=` preview 포함) 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 ordered key/value rows를 deterministic query string으로 바로 생성하고 곧바로 복사할 수 있게 됨
- 기존 `쿼리 문자열 파서`와 짝을 이루는 builder가 생기면서, query string 해석과 생성 흐름이 허브 안에서 하나의 작은 utility cluster로 완성됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`diff-friendly formatter`, `ENV builder` 고도화가 아닌 다른 parser/builder pair 등)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 13:33

### 관찰
- `ENV 빌더`까지 추가한 직후에는 완전히 다른 utility로 넘어가기보다, 같은 parser→builder pairing 패턴을 `크론 표현식 파서`에도 이어 적용하는 편이 더 작은 다음 단계였음
- `크론 빌더`는 parser가 이미 strict subset validation과 explanation을 가지고 있었기 때문에, builder는 4개의 자주 쓰는 모드만 제공하고 parser를 재사용해 결과를 검증하는 구조가 가장 안전했음

### 선택한 작업
크론 빌더 신규 서비스 추가

### 이유
parser + builder 쌍을 맞추면 허브 안에서 스케줄 표현식을 해석하는 흐름과 생성하는 흐름이 함께 완성되고, 이는 AGENTS.md가 요구하는 작은 신규 서비스 확장과 반복 사용 가치 측면에서 가장 적합한 다음 단계였기 때문

### 변경 내용
- `src/lib/cron-builder-tools.ts` 생성, 4가지 일정 모드 기반 helper 추가
- `src/components/cron-builder.tsx` 생성, 모드 선택/입력/build/clear/copy UI 구현
- `app/services/cron-builder/page.tsx` 생성
- `src/lib/service-registry.ts`에 `cron-builder` 서비스 등록
- `app/services/experiments/page.tsx`에서 `크론 빌더`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/cron-builder` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/cron-builder`, `크론 빌더` 노출 확인
- headless Chrome + DevTools protocol에서 4가지 모드(`*/5 * * * *`, `30 9 * * *`, `0 9 * * 1-5`, `45 18 * * 0`) 성공, invalid interval 오류, copy 성공, stale copy reset, clear reset, 모바일 표시 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 자주 쓰는 일정 패턴을 표준 5필드 cron 표현식으로 바로 생성하고 곧바로 복사할 수 있게 됨
- 방금 추가한 `크론 표현식 파서`와 짝을 이루는 builder가 생기면서, cron 해석과 생성 흐름이 허브 안에서 하나의 작은 utility cluster로 완성됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`diff-friendly formatter`, `ENV builder` 고도화가 아닌 `cron builder` 이후 다른 builder/parser 등)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 13:07

### 관찰
- `ENV 파서`를 막 추가한 직후에는 완전히 다른 utility로 넘어가기보다, parser를 실제로 다시 쓰게 만드는 역방향 도구를 붙이는 편이 더 작은 다음 단계였음
- `ENV 빌더`는 parser와 같은 좁은 dotenv subset을 공유할 수 있어 범위를 작게 유지할 수 있었고, key/value 입력 → deterministic quoted output이라는 단순한 흐름으로 구현 가능했음

### 선택한 작업
ENV 빌더 신규 서비스 추가

### 이유
parser + builder 쌍을 맞추면 허브 안에서 설정 문자열을 확인하는 흐름과 생성하는 흐름이 함께 완성되고, 이는 AGENTS.md가 요구하는 작은 신규 서비스 확장과 반복 사용 가치 측면에서 가장 적합한 다음 단계였기 때문

### 변경 내용
- `src/lib/env-builder-tools.ts` 생성, deterministic `.env` output helper 추가
- `src/components/env-builder.tsx` 생성, row-based 입력/행 추가/행 삭제/build/clear/copy UI 구현
- `app/services/env-builder/page.tsx` 생성
- `src/lib/service-registry.ts`에 `env-builder` 서비스 등록
- `app/services/experiments/page.tsx`에서 `ENV 빌더`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/env-builder` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/env-builder`, `ENV 빌더` 노출 확인
- headless Chrome + DevTools protocol에서 기본 3행 build 성공, duplicate key 오류, invalid key 오류, stale copy state reset, clear reset, 모바일 표시 확인
- helper-level verification에서 multiline value rejection과 canonical output(`APP_NAME="Made by AI"`, `APP_PORT="4000"`, `EMPTY=""`) 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 key/value 입력만으로 deterministic `.env` 출력을 생성하고 바로 복사할 수 있게 됨
- 방금 추가한 `ENV 파서`와 짝을 이루는 builder가 생기면서, 설정 문자열을 해석하고 다시 생성하는 흐름이 허브 안에서 하나의 작은 utility cluster로 완성됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`diff-friendly formatter`, `ENV builder` 고도화가 아닌 `cron builder` 등)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 12:36

### 관찰
- `크론 표현식 파서`까지 추가한 뒤에는 또 하나의 deterministic utility를 이어가는 편이 더 적합했고, 그중에서도 config 파일을 바로 들여다볼 수 있는 `.env` parser가 가장 작고 실용적인 다음 후보였음
- 다만 dotenv 영역은 export 문법, interpolation, multiline, inline comment semantics까지 넓히면 범위가 급격히 커지므로, 이번 단계에서는 basic `KEY=value` subset과 duplicate warning만 지원하도록 엄격히 제한할 필요가 있었음

### 선택한 작업
ENV 파서 신규 서비스 추가

### 이유
AGENTS.md가 신규 기능/신규 서비스 추가를 핵심 임무로 두고 있고, `.env` 입력은 개발 환경에서 실제로 자주 다시 확인하게 되는 작은 텍스트 포맷이라 deterministic parser utility로 허브에 추가할 가치가 높았기 때문

### 변경 내용
- `src/lib/env-parser-tools.ts` 생성, local-only dotenv subset parser/helper 추가
- `src/components/env-parser.tsx` 생성, 파싱/지우기/copy UI와 rows/JSON preview 렌더링 구현
- `app/services/env-parser/page.tsx` 생성
- `src/lib/service-registry.ts`에 `env-parser` 서비스 등록
- `app/services/experiments/page.tsx`에서 `ENV 파서`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/env-parser` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/env-parser`, `ENV 파서` 노출 확인
- headless Chrome + DevTools protocol에서 기본 예시 5개 변수 성공, duplicate key 경고 1개 성공, invalid key 오류, unmatched quote 오류, JSON preview copy 성공, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 결과 패널과 copy 버튼 visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 `.env` 스타일 입력을 로컬에서 바로 파싱하고, duplicate 경고와 JSON preview를 곧바로 확인·복사할 수 있게 됨
- 최근 deterministic converter 중심 흐름 다음에 parser utility 하나가 추가되면서, 허브의 개발 설정/검사 도구 범위가 더 다양해짐

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`diff-friendly formatter`, `ENV builder`, `cron builder` 등)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 12:02

### 관찰
- `숫자 포맷터`까지 추가한 뒤에는 또 다른 변환기보다, 개발자가 반복적으로 sanity check 하는 입력을 설명형 도구로 바꾸는 편이 더 적합했고, 그중 가장 범위가 작고 deterministic 한 후보가 cron 표현식 파서였음
- 다만 cron은 Quartz/macros/timezone/next-run 계산까지 건드리면 범위가 급격히 커지므로, 이번 단계에서는 표준 5필드 subset과 제한된 문법(`*`, 숫자, comma list, range, step)만 지원하도록 엄격히 고정할 필요가 있었음

### 선택한 작업
크론 표현식 파서 신규 서비스 추가

### 이유
AGENTS.md가 신규 기능/신규 서비스 추가를 핵심 임무로 두고 있고, cron 표현식은 개발/운영 맥락에서 실제로 자주 다시 확인하게 되는 작은 입력이므로, deterministic explanation utility로 허브에 추가할 가치가 높았기 때문

### 변경 내용
- `src/lib/cron-expression-tools.ts` 생성, 표준 5필드 subset parser/helper 추가
- `src/components/cron-expression-parser.tsx` 생성, 해석/지우기/copy UI와 field explanation 렌더링 구현
- `app/services/cron-expression-parser/page.tsx` 생성
- `src/lib/service-registry.ts`에 `cron-expression-parser` 서비스 등록
- `app/services/experiments/page.tsx`에서 `크론 표현식 파서`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/cron-expression-parser` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/cron-expression-parser`, `크론 표현식 파서` 노출 확인
- headless Chrome + DevTools protocol에서 `*/5 * * * *` 성공, `0 9 * * 1-5` 성공, `61 * * * *` 오류, `@daily` macro 오류, copy 성공, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 결과 패널과 copy 버튼 visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 표준 5필드 cron 표현식을 로컬에서 바로 해석하고 결과를 곧바로 복사할 수 있게 됨
- 최근 deterministic converter 중심 흐름 다음에 explanation-oriented utility 하나가 추가되면서, 허브의 개발/운영 보조 도구 범위가 더 다양해짐

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`diff-friendly formatter`, `cron builder`, `ENV parser` 등)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 11:29

### 관찰
- `TOML ↔ JSON`까지 추가한 뒤에는 또 다른 structured-text converter를 바로 늘리기보다, 다른 카테고리의 deterministic utility 하나를 추가하는 편이 현재 허브 균형에 더 적합했음
- 숫자 포맷은 copy-output polish와 변환 도구 흐름 다음에 넣기 좋은 작은 신규 서비스였고, `Intl.NumberFormat`을 쓰면 별도 의존성 없이도 decimal/percent/currency 포맷 MVP를 안정적으로 만들 수 있었음

### 선택한 작업
숫자 포맷터 신규 서비스 추가

### 이유
AGENTS.md가 신규 기능/신규 서비스 추가를 핵심 임무로 두고 있고, 숫자 포맷은 개발·문서·운영 맥락에서 바로 다시 쓰게 될 가능성이 높으며, explicit locale 선택으로 환경 의존성을 줄인 채 작은 범위로 구현할 수 있었기 때문

### 변경 내용
- `src/lib/number-format-tools.ts` 생성, explicit locale 기반 helper 추가
- `src/components/number-formatter.tsx` 생성, 입력/locale/currency/fractionDigits 선택 + 포맷/지우기/copy UI 구현
- `app/services/number-formatter/page.tsx` 생성
- `src/lib/service-registry.ts`에 `number-formatter` 서비스 등록
- `app/services/experiments/page.tsx`에서 `숫자 포맷터`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/number-formatter` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/number-formatter`, `숫자 포맷터` 노출 확인
- headless Chrome + DevTools protocol에서 decimal `1,234,567.89`, percent `25.60%`, KRW currency `₩1,234,568`, invalid number 오류, copy 성공, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 결과 패널과 copy 버튼 visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 숫자를 decimal/percent/currency 형식으로 바로 포맷하고 결과를 곧바로 복사할 수 있게 됨
- 최근 structured-text converter 중심 흐름 다음에 다른 범주의 deterministic utility가 추가되면서, 허브의 실용적인 로컬 도구 범위가 더 다양해짐

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`cron parser`, `diff-friendly formatter` 등)
2. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 11:00

### 관찰
- `YAML ↔ JSON`까지 추가한 뒤에는 structured-text 변환 도구 묶음을 한 단계 더 넓히는 편이 더 적합했고, 다음 후보 중에서는 TOML이 Python/Rust 설정 파일 흐름과 직접 이어지는 가장 자연스러운 확장 지점이었음
- 다만 TOML은 datetime/date/time 같은 JSON 비호환 타입을 기본적으로 허용하므로, 이번 단계에서는 TOML document root ↔ JSON object root로 범위를 엄격히 제한하고 unsupported 타입은 명시적으로 거절해야 유지보수 리스크를 낮출 수 있었음

### 선택한 작업
TOML ↔ JSON 변환기 신규 서비스 추가

### 이유
AGENTS.md가 신규 기능/신규 서비스 추가를 핵심 임무로 두고 있고, 최근 여러 polish cycle과 structured-text converter 추가 흐름 다음에는 TOML 같은 다음 작은 deterministic 유틸리티를 허브에 추가하는 편이 현재 단계의 균형에 더 잘 맞았기 때문

### 변경 내용
- `package.json`에 `@iarna/toml` dependency 추가
- `src/lib/toml-json-tools.ts` 생성, deterministic helper 추가
- `src/components/toml-json-converter.tsx` 생성, TOML→JSON / JSON→TOML / 지우기 / 결과 복사 UI 구현
- `app/services/toml-json-converter/page.tsx` 생성
- `src/lib/service-registry.ts`에 `toml-json-converter` 서비스 등록
- `app/services/experiments/page.tsx`에서 `TOML ↔ JSON 변환기`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/toml-json-converter` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/toml-json-converter`, `TOML ↔ JSON 변환기` 노출 확인
- headless Chrome + DevTools protocol에서 TOML→JSON 성공, JSON→TOML 성공, top-level array JSON 오류, JSON null 오류, copy 성공, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 결과 패널과 변환 버튼 visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 TOML document와 JSON object를 로컬에서 바로 서로 변환하고 결과를 곧바로 복사할 수 있게 됨
- `JSON ↔ CSV`, `YAML ↔ JSON`에 이어 또 하나의 structured-text 변환 도구가 추가되면서, 허브의 deterministic 데이터/설정 변환 묶음이 한 단계 더 넓어짐

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`cron parser`, `diff-friendly formatter` 등)
2. 남은 결과형 도구 중 copy UX 미적용 후보 재평가
3. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토

## 2026-03-11 10:14

### 관찰
- `release-log` 표면 보강까지 완료한 뒤에는 다시 허브의 실용적인 변환 도구 묶음을 넓히는 쪽이 더 적합했고, 다음 deterministic 후보 중에서는 `YAML ↔ JSON`이 `JSON ↔ CSV`와 가장 자연스럽게 이어지는 형제 서비스였음
- 다만 YAML은 JSON보다 표현 범위가 넓기 때문에, 이번 단계에서는 single-document·JSON-compatible subset으로 범위를 엄격히 고정하고 고급 YAML 기능은 명시적으로 거절해야 유지보수 리스크를 낮출 수 있었음

### 선택한 작업
YAML ↔ JSON 변환기 신규 서비스 추가

### 이유
AGENTS.md가 신규 기능/신규 서비스 추가를 핵심 임무로 두고 있고, 최근 여러 polish cycle 이후에는 다시 작은 신규 서비스 하나를 허브 안에 자연스럽게 추가하는 편이 현재 단계의 균형에 더 잘 맞았기 때문

### 변경 내용
- `package.json`에 `yaml` dependency 추가
- `src/lib/yaml-json-tools.ts` 생성, deterministic helper 추가
- `src/components/yaml-json-converter.tsx` 생성, YAML→JSON / JSON→YAML / 지우기 / 결과 복사 UI 구현
- `app/services/yaml-json-converter/page.tsx` 생성
- `src/lib/service-registry.ts`에 `yaml-json-converter` 서비스 등록
- `app/services/experiments/page.tsx`에서 `YAML ↔ JSON 변환기`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/yaml-json-converter` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/yaml-json-converter`, `YAML ↔ JSON 변환기` 노출 확인
- headless Chrome + DevTools protocol에서 YAML→JSON 성공, JSON→YAML 성공, multi-document YAML 오류, invalid JSON 오류, copy 성공, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 결과 패널과 변환 버튼 visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 JSON-compatible YAML과 JSON을 로컬에서 바로 서로 변환하고 결과를 곧바로 복사할 수 있게 됨
- `JSON ↔ CSV`에 이어 또 하나의 structured-text 변환 도구가 추가되면서, 허브의 deterministic 데이터/설정 변환 묶음이 한 단계 더 넓어짐

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`cron parser`, `diff-friendly formatter`, `TOML ↔ JSON` 등)
2. 남은 결과형 도구 중 copy UX 미적용 후보 재평가
3. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토

## 2026-03-11 09:49

### 관찰
- `JSON ↔ CSV` 추가와 네 개 출력 도구 복사 UX 정리까지 끝난 시점에는, 같은 패턴을 더 반복하기보다 `ops/last-summary.md`에서 가장 먼저 지목한 `release-log` 가독성 보강이 다음 작은 허브 표면 개선으로 더 적합했음
- 현재 `release-log`는 CHANGELOG 내용을 잘 읽어 오기는 하지만, 가장 최근 항목과 이전 기록이 모두 같은 수준의 plain panel로 렌더링되어 최근 변화 흐름을 빠르게 훑기 어렵다는 점이 실제 코드에서 확인됐음

### 선택한 작업
릴리즈 로그 페이지 가독성 보강

### 이유
새로운 서비스를 또 추가하는 것보다 더 작은 변경으로 허브 안의 운영/기록 표면을 바로 읽기 쉽게 만들 수 있었고, 기존 `release-log`의 데이터 소스와 parser를 건드리지 않고도 사용자 체감 가치를 만들 수 있었기 때문

### 변경 내용
- `app/services/release-log/page.tsx`에서 가장 최근 changelog 항목을 hero 카드로 분리
- 이전 기록은 card grid로 재배치하고, nested bullet을 `release-log-*` 클래스 기반으로 렌더링하도록 정리
- `app/globals.css`에 release-log 전용 hero/card/list/count 스타일 추가

### 검증 결과
- `lsp_diagnostics` 기준 `app/services/release-log/page.tsx` 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/release-log` → 200, `가장 최근 변경`, `이전 기록`, `누적 기록 수` 확인
- headless Chrome + DevTools protocol에서 데스크톱 기준 hero card/grid/count card visible, 모바일 폭 390 기준 hero/grid/count/첫 entry visible 확인
- 같은 브라우저 검증에서 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 최근 변경을 먼저 보고, 이전 기록은 더 읽기 쉬운 카드형 흐름으로 훑어볼 수 있게 됨
- 운영 기록 surface가 최근 여러 신규 서비스/UX 확장 흐름에 비해 덜 정리돼 있던 상태에서 한 번 균형을 맞추는 작은 허브 표면 개선이 완료됨

### 다음 작업 후보
1. 다음 deterministic local utility 후보 추가 (`YAML ↔ JSON`, `cron parser`, `diff-friendly formatter` 등)
2. 남은 결과형 도구 중 copy UX 미적용 후보 재평가
3. 검색/홈에서 최근 서비스 묶음 노출 방식 추가 보강 검토

## 2026-03-11 09:25

### 관찰
- `JSON ↔ CSV 변환기`를 추가한 직후에는 또 다른 신규 서비스를 바로 늘리는 것보다, 방금 확장된 deterministic 출력 도구 묶음의 마지막 사용 마찰을 같은 복사 UX 패턴으로 정리하는 편이 더 작은 다음 단계였음
- 대상 후보 중 `json-csv-converter`, `uuid-generator`, `sha256-generator`, `slug-generator`는 모두 단일 canonical output을 가지기 때문에, 다중 결과 도구보다 copy semantics가 명확하고 같은 사이클로 묶기 쉬웠음

### 선택한 작업
JSON↔CSV 변환기·UUID 생성기·SHA-256 생성기·슬러그 생성기 결과 복사 UX 추가

### 이유
새로운 유틸리티를 또 추가하기보다 더 작은 변경으로 이미 허브에 있는 출력 도구들의 마지막 사용 마찰을 줄일 수 있었고, 새로 들어온 JSON↔CSV 서비스도 기존 복사 UX 흐름에 바로 맞출 수 있었기 때문

### 변경 내용
- `src/components/json-csv-converter.tsx`에 `copyStatus`와 현재 결과 복사 흐름 추가
- `src/components/uuid-generator.tsx`에 UUID 결과 복사 흐름 추가
- `src/components/sha256-generator.tsx`에 digest 복사 흐름 추가
- `src/components/slug-generator.tsx`에 slug 복사 흐름 추가
- 각 대응 서비스 페이지 4곳에 결과 복사 가능 안내 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 8개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- 네 서비스 route 모두 200 및 안내 문구 확인
- headless Chrome + DevTools protocol에서 JSON→CSV 결과 복사 성공, UUID 복사 성공, SHA-256 digest 복사 성공, 슬러그 복사 성공 확인
- stale copy state reset, error state no-copy, slug 모바일 표시, sha 브라우저 clean rerun 확인
- 최종 browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 새 JSON↔CSV 변환기와 기존 UUID/SHA-256/슬러그 도구의 출력을 허브 안에서 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 최근 여러 변환/생성 도구가 같은 copy-output UX를 공유하게 되어, 허브 안의 deterministic 유틸리티 묶음이 더 일관된 작업 흐름을 갖게 됨

### 다음 작업 후보
1. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토
2. 다음 deterministic local utility 후보 추가 (`YAML ↔ JSON`, `cron parser`, `diff-friendly formatter` 등)
3. 남은 결과형 도구 중 copy UX 미적용 후보 재평가

## 2026-03-11 08:42

### 관찰
- Base64 인코더/디코더까지 복사 UX를 확장한 시점에는, 같은 패턴을 더 반복하기보다 허브 안에서 다시 쓰게 될 가능성이 높은 다음 deterministic 유틸리티를 추가하는 편이 현재 단계에 더 적합했음
- `JSON ↔ CSV`는 변환 수요가 분명하지만 nested JSON/타입 복원 같은 영역까지 한 번에 넓히면 범위가 급격히 커지기 때문에, 이번에는 flat object array JSON ↔ header-row CSV로 MVP 범위를 엄격히 고정할 필요가 있었음

### 선택한 작업
JSON ↔ CSV 변환기 신규 서비스 추가

### 이유
AGENTS.md가 신규 기능/신규 서비스 추가를 핵심 임무로 두고 있고, 현재 허브 흐름에 자연스럽게 붙는 다음 작은 유틸리티 중에서 JSON ↔ CSV 변환이 가장 이해하기 쉽고 반복 사용 가능성이 높은 후보였기 때문

### 변경 내용
- `src/lib/json-csv-tools.ts` 생성, deterministic 변환 helper 추가
- `src/components/json-csv-converter.tsx` 생성, 입력/변환/지우기 UI와 결과/열 정보 표시 구현
- `app/services/json-csv-converter/page.tsx` 생성
- `src/lib/service-registry.ts`에 `json-csv-converter` 서비스 등록
- `app/services/experiments/page.tsx`에서 `JSON ↔ CSV 변환기`를 `승격 완료`와 실제 링크로 반영

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 5개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/json-csv-converter` → 200, 제목/안내 문구 확인
- 홈/실험실/search HTML에 `/services/json-csv-converter`, `JSON ↔ CSV 변환기` 노출 확인
- headless Chrome + DevTools protocol에서 JSON→CSV 성공, CSV→JSON 성공, nested JSON 오류, 열 수 불일치 CSV 오류, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 결과 패널과 변환 버튼 visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 flat object array JSON과 CSV를 로컬에서 바로 서로 변환할 수 있게 됨
- 최근 여러 사이클의 미세 UX 보강 다음에 다시 신규 서비스 추가 트랙으로 자연스럽게 복귀하면서, 허브의 실용적인 변환 도구 묶음이 한 단계 더 넓어짐

### 다음 작업 후보
1. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토
2. 남은 결과형 도구 중 반복 사용 빈도가 높은 후보 재평가
3. 다음 deterministic local utility 후보 발굴 (`YAML ↔ JSON`, `cron parser`, `diff-friendly formatter` 등)

## 2026-03-11 08:03

### 관찰
- URL 인코더/디코더까지 복사 UX를 확장한 다음에는, 구조가 거의 같은 `Base64 인코더/디코더`가 가장 작은 다음 확장 대상이었음
- 이 도구는 하나의 `result.output`을 공유하지만, 인코딩/디코딩 액션이 둘이고 UTF-8 round-trip까지 정확히 복사되는지 함께 검증할 필요가 있었음

### 선택한 작업
Base64 인코더/디코더 결과 복사 UX 추가

### 이유
새로운 유틸리티를 추가하는 것보다 더 작은 변경으로 기존 변환 도구의 마지막 사용 마찰을 줄일 수 있었고, UTF-8까지 포함한 단일 결과형 복사 UX 기준도 명확히 정리할 수 있었기 때문

### 변경 내용
- `src/components/base64-encoder.tsx`에 `copyStatus` 상태 추가
- `handleEncode`, `handleDecode`, `handleClear`, `handleCopy` 핸들러로 실행/초기화/복사 흐름 정리
- 성공 결과에서만 `결과 복사` 버튼, 액션별 성공 메시지, 공통 실패 메시지 표시
- `app/services/base64-encoder/page.tsx` 안내에 결과 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/base64-encoder` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 ASCII 인코딩 결과 `TWFkZSBieSBBSQ==` 복사 성공, ASCII 디코딩 결과 `Made by AI` 복사 성공, UTF-8 인코딩 결과 `7ZeI67iMIO2FjOyKpO2KuA==` 복사 성공, UTF-8 디코딩 결과 `허브 테스트` 복사 성공, 클립보드 실패 메시지, 잘못된 입력 `%%%` 디코딩 오류 상태에서 복사 버튼 미노출, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
- browser verification 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 Base64 인코딩/디코딩 결과를 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 단일 결과형 복사 UX가 여러 변환 도구에 걸쳐 일관되게 확장되면서, 이제는 또 다른 복사 UX 확장을 이어갈지 신규 deterministic 유틸리티 추가로 넘어갈지 선택이 더 선명해짐

### 다음 작업 후보
1. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
2. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토
3. 남은 단일 결과형 도구 중 반복 사용 빈도가 높은 후보 재평가

## 2026-03-11 07:32

### 관찰
- 줄바꿈 형식 변환기까지 복사 UX를 확장한 다음에는, 구조가 단순하고 encode/decode 두 액션만 추가로 고려하면 되는 `URL 인코더/디코더`가 가장 작은 다음 확장 대상이었음
- 이 도구는 하나의 `result.output`을 공유하지만, 인코딩/디코딩 성공 메시지를 액션별로 나눠야 했고 재실행 시 복사 상태가 stale 되지 않는지까지 함께 확인할 필요가 있었음

### 선택한 작업
URL 인코더/디코더 결과 복사 UX 추가

### 이유
새로운 유틸리티를 추가하는 것보다 더 작은 변경으로 기존 변환 도구의 마지막 사용 마찰을 줄일 수 있었고, 액션이 둘인 단일 결과형 도구의 복사 UX 기준도 명확히 정리할 수 있었기 때문

### 변경 내용
- `src/components/url-encoder.tsx`에 `copyStatus` 상태 추가
- `handleEncode`, `handleDecode`, `handleClear`, `handleCopy` 핸들러로 실행/초기화/복사 흐름 정리
- 성공 결과에서만 `결과 복사` 버튼, 액션별 성공 메시지, 공통 실패 메시지 표시
- `app/services/url-encoder/page.tsx` 안내에 결과 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/url-encoder` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 인코딩 결과 `hello%20world%3Fx%3D1%26y%3D2` 복사 성공, 디코딩 결과 `hello world?x=1&y=2` 복사 성공, 디코딩 재실행 시 이전 성공 메시지 초기화, 클립보드 실패 메시지, 잘못된 입력 `%` 디코딩 오류 상태에서 복사 버튼 미노출, 지우기 후 상태 초기화 확인
- 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
- 최종 clean browser rerun 기준 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 URL 인코딩/디코딩 결과를 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 단일 결과형 복사 UX가 다중 도구에 걸쳐 일관되게 확장되면서, 이후에는 또 다른 소규모 UX 확장을 이어갈지 신규 deterministic 유틸리티를 추가할지 선택이 더 선명해짐

### 다음 작업 후보
1. `base64-encoder` 같은 다른 단일 결과 유틸리티에 복사 UX 확장
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 06:55

### 관찰
- 단일 결과형 복사 UX를 여러 텍스트 정리 도구에 확장한 다음에는, 복사 대상의 의미가 갈릴 수 있는 `줄바꿈 형식 변환기`가 가장 작은 다음 검증 대상이었음
- 이 도구는 `escapedPreview`와 실제 `result.output`을 함께 보여 주기 때문에, 복사 버튼이 어느 값을 복사하는지 명확히 정리하지 않으면 사용자가 헷갈릴 수 있었음

### 선택한 작업
줄바꿈 형식 변환기 결과 복사 UX 추가

### 이유
새로운 유틸리티를 추가하는 것보다 더 작은 변경으로 기존 변환 도구의 마지막 사용 마찰을 줄일 수 있었고, 동시에 escaped preview와 실제 출력 중 무엇을 복사해야 하는지 기준을 확실하게 정리할 수 있었기 때문

### 변경 내용
- `src/components/line-ending-tool.tsx`에 `copyStatus` 상태 추가
- `handleConvert`, `handleClear`, `handleCopy` 핸들러로 변환/초기화/복사 흐름 정리
- 성공 결과에서만 `결과 복사` 버튼, 실제 출력 복사 안내 문구, 성공/실패 메시지 표시
- `app/services/line-ending-tool/page.tsx` 안내에 실제 정규화 결과 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/line-ending-tool` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 LF 모드 복사값 `alpha\nbeta\ngamma\ndelta`, CRLF 모드 복사값 `alpha\r\nbeta\r\ngamma\r\ndelta`, 실패 주입 시 오류 메시지, 재변환 시 상태 초기화, 지우기 후 상태 초기화, 빈 입력 오류 상태 확인
- 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
- 동일 브라우저 검증에서 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 escaped preview가 아니라 실제 정규화된 줄바꿈 결과를 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 단일 결과형 복사 UX 확장이 의미가 갈릴 수 있는 도구까지 안전하게 정리되어, 이후에는 신규 유틸리티 추가로 넘어갈지 추가 확장을 계속할지 기준이 더 선명해짐

### 다음 작업 후보
1. `url-encoder` 또는 `base64-encoder` 같은 다른 단일 결과 유틸리티에 복사 UX 확장
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 06:38

### 관찰
- `빈 줄 정리기`까지 단일 결과형 복사 UX를 확장한 다음에는, 구조가 거의 같은 `줄 공백 정리기`가 가장 작은 다음 확장 대상이었음
- `줄 공백 정리기`는 단일 `result.output` 구조를 유지하면서도 trim 모드 변경과 빈 줄 유지 같은 별도 상태가 있어, 재정리/지우기 시 복사 상태 초기화까지 함께 검증할 가치가 있었음

### 선택한 작업
줄 공백 정리기 결과 복사 UX 추가

### 이유
새로운 유틸리티를 추가하는 것보다 더 작은 변경으로 이미 자주 쓰는 텍스트 정리 도구의 마지막 사용 마찰을 줄일 수 있었고, 단일 결과형 복사 패턴을 한 번 더 안전하게 확장할 수 있었기 때문

### 변경 내용
- `src/components/line-trim-tool.tsx`에 `copyStatus` 상태 추가
- `handleTrim`, `handleClear`, `handleCopy` 핸들러로 정리/초기화/복사 흐름 정리
- 성공 결과에서만 `결과 복사` 버튼과 성공/실패 메시지 표시
- `app/services/line-trim-tool/page.tsx` 안내에 결과 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/line-trim-tool` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 기본 `앞뒤 공백 제거` 결과 `alpha\nbeta\n\ngamma`, 복사 성공, 실패 주입 시 오류 메시지, 재정리 시 상태 초기화, 지우기 후 상태 초기화, 빈 입력 오류 상태 확인
- 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
- 동일 브라우저 검증에서 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 줄 공백 정리 결과를 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 단일 결과형 복사 UX 패턴이 여러 텍스트 정리 도구에 안정적으로 확장되어, 후속 결과형 도구 확장과 신규 유틸리티 추가 사이의 선택 기준이 더 명확해짐

### 다음 작업 후보
1. `line-ending-tool` 같은 다른 단일 결과 유틸리티에 복사 UX 확장
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 06:22

### 관찰
- 다중 결과 도구 2개에 복사 UX를 확장한 뒤에는, 가장 작은 단일 결과형 유틸리티에 같은 패턴을 이어 붙이는 것이 현재 허브 흐름에서 가장 안전한 다음 단계였음
- `빈 줄 정리기`는 단일 `result.output` 구조라서, 이미 검증된 JSON 포맷터/텍스트 치환 도구 패턴을 거의 그대로 재사용할 수 있었음

### 선택한 작업
빈 줄 정리기 결과 복사 UX 추가

### 이유
새로운 유틸리티를 추가하는 것보다 더 작은 변경으로 이미 자주 쓰는 결과형 도구의 마지막 사용 마찰을 줄일 수 있었고, 단일 결과형 복사 패턴도 한 번 더 안정적으로 다질 수 있었기 때문

### 변경 내용
- `src/components/blank-line-tool.tsx`에 `copyStatus` 상태 추가
- `handleClean`, `handleClear`, `handleCopy` 핸들러로 정리/초기화/복사 흐름 정리
- 성공 결과에서만 `결과 복사` 버튼과 성공/실패 메시지 표시
- `app/services/blank-line-tool/page.tsx` 안내에 결과 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/blank-line-tool` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, `remove-all` 결과 `alpha\nbeta\ngamma`, `collapse-runs` 결과 `alpha\n\nbeta\n\ngamma`, 복사 성공, 실패 주입 시 오류 메시지, 지우기 후 상태 초기화, 빈 입력 오류 상태 확인
- 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
- 동일 브라우저 검증에서 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 빈 줄 정리 결과를 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 단일 결과형/다중 결과형 복사 UX 패턴이 모두 더 안정적으로 정리되어 후속 결과형 도구 확장 기준이 분명해짐

### 다음 작업 후보
1. `line-trim-tool` 또는 `line-ending-tool` 같은 다른 단일 결과 유틸리티에 복사 UX 확장
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 06:04

### 관찰
- `줄 정렬기`에서 먼저 정리한 다중 결과 복사 패턴 다음에는, 구조가 가장 가까운 `줄 목록 정리기`에 같은 경험을 적용하는 것이 가장 작은 다음 확장 단위였음
- `줄 목록 정리기`는 입력 순서 유지 결과와 정렬 결과를 동시에 보여 주기 때문에, 카드별 독립 복사 상태와 메시지가 필요했음

### 선택한 작업
줄 목록 정리기 다중 결과 복사 UX 추가

### 이유
새로운 유틸리티를 추가하는 것보다 더 작은 변경으로 이미 자주 쓰는 결과형 도구의 마지막 사용 마찰을 줄일 수 있었고, 다중 결과 블록 UX 기준도 더 일관되게 확장할 수 있었기 때문

### 변경 내용
- `src/components/line-list-cleaner.tsx`에 `ordered`/`sorted` 독립 `copyStatus` 상태 추가
- `handleAnalyze`, `handleClear`, `handleCopy` 핸들러로 정리/초기화/복사 흐름 정리
- 각 결과 카드에 전용 복사 버튼과 성공/실패 메시지 추가
- `app/services/line-list-cleaner/page.tsx` 안내에 결과별 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/line-list-cleaner` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 정리 후 결과값/카피 버튼 노출, 입력 순서 유지 복사 성공, 정렬 결과 실패 메시지, 지우기 후 상태 초기화, 빈 입력 오류 상태 확인
- 모바일 폭 390 기준 두 결과 카드와 두 복사 버튼 모두 visible 확인
- 동일 브라우저 검증에서 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 줄 목록 정리 결과를 입력 순서/정렬 결과별로 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 다중 결과 도구 2개가 같은 패턴을 공유하게 되어, 후속 결과형 유틸리티 UX 확장 기준이 더 분명해짐

### 다음 작업 후보
1. `blank-line-tool` 같은 단일 결과 유틸리티에 복사 UX 확장
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 05:48

### 관찰
- 단일 결과형 도구 2개에서 검증된 복사 UX 패턴 다음에는, 다중 결과 블록을 가진 유틸리티에 같은 경험을 어떻게 분리 적용할지 정하는 것이 가장 작은 다음 설계 과제였음
- `줄 정렬기`는 오름차순/내림차순 결과가 동시에 존재해 각각 독립 복사 상태를 가져야 했고, 이 패턴을 한 번 정리하면 다른 다중 결과 도구에도 재사용 가능한 기준이 생김

### 선택한 작업
줄 정렬기 다중 결과 복사 UX 추가

### 이유
새 서비스 추가보다 더 작은 변경으로 기존 허브 사용 흐름의 마지막 마찰을 줄일 수 있었고, 동시에 다중 결과 도구에 맞는 복사 UX 기준을 안전하게 정립할 수 있었기 때문

### 변경 내용
- `src/components/line-sort-tool.tsx`에 `ascending`/`descending` 독립 `copyStatus` 상태 추가
- `handleSort`, `handleClear`, `handleCopy` 핸들러로 정렬/초기화/복사 흐름 정리
- 각 결과 카드에 전용 복사 버튼과 성공/실패 메시지 추가
- `app/services/line-sort-tool/page.tsx` 안내에 결과별 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/line-sort-tool` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 정렬 후 결과값/카피 버튼 노출, 오름차순 복사 성공, 내림차순 실패 메시지, 지우기 후 상태 초기화, 빈 입력 오류 상태 확인
- 모바일 폭 390 기준 두 결과 카드와 두 복사 버튼 모두 visible 확인
- 동일 브라우저 검증에서 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 줄 정렬 결과를 오름차순/내림차순별로 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 다중 결과 블록을 가진 도구에서도 카드별 복사 상태를 독립적으로 다루는 기준이 생겨 후속 UX 확장이 쉬워짐

### 다음 작업 후보
1. `line-list-cleaner` 같은 다른 다중 결과 유틸리티에 맞춤형 복사 UX 확장
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 05:23

### 관찰
- 최근 `JSON 포맷터/검증기`에 먼저 적용한 복사 UX 패턴이 실제로 작고 안정적인 개선 단위임이 확인되었음
- `텍스트 치환 도구`는 성공 결과가 `result.output` 한 블록으로만 노출되어 있어 같은 패턴을 거의 그대로 확장하기 가장 좋은 다음 대상이었음

### 선택한 작업
텍스트 치환 도구 결과 복사 UX 추가

### 이유
새 서비스를 또 하나 추가하는 것보다, 이미 자주 쓰는 결과형 도구의 마지막 복사 행동을 줄이는 편이 더 작은 변경으로 즉시 체감되는 사용자 가치를 만들 수 있었기 때문

### 변경 내용
- `src/components/text-replace-tool.tsx`에 `copyStatus` 상태 추가
- `handleReplace`, `handleClear`, `handleCopy` 핸들러로 결과/복사 상태 흐름 정리
- 성공 결과에서만 `결과 복사` 버튼과 성공/실패 피드백 표시
- `app/services/text-replace-tool/page.tsx` 안내에 결과 복사 가능 문구 추가

### 검증 결과
- `lsp_diagnostics` 기준 변경 파일 2개 모두 오류 없음
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과
- `http://localhost:80/services/text-replace-tool` → 200, 제목/안내 문구 확인
- headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 치환 후 `bar bar` 복사 성공, 실패 주입 시 오류 메시지, 지우기 후 상태 초기화 확인
- 동일 브라우저 검증에서 info/log 외 console exception 없음 확인

### 결과
- 사용자는 허브 안에서 문자열 치환 결과를 바로 복사해 다음 작업으로 이어갈 수 있게 됨
- 기존 JSON 포맷터에 이어 두 번째 결과형 도구에도 동일한 복사 경험이 생겨 허브 사용 패턴이 조금 더 일관되게 맞춰짐

### 다음 작업 후보
1. `line-sort-tool`처럼 다중 결과 블록을 가진 유틸리티의 복사 UX 설계 및 적용
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 05:07

### 관찰
- Oracle 검토 기준으로 허브 탐색 중복 문제는 정리되었고, 다음 가장 작은 사용자 체감 개선은 새 서비스 추가보다 기존 결과형 유틸리티의 마지막 사용 단계 마찰 제거 쪽이 더 가치 있었음
- `JSON 포맷터/검증기`는 포맷된 결과가 명확하고 단일 output block 구조라서 첫 클립보드 UX 적용 대상으로 가장 작고 안전했음

### 선택한 작업
JSON 포맷터/검증기 결과 복사 UX 추가

### 이유
허브 안에서 이미 자주 쓰는 결과형 도구의 마지막 단계인 복사 행동을 줄이면, 새 유틸리티 하나를 더 늘리는 것보다 즉시 체감되는 반복 마찰 감소 효과가 컸기 때문

### 변경 내용
- `src/components/json-formatter.tsx`에 `copyStatus` 상태 추가
- 성공 결과에서만 `결과 복사` 버튼 노출
- 클립보드 성공/실패 메시지 추가

### 검증 결과
- `lsp_diagnostics` 기준 `src/components/json-formatter.tsx` 오류 없음
- `pnpm build` 통과
- `http://localhost:80/services/json-formatter` → 200 확인
- headless Chrome + DevTools protocol로 포맷 → 결과 복사 성공 메시지와 실제 복사 값 확인
- 동일 검증에서 클립보드 실패 상황 주입 시 오류 메시지 확인

### 결과
- 사용자는 허브 안에서 포맷된 JSON 결과를 바로 복사해 다음 작업으로 넘길 수 있게 됨
- 클립보드 API가 막힌 환경에서도 실패 이유를 바로 알 수 있게 되어 사용 흐름이 덜 모호해짐

### 다음 작업 후보
1. `text-replace-tool`, `line-sort-tool` 같은 다른 결과형 유틸리티로 같은 복사 UX 확장
2. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 검토
3. `release-log`에서 같은 기능/서비스가 반복 기록처럼 보이는 이력 표현 방식 보완 검토

## 2026-03-11 04:59

### 관찰
- 현재 실제 코드 기준으로 `src/lib/service-registry.ts`와 `app/services/experiments/page.tsx`에 `줄 목록 정리기`가 각각 한 번씩 더 중복 선언되어 있었음
- 이런 메타데이터 중복은 허브 카드 노출, 검색 결과, 서비스 수 집계 같은 탐색 흐름을 실제 서비스 구조와 어긋나게 만들 수 있었음

### 선택한 작업
허브 레지스트리/실험실 중복 항목 정리

### 이유
새 기능을 더 추가하기 전에 허브의 source of truth인 등록 데이터부터 일관되게 맞추는 편이 가장 작은 비용으로 사용자 탐색 오류를 줄이는 안전한 수정이었기 때문

### 변경 내용
- `src/lib/service-registry.ts`에서 중복된 `line-list-cleaner` 서비스 블록 제거
- `app/services/experiments/page.tsx`에서 중복된 `줄 목록 정리기` 카드 제거

### 검증 결과
- 변경 파일 기준 `lsp_diagnostics` 모두 `No diagnostics found`
- `pnpm build` 통과
- `key: "line-list-cleaner"` source 기준 1건만 남은 것 확인
- `name: "줄 목록 정리기"` source 기준 1건만 남은 것 확인

### 결과
- 허브의 서비스 등록 데이터와 실험실 노출 데이터가 다시 실제 서비스 구조와 일치하게 정리됨
- 다음 개선부터는 중복 노출 걱정 없이 탐색성 개선이나 신규 유틸리티 추가를 이어갈 수 있음

### 다음 작업 후보
1. 텍스트 결과형 서비스에 작은 클립보드 복사 UX 추가
2. `포모도로 타이머` 보류 상태 재평가 또는 다른 신규 소형 서비스 후보 발굴
3. `JSON ↔ CSV 변환기` 같은 다음 deterministic local utility 후보 검토

## 2026-03-11 04:37

### 관찰
- 줄 목록 정리기까지 추가된 뒤에도 허브 안에서 바로 쓸 수 있는 작은 로컬 개발/생산성 유틸리티를 더 발굴할 여지는 남아 있었음
- `포모도로 타이머`는 여전히 보류 상태라서, 이번에도 타이머가 아닌 결정적 입력/출력 기반 서비스가 더 안전했음
- 줄 정렬기는 중복을 유지한 채 deterministic 하게 정렬 결과를 보여 줄 수 있어, 현재 텍스트 정리 유틸리티 묶음과 잘 맞는 다음 후보였음

### 선택한 작업
줄 정렬기 신규 서비스 추가

### 이유
허브 안에서 사용자가 바로 쓰는 신규 서비스도 계속 늘려야 했고, 그중 가장 작은 다음 deterministic 개발자/생산성 유틸리티가 줄 정렬기였기 때문

### 변경 내용
- `src/lib/line-sort-tools.ts` 생성, deterministic line sort helper 추가
- `src/components/line-sort-tool.tsx` 생성, textarea와 정렬/지우기 UI 및 ascending/descending 결과 카드 구현
- `app/services/line-sort-tool/page.tsx` 생성
- `src/lib/service-registry.ts`에 `line-sort-tool` 서비스 등록
- `app/services/experiments/page.tsx`에서 `줄 정렬기`를 `승격 완료`와 실제 링크로 갱신

### 검증 결과
- `pnpm typecheck` 통과
- `pnpm lint` 통과
- `pnpm build` 통과
- `curl --max-time 20 http://localhost:80/services/line-sort-tool` → 200 OK
- 서비스/홈/실험실/search HTML에 줄 정렬기 노출 확인
- 실제 Chrome headless에서 ascending/descending fixture와 빈 입력 오류 확인
- 모바일 폭에서 줄 정렬기 핵심 요소 표시 확인
- 브라우저 error-level console 로그 없음 확인

### 결과
- 허브 안에서 바로 접근 가능한 또 하나의 로컬 개발/생산성 유틸리티가 추가됨
- 사용자는 여러 줄 텍스트를 허브 안에서 바로 오름차순/내림차순으로 정렬하면서 중복은 유지할 수 있게 됨

### 다음 작업 후보
1. 포모도로 타이머 보류 상태 재평가 또는 다른 신규 소형 서비스 후보 발굴
2. 서버 상태 대시보드에 포트별 최근 실패 이력이나 경고 기준 추가
3. 검색 서비스에 추천 묶음 설명/근거 세분화
