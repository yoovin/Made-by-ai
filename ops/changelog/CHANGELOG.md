# CHANGELOG

## 2026-03-12 18:05
- 요약: 허브에 로컬 전용 PEM 블록 식별기 신규 서비스 추가
- 변경 이유: certificate/CSR/public-key inspector가 이미 충분히 쌓인 current repo state 기준으로, 사용자가 붙여 넣은 PEM 텍스트가 어떤 artifact인지 먼저 triage해 주는 low-risk front-door utility가 다음 가장 작은 gap이었기 때문
- 사용자 영향: 허브 메인에서 `PEM 블록 식별기` 카드로 이동해 pasted PEM text의 block labels, block count, same-label vs mixed composition, malformed boundary issues, 그리고 다음에 열어야 할 inspector link를 바로 확인할 수 있음
- 기술 변경:
  - `src/lib/pem-block-tools.ts` 생성, label-only PEM boundary scanner + block summary/issue classifier 추가
  - `src/lib/pem-block-tools.test.ts` 생성, helper-level regression harness 추가
  - `src/components/pem-block-inspector.tsx` 생성, textarea 입력 + identify/clear UI와 classification panel 구현
  - `app/services/pem-block-inspector/page.tsx` 생성
  - `package.json`에 `test:pem-block-tools` 스크립트 추가
  - `src/lib/service-registry.ts`에 `pem-block-inspector` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `PEM 블록 식별기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `pem`/`bundle`/`identify`/`triage` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/pem-block-tools.ts`, `src/components/pem-block-inspector.tsx`, `app/services/pem-block-inspector/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - `package.json`은 biome 미설치로 LSP diagnostics unavailable이지만 `pnpm lint`와 `pnpm build`는 통과
  - `pnpm test:pem-block-tools`에서 blank input, no-PEM text, single cert, single CSR, single public key, single private key, encrypted private key, same-label bundle, mixed bundle, mismatched boundary, stray END, missing END 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/pem-block-inspector` → 200 확인, 홈/실험실/search HTML에 `PEM 블록 식별기`, `/services/pem-block-inspector` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 single cert classification, mixed bundle classification, mismatch error state, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 cycle 자체는 safe 판정했고 wording은 `label-only PEM triage`, `complete matched blocks`, `known block labels` 기준을 유지해야 한다는 caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 PEM boundary/label triage에만 집중하며 cryptographic parsing, base64 validation, trust verification, private-key parsing은 포함하지 않음
  - helper는 line-anchored RFC PEM validator가 아니라 lightweight boundary scanner이므로 malformed text에서도 partial complete blocks와 issue list를 함께 반환할 수 있음
  - downstream inspector suggestion path는 helper 내부 mapping을 사용하므로 future slug rename 시 함께 갱신해야 함

## 2026-03-12 17:18
- 요약: 허브에 로컬 전용 JWK 요약기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster는 PEM/SSH/JWT inspect utility까지 충분히 넓어졌지만, JWK JSON object 자체를 로컬에서 읽고 thumbprint를 확인하는 JOSE-native utility는 아직 없어 adjacent workflow gap이 남아 있었기 때문
- 사용자 영향: 허브 메인에서 `JWK 요약기` 카드로 이동해 단일 RSA/EC JWK JSON object의 key metadata와 RFC 7638 SHA-256 thumbprint를 바로 확인하고 복사할 수 있음
- 기술 변경:
  - `src/lib/jwk-tools.ts` 생성, single-object RSA/EC JWK parse + RFC 7638 thumbprint helper 추가
  - `src/components/jwk-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
  - `app/services/jwk-inspector/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `jwk-inspector` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `JWK 요약기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `jwk`/`jwks`/`jose`/`thumbprint` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/jwk-tools.ts`, `src/components/jwk-inspector.tsx`, `app/services/jwk-inspector/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 generated RSA/EC public JWK, public/private same thumbprint, blank input, non-object JSON, JWKS rejection, `oct` rejection, missing member rejection, malformed base64url rejection, unsupported curve rejection 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/jwk-inspector` → 200 확인, 홈/실험실/search HTML에 `JWK 요약기`, `/services/jwk-inspector` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 valid RSA flow, valid EC flow, private visibility, JWKS rejection, thumbprint copy, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 RFC 7638 thumbprint path는 safe 판정했고, wording은 `public-members thumbprint`, `visibility is metadata`, `no full private key validation` 기준을 유지해야 한다는 caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 single RSA/EC JWK object inspection에만 집중하며 JWKS browsing, PEM conversion, OKP, `oct`, signing, import/export, trust validation은 포함하지 않음
  - thumbprint는 RFC 7638 public members 기준으로 계산되므로 private members 존재 여부와 무관하게 same key material이면 same thumbprint를 반환함
  - `visibility`는 private members 존재 여부를 요약하는 metadata일 뿐 complete private key validation이나 cryptographic usability를 보장하지 않음

## 2026-03-12 16:31
- 요약: 허브에 로컬 전용 JWT 인코더 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `jwt-decoder`는 이미 있었지만 compact JWT를 로컬에서 직접 만들어 보는 pair-side utility가 없어 encode/decode workflow가 닫혀 있지 않았기 때문
- 사용자 영향: 허브 메인에서 `JWT 인코더` 카드로 이동해 JSON header/payload와 시크릿으로 HS256/384/512 compact JWT를 로컬에서 생성하고 복사할 수 있음
- 기술 변경:
  - `src/lib/hmac-tools.ts`에 raw signature를 재사용할 수 있는 `generateRawHmac()` helper 추가
  - `src/lib/jwt-tools.ts`에 JSON object parse + header.alg injection/guard + HS256/384/512 compact JWT construction helper 추가
  - `src/components/jwt-encoder.tsx` 생성, header/payload/secret 입력 + algorithm selector + generate/clear/copy UI 구현
  - `app/services/jwt-encoder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `jwt-encoder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `JWT 인코더`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `jwt encoder`/`hs256`/`sign` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/jwt-tools.ts`, `src/lib/hmac-tools.ts`, `src/components/jwt-encoder.tsx`, `app/services/jwt-encoder/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 valid HS256/384/512 signing, decoder round-trip, blank secret rejection, non-object header rejection, non-object payload rejection, `header.alg` mismatch rejection, non-string `header.alg` rejection 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/jwt-encoder` → 200 확인, 홈/실험실/search HTML에 `JWT 인코더`, `/services/jwt-encoder` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 HS256 generation, HS512 switch, copy success, decoder round-trip, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 HS-only signing path는 safe 판정했고, wording은 `local compact JWT construction/signing`과 `JSON object re-serialization before signing` 기준을 유지해야 한다는 caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 HS256/384/512 기반 local compact JWT construction에만 집중하며 RS256/ES256, JWK import, verification, key management, persistence는 포함하지 않음
  - header/payload는 JSON object로 parse된 뒤 compact하게 re-serialize되어 signing되므로 raw textarea whitespace/duplicate-key semantics를 그대로 보존하지 않음
  - 생성 결과는 테스트/개발용 local token construction일 뿐 trust verification이나 auth correctness를 보장하지 않음

## 2026-03-12 15:48
- 요약: 허브에 로컬 전용 Base64URL 인코더/디코더 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster는 이미 충분히 두꺼워졌지만, 기존 `base64-encoder`는 standard Base64만 다루고 있어 JWT-safe URL-safe variant를 바로 변환하는 작은 utility gap이 남아 있었기 때문
- 사용자 영향: 허브 메인에서 `Base64URL 인코더/디코더` 카드로 이동해 UTF-8 텍스트를 Base64URL로 인코딩하고, Base64URL 문자열을 다시 UTF-8 텍스트로 디코딩할 수 있음
- 기술 변경:
  - `src/lib/base64url-tools.ts` 생성, exact-input Base64URL encode/decode helper와 URL-safe alphabet/padding normalization 추가
  - `src/components/base64url-encoder.tsx` 생성, encode/decode/clear/copy UI 구현
  - `app/services/base64url-encoder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `base64url-encoder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `Base64URL 인코더/디코더`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `base64url`/`url-safe` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/base64url-tools.ts`, `src/components/base64url-encoder.tsx`, `app/services/base64url-encoder/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 exact JWT-header encode, exact JWT-header decode, URL-safe decode, padded Base64URL decode, standard Base64 rejection, invalid UTF-8 rejection, blank input rejection, exact-space encoding 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/base64url-encoder` → 200 확인, 홈/실험실/search HTML에 `Base64URL 인코더/디코더`, `/services/base64url-encoder` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 exact encode result, exact decode result, padded decode result, invalid decode rejection, copy, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 alphabet/padding path는 safe 판정했고, wording은 `Base64URL -> UTF-8 text` 및 generic invalid decode message 기준으로 유지해야 한다는 caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 UTF-8 text payload에 대한 Base64URL encode/decode에만 집중하며 arbitrary binary payload inspection, file handling, standard Base64/base64url multi-mode toggle은 포함하지 않음
  - decode는 optional trailing `=`를 정규화해 허용하지만 canonical padding form 자체를 엄격히 검증하지는 않음
  - decode 실패는 모두 generic invalid Base64URL error로 수렴하며 세부 실패 원인을 분리해 보여 주지 않음

## 2026-03-12 15:01
- 요약: 허브에 로컬 전용 SHA-256 검증기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster에서 `sha256-generator`는 이미 있었지만, 텍스트와 pasted digest를 바로 비교하는 verify-side utility가 없어 generator/verifier pair가 닫혀 있지 않았기 때문
- 사용자 영향: 허브 메인에서 `SHA-256 검증기` 카드로 이동해 trim-normalized 텍스트의 SHA-256 hex digest를 pasted digest와 비교하고 match/mismatch를 바로 확인할 수 있음
- 기술 변경:
  - `src/lib/hash-tools.ts`에 expected digest normalization + `verifySha256Digest()` helper 추가
  - `src/components/sha256-verifier.tsx` 생성, text/digest 입력 + verify/clear/copy UI 구현
  - `app/services/sha256-verifier/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `sha256-verifier` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `SHA-256 검증기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `verify`/`checksum`/`digest` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/hash-tools.ts`, `src/components/sha256-verifier.tsx`, `app/services/sha256-verifier/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 valid match, uppercase digest normalization, valid mismatch, blank text, blank digest, wrong-length digest, non-hex digest, multiline digest rejection 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/sha256-verifier` → 200 확인, 홈/실험실/search HTML에 `SHA-256 검증기`, `/services/sha256-verifier` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 match flow, mismatch flow, invalid digest error, computed digest copy, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 generator와 verifier가 같은 trim-normalized path를 쓰는 점은 safe 판정했고, wording은 `local digest equality` 기준으로 유지해야 한다는 caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 trim-normalized text input과 pasted SHA-256 hex digest의 local equality check만 지원하며 file hashing, multi-algorithm compare, authenticity/integrity 보증은 포함하지 않음
  - expected digest도 trim/lowercase normalization을 거치므로 exact raw whitespace preservation semantics를 제공하지 않음

## 2026-03-12 14:02
- 요약: 허브에 로컬 전용 SSH 키 지문 생성기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster는 certificate/CSR/public key와 API key triage까지 이미 충분히 넓어졌고, 그 다음 단계로는 developer workflow에서 자주 붙여 넣는 single-line OpenSSH public key를 로컬에서 읽고 fingerprint를 확인하는 작은 utility가 가장 작고 재사용 가치가 높았기 때문
- 사용자 영향: 허브 메인에서 `SSH 키 지문 생성기` 카드로 이동해 단일 OpenSSH 공개키 한 줄의 key type, key detail, comment, SHA-256 fingerprint를 바로 확인하고 복사할 수 있음
- 기술 변경:
  - `src/lib/ssh-key-tools.ts` 생성, single-line OpenSSH public key parser + SSH blob fingerprint helper 추가
  - `src/components/ssh-key-fingerprint.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
  - `app/services/ssh-key-fingerprint/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `ssh-key-fingerprint` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `SSH 키 지문 생성기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `ssh`/`openssh`/`authorized_keys`/`ed25519`/`ecdsa` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/ssh-key-tools.ts`, `src/components/ssh-key-fingerprint.tsx`, `app/services/ssh-key-fingerprint/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 real `ssh-keygen` fixture 기준 valid ed25519, valid RSA 2048, valid ECDSA nistp256, blank input, multiline rejection, PEM rejection, malformed base64 rejection, SSH certificate rejection, authorized_keys option rejection, unsupported `sk-ssh-*` type rejection 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/ssh-key-fingerprint` → 200 확인, 홈/실험실/search HTML에 `SSH 키 지문 생성기`, `/services/ssh-key-fingerprint` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 valid ed25519 flow, valid RSA flow, fingerprint copy, PEM rejection, malformed key rejection, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 parser/fingerprint path는 safe 판정했고, wording은 `OpenSSH public key inspection`과 `SHA-256 blob fingerprint` 기준으로 유지해야 한다는 caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 single-line OpenSSH public key inspection에만 집중하며 private key parsing, SSH config parsing, full `authorized_keys` parsing, signing, trust verification은 포함하지 않음
  - RSA/ECDSA 검사는 basic structural validation 수준이며 cryptographic validity, ownership, server authenticity를 증명하지 않음
  - trailing comment는 user-supplied line suffix를 표시할 뿐 cryptographically bound metadata가 아님

## 2026-03-12 13:10
- 요약: 허브에 로컬 전용 API 키 형식 판별기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster는 PKI/secret utility까지 충분히 넓어졌고, 그 다음 단계로는 개발자가 자주 복붙하는 한 줄짜리 key/token 문자열의 provider/format 후보를 빠르게 식별하는 작은 utility가 가장 작고 재사용 가치가 높았기 때문
- 사용자 영향: 허브 메인에서 `API 키 형식 판별기` 카드로 이동해 AWS/GitHub/Google/Stripe/Telegram/Slack 계열 key/token의 known prefix/pattern 기반 provider/format 후보를 로컬에서 빠르게 확인할 수 있음
- 기술 변경:
  - `src/lib/api-key-format-tools.ts` 생성, bounded pattern table + masked preview helper 추가
  - `src/components/api-key-format-inspector.tsx` 생성, textarea 입력 + inspect/clear UI와 classification panel 구현
  - `app/services/api-key-format-inspector/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `api-key-format-inspector` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `API 키 형식 판별기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `api key`/`github`/`aws`/`google`/`stripe`/`telegram`/`slack` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/api-key-format-tools.ts`, `src/components/api-key-format-inspector.tsx`, `app/services/api-key-format-inspector/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 AWS/Google/GitHub/Stripe/Telegram/Slack sample, ambiguous unknown case, blank input, raw CR/LF multiline rejection, short-preview masking 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/api-key-format-inspector` → 200 확인, 홈/실험실/search HTML에 `API 키 형식 판별기`, `/services/api-key-format-inspector` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 GitHub detection, Telegram detection, unknown handling, multiline rejection, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 bounded matcher/unknown fallback은 safe 판정했고, result panel은 raw secret을 재출력하지 않으며 changelog wording은 `pattern-based candidate identification` 기준으로 유지해야 한다는 caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 known prefix/pattern 기반 candidate identification에만 집중하며 실제 유효성, 소유권, 권한, provider 연결 여부는 검증하지 않음
  - `high`/`medium` confidence는 형식 추정 강도를 의미할 뿐 provider authenticity를 증명하지 않음
  - 입력값은 결과 패널에 raw secret 전체를 다시 보여 주지 않지만, 사용자가 입력한 textarea에는 그대로 남아 있음

## 2026-03-12 12:08
- 요약: 허브에 로컬 전용 공개키 요약기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster의 certificate/CSR inspect 흐름이 이미 이어졌고, 그 다음 단계로는 secret material을 다루지 않으면서도 같은 PKI 흐름에 자연스럽게 붙는 single PEM public key inspect utility를 추가하는 편이 가장 작고 안전한 확장이었기 때문
- 사용자 영향: 허브 메인에서 `공개키 요약기` 카드로 이동해 단일 PEM `BEGIN PUBLIC KEY`의 알고리즘, 키 세부 정보, SPKI byte length, SHA-256 fingerprint를 바로 확인하고 복사할 수 있음
- 기술 변경:
  - `src/lib/public-key-tools.ts` 생성, 단일 PEM `PUBLIC KEY` gating + SPKI summary + fingerprint helper 추가
  - `src/components/public-key-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
  - `app/services/public-key-inspector/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `public-key-inspector` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `공개키 요약기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `public-key`/`spki`/`rsa`/`ec` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/public-key-tools.ts`, `src/components/public-key-inspector.tsx`, `app/services/public-key-inspector/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 OpenSSL-generated valid RSA public key, valid EC public key, blank input, malformed PEM, certificate rejection, CSR rejection, private key rejection, multi-PEM rejection 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/public-key-inspector` → 200 확인, 홈/실험실/search HTML에 `공개키 요약기`, `/services/public-key-inspector` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 valid RSA flow, valid EC curve detail, certificate rejection, private key rejection, fingerprint copy, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 PEM gating, SPKI parsing, fingerprint path는 safe 판정했고, algorithm label은 WebCrypto/library-derived practical name이며 SPKI byte length는 key strength 자체가 아니라는 wording caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 단일 PEM `BEGIN PUBLIC KEY` 요약에만 집중하며 private key parsing, key-pair matching, SSH key/JWK import, sign/verify, trust validation은 포함하지 않음
  - `RSA PUBLIC KEY` 같은 legacy PEM variant와 non-PEM SSH public key는 이번 MVP에서 지원하지 않음
  - 표시되는 알고리즘 이름은 library/WebCrypto 기준 practical label이며 canonical ASN.1 key-type taxonomy와 완전히 같지 않을 수 있음

## 2026-03-12 11:36
- 요약: 허브에 로컬 전용 CSR 요약기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster의 certificate inspect 흐름이 막 생겼고, 다음 단계로는 인증서 바로 앞 단계 artifact인 단일 PEM PKCS#10 CSR을 읽는 inspect utility를 추가하는 편이 가장 작고 자연스러운 확장이었기 때문
- 사용자 영향: 허브 메인에서 `CSR 요약기` 카드로 이동해 단일 PEM PKCS#10 CSR의 subject, SAN, 공개키 메타데이터, requested extension 수, self-signature 상태, SHA-256 공개키 fingerprint를 바로 확인하고 복사할 수 있음
- 기술 변경:
  - `src/lib/csr-tools.ts` 생성, 단일 PEM CSR gating + PKCS#10 summary + SPKI fingerprint helper 추가
  - `src/components/csr-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
  - `app/services/csr-inspector/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `csr-inspector` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `CSR 요약기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `csr`/`certificate-request`/`pkcs10` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/csr-tools.ts`, `src/components/csr-inspector.tsx`, `app/services/csr-inspector/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 OpenSSL-generated valid CSR, blank input, malformed PEM, certificate PEM rejection, key PEM rejection, multi-CSR rejection 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/csr-inspector` → 200 확인, 홈/실험실/search HTML에 `CSR 요약기`, `/services/csr-inspector` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 valid CSR summary, 공개키 fingerprint copy, certificate rejection, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 PEM gating, CSR parsing, SAN extraction, SPKI fingerprint path는 safe 판정했고, requested extension wording과 self-signature status wording caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 단일 PEM PKCS#10 CSR 요약에만 집중하며 certificate issuance validation, CA acceptance 여부, challenge password deep inspection, uncommon CSR attribute decoding, multi-CSR bundle parsing은 포함하지 않음
  - SAN과 extension 정보는 CSR이 요청한 내용이며, 실제 발급된 인증서의 확정 결과를 의미하지 않음
  - `signatureStatus`는 로컬 브라우저에서 CSR self-signature가 public key와 일치하는지 보는 cryptographic check일 뿐, 신뢰성이나 소유권 검증 결과를 의미하지 않음

## 2026-03-12 11:02
- 요약: 허브에 로컬 전용 인증서 요약기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster의 generate/inspect utility는 이미 충분히 유용해졌지만, 다음 단계로는 개발자가 copy/paste한 PEM 인증서를 빠르게 읽는 single-certificate inspect tool 하나를 더하는 편이 가장 작고 재사용 가치가 높았기 때문
- 사용자 영향: 허브 메인에서 `인증서 요약기` 카드로 이동해 단일 PEM X.509 인증서의 subject, issuer, serial, validity, SAN, 공개키 메타데이터, SHA-256 fingerprint를 바로 확인하고 복사할 수 있음
- 기술 변경:
  - `package.json`, `pnpm-lock.yaml`에 `@peculiar/x509` 추가
  - `src/lib/certificate-tools.ts` 생성, 단일 PEM gating + X.509 summary + DER fingerprint helper 추가
  - `src/components/certificate-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 summary panel 구현
  - `app/services/certificate-inspector/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `certificate-inspector` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `인증서 요약기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `certificate`/`cert`/`x509`/`pem`/`tls`/`ssl`/`fingerprint` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/certificate-tools.ts`, `src/components/certificate-inspector.tsx`, `app/services/certificate-inspector/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 OpenSSL-generated valid PEM, malformed PEM, CSR PEM rejection, key PEM rejection, multi-cert rejection 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/certificate-inspector` → 200 확인, 홈/실험실/search HTML에 `인증서 요약기`, `/services/certificate-inspector` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 valid PEM summary, fingerprint copy, CSR rejection, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 DER fingerprint path와 PEM gating은 safe 판정했고, signature label은 family-level naming이며 validity status는 local browser time 기준이라는 wording caveat를 확인함
- 리스크 / 제한사항:
  - 이번 단계는 단일 PEM X.509 인증서 요약에만 집중하며 CSR parsing, chain build, trust validation, hostname matching, OCSP/CRL, multi-cert bundle parsing은 포함하지 않음
  - SAN 표시는 common GeneralName 위주이며, uncommon SAN variants는 파싱 라이브러리 제한에 따라 거절되거나 축약 표시될 수 있음
  - validity 상태는 로컬 브라우저 시각 기준이며, 실제 trust validation 결과를 의미하지 않음

## 2026-03-12 10:07
- 요약: 허브에 로컬 전용 HMAC 생성기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 `encoding-security` cluster가 이미 충분히 두꺼워졌지만, `sha256-generator`와 `secret-generator` 다음 단계로는 실제 API/webhook 서명 테스트에 바로 쓰이는 keyed hash utility 하나를 더하는 편이 가장 작고 재사용 가치가 높았기 때문
- 사용자 영향: 허브 메인에서 `HMAC 생성기` 카드로 이동해 메시지와 시크릿의 exact UTF-8 입력으로 HMAC-SHA-256/384/512 hex digest를 바로 생성하고 복사할 수 있음
- 기술 변경:
  - `src/lib/hmac-tools.ts` 생성, exact UTF-8 input + Web Crypto HMAC helper 추가
  - `src/components/hmac-generator.tsx` 생성, message/secret textarea + algorithm selector + generate/reset/copy UI 구현
  - `app/services/hmac-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `hmac-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `HMAC 생성기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `hmac`/`mac`/`signature` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/hmac-tools.ts`, `src/components/hmac-generator.tsx`, `app/services/hmac-generator/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 SHA-256/384/512 known vector, exact whitespace case, exact Unicode case, blank secret rejection, blank message rejection, invalid algorithm rejection, no-crypto path 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/hmac-generator` → 200 확인, 홈/실험실/search HTML에 `HMAC 생성기`, `/services/hmac-generator` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 default digest, SHA-512 switch, exact whitespace digest, copy, reset-to-defaults, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 exact UTF-8 wording과 reset-to-defaults caveat를 확인했고 코드 변경 없이 finalize safe 판정 확인
- 리스크 / 제한사항:
  - 이번 단계는 text secret + text message 입력을 UTF-8로 그대로 인코딩해 hex digest를 생성하는 MVP이며 verify mode, decoded secret mode, provider preset은 포함하지 않음
  - `지우기` 동작은 빈 상태가 아니라 기본 예시값으로 초기화하는 reset behavior임

## 2026-03-12 09:26
- 요약: 허브에 로컬 전용 TOTP 코드 해석기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 discovery surface는 이미 충분히 두꺼웠고, `encoding-security` cluster 다음 단계로는 `otpauth://totp/...` URI를 실제로 해석하고 현재 코드를 계산해 보는 작은 inspect utility가 가장 작고 유용한 다음 후보였기 때문
- 사용자 영향: 허브 메인에서 `TOTP 코드 해석기` 카드로 이동해 `otpauth://totp/...` URI의 issuer/account/algorithm/digits/period를 확인하고 현재 TOTP 코드를 바로 계산/복사할 수 있음
- 기술 변경:
  - `src/lib/totp-tools.ts` 생성, TOTP URI parser + Base32 decoder + Web Crypto HMAC 기반 code generator 추가
  - `src/components/totp-inspector.tsx` 생성, textarea 입력 + inspect/clear/copy UI와 metadata/code panel 구현
  - `app/services/totp-inspector/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `totp-inspector` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `TOTP 코드 해석기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 `totp`/`otp`/`otpauth` 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/totp-tools.ts`, `src/components/totp-inspector.tsx`, `app/services/totp-inspector/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 valid parse, HOTP rejection, invalid base32 rejection, invalid base32 length rejection, RFC 6238 SHA1/SHA256/SHA512 vector, no-crypto path 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/totp-inspector` → 200 확인, 홈/실험실/search HTML에 `TOTP 코드 해석기`, `/services/totp-inspector` 노출 확인
  - 초기 browser verification에서 valid TOTP flow, copy, HOTP rejection, clear reset, 모바일 표시 확인
  - Oracle review에서 Base32 strictness edge를 지적했고, malformed secret 길이와 leftover-bit 검증을 helper에 추가한 뒤 helper/build/route 검증 재통과 확인
- 리스크 / 제한사항:
  - 이번 단계는 `otpauth://totp/...` 기반 inspect/copy에만 집중하며 HOTP, QR 스캔, 카메라 입력, 여러 계정 관리, 저장 기능은 포함하지 않음
  - tolerant issuer consistency check나 full authenticator-app behavior는 이번 MVP에 포함하지 않음

## 2026-03-12 08:29
- 요약: 허브에 로컬 전용 시크릿 생성기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 recent/pinned/family discovery는 이미 충분했고, 그 다음으로는 `password-generator`, `ulid-generator`, `uuid-generator`와 자연스럽게 이어지는 adjacent security utility 하나를 더하는 편이 가장 작고 유용한 다음 단계였기 때문
- 사용자 영향: 허브 메인에서 `시크릿 생성기` 카드로 이동해 앱 설정용 opaque secret을 `hex`, `base64url`, `base64` 형식으로 바로 생성하고 복사할 수 있음
- 기술 변경:
  - `src/lib/secret-generator-tools.ts` 생성, bounded byte-length validation + deterministic encoding helper 추가
  - `src/components/secret-generator.tsx` 생성, byte length/form selector + generate/clear/copy UI 구현
  - `app/services/secret-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `secret-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `시크릿 생성기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 secret/token/key 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/secret-generator-tools.ts`, `src/components/secret-generator.tsx`, `app/services/secret-generator/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 deterministic `hex`, `base64url`, `base64` 출력, blank/non-integer/out-of-range 길이 오류, injected byte-length mismatch, invalid format rejection, no-crypto path 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/secret-generator` → 200 확인, 홈/실험실/search HTML에 `시크릿 생성기`, `/services/secret-generator` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 default generate, format switching, invalid length error, copy 성공, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 runtime format guard와 wording caveat를 지적했고, helper에 explicit format rejection을 추가하고 metadata wording을 `출력 형식` 기준으로 정리한 뒤 helper/build 검증 재통과 확인
- 리스크 / 제한사항:
  - 이번 단계는 단일 시크릿 생성과 복사만 지원하며 provider-specific API key 형식, prefix, batch generation, persistence는 포함하지 않음
  - byte-length parser는 현재 `Number()` 기반이라 decimal-only 입력만 엄격히 허용하지는 않음

## 2026-03-12 07:43
- 요약: 허브에 로컬 전용 ULID 생성기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 parser/builder/converter cluster와 discovery layer는 이미 충분히 넓어져 있었고, 그 다음으로는 방금 추가한 `비밀번호 생성기`와 자연스럽게 이어지는 adjacent security/identifier utility 하나를 더하는 편이 가장 작고 유용한 다음 단계였기 때문
- 사용자 영향: 허브 메인에서 `ULID 생성기` 카드로 이동해 시간 정렬 가능한 ULID를 바로 생성하고 복사할 수 있음
- 기술 변경:
  - `src/lib/ulid-tools.ts` 생성, dependency-free ULID helper와 deterministic validation path 추가
  - `src/components/ulid-generator.tsx` 생성, generate/clear/copy UI와 timestamp metadata 패널 구현
  - `app/services/ulid-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `ulid-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `ULID 생성기`를 `승격 완료`와 실제 링크로 반영
  - `src/lib/search-discovery.ts`의 `encoding-security` family 설명과 query를 ULID 기준으로 보강
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/ulid-tools.ts`, `src/components/ulid-generator.tsx`, `app/services/ulid-generator/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx`, `src/lib/search-discovery.ts` 모두 `No diagnostics found`
  - helper-level verification에서 zero ULID, valid generated ULID, invalid leading char rejection, bad timestamp, bad random byte length, no-crypto path 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/ulid-generator` → 200 확인, 홈/실험실/search HTML에 `ULID 생성기`, `/services/ulid-generator` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 generate, copy, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
  - Oracle review에서 exported validator의 leading-character edge를 지적했고, `isUlid`를 spec-safe regex로 조정 후 helper/build 검증 재통과 확인
- 리스크 / 제한사항:
  - 이번 단계는 단일 ULID 생성과 복사만 지원하며 monotonic ULID, batch generation, decode/inspect 기능은 포함하지 않음
  - 같은 millisecond 안에서 생성 순서까지 strictly increasing 하도록 보장하는 monotonic variant는 이번 MVP에 포함하지 않음

## 2026-03-12 06:58
- 요약: 허브에 로컬 전용 비밀번호 생성기 신규 서비스 추가
- 변경 이유: current repo state 기준으로 parser/builder/converter cluster와 discovery layer는 이미 충분히 넓어져 있었고, 그 다음으로는 바로 다시 쓰게 될 가능성이 높은 standalone security utility 하나를 추가하는 편이 더 적합했기 때문
- 사용자 영향: 허브 메인에서 `비밀번호 생성기` 카드로 이동해 길이와 문자 종류를 선택하고, 선택한 문자 그룹이 모두 포함된 비밀번호를 바로 생성/복사할 수 있음
- 기술 변경:
  - `src/lib/password-generator-tools.ts` 생성, 길이 검증 + 문자 그룹 보장 + browser crypto 기반 랜덤 선택 helper 추가
  - `src/components/password-generator.tsx` 생성, 길이 입력 + 문자 그룹 체크박스 + generate/clear/copy UI 구현
  - `app/services/password-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `password-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `비밀번호 생성기`를 `승격 완료`와 실제 링크로 반영
  - `app/globals.css`에 password option card 스타일 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/password-generator-tools.ts`, `src/components/password-generator.tsx`, `app/services/password-generator/page.tsx`, `src/lib/service-registry.ts`, `app/services/experiments/page.tsx` 모두 `No diagnostics found`
  - `app/globals.css`는 biome 미설치로 LSP diagnostics unavailable이지만, `pnpm lint`와 `pnpm build`는 통과
  - helper-level verification에서 `12자 소문자 only`, `16자 대/소문자+숫자`, `20자 전체 그룹`, `7자 오류`, `65자 오류`, `문자 그룹 미선택 오류` 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/password-generator` → 200 확인, 홈/실험실/search HTML에 `비밀번호 생성기`, `/services/password-generator` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 default generate, no-group validation error, 20자 generation, copy 성공, clear reset, 모바일 표시 확인
  - browser verification 기준 runtime exception 및 captured browser error 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 단일 비밀번호 생성과 복사만 지원하며 strength meter, history, presets, bulk generation은 포함하지 않음
  - browser `crypto.getRandomValues`에 의존하므로 해당 API가 없는 환경에서는 fallback 없이 오류를 반환함

## 2026-03-12 05:13
- 요약: 허브에 로컬 전용 포모도로 타이머 신규 서비스 추가
- 변경 이유: 현재 허브는 parser/builder/converter 도구가 충분히 넓어졌고, 그 다음 단계로는 반복 사용 가치가 높은 작은 productivity 서비스 하나를 더하는 편이 현재 단계에 더 적합했기 때문
- 사용자 영향: 허브 메인에서 `포모도로 타이머` 카드로 이동해 focus/break 분 단위 타이머를 시작/일시정지/초기화/단계 건너뛰기로 사용할 수 있음
- 기술 변경:
  - `src/lib/pomodoro-timer-tools.ts` 생성, bounded minute validation + pure phase transition helper 추가
  - `src/components/pomodoro-timer.tsx` 생성, focus/break input + start/pause/reset/skip UI와 countdown 구현
  - `app/services/pomodoro-timer/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `pomodoro-timer` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `포모도로 타이머`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - helper-level verification에서 `25:00` formatting, invalid minute rejection, focus→break, break→focus transition 확인
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/pomodoro-timer` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `포모도로 타이머`, `/services/pomodoro-timer` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 countdown 감소, pause freeze, skip to break, reset to focus, invalid minute error, mobile 표시 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 current-tab local timer만 제공하며 persistence, notifications, audio, long-break cadence, analytics는 포함하지 않음
  - background tab throttling이나 browser timer precision 변화에 따른 초 단위 drift는 이번 MVP에서 별도 보정하지 않음

## 2026-03-12 04:20
- 요약: 허브에 로컬 전용 URL 파서 신규 서비스 추가
- 변경 이유: 현재 허브에는 raw query parser/builder와 full URL builder는 있지만, 붙여 넣은 full URL을 read-side로 구조화해서 보여 주는 역방향 도구는 아직 없어 URL workflow cluster가 완전히 닫혀 있지 않았기 때문
- 사용자 영향: 허브 메인에서 `URL 파서` 카드로 이동해 absolute URL의 origin, pathname, hash, query rows, normalized URL을 확인하고 바로 복사 가능
- 기술 변경:
  - `src/lib/url-parser-tools.ts` 생성, absolute URL parser helper 추가
  - `src/components/url-parser.tsx` 생성, parse/clear/copy UI와 parsed URL parts 렌더링 구현
  - `app/services/url-parser/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `url-parser` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `URL 파서`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/url-parser` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `URL 파서`, `/services/url-parser` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 valid URL parse 성공, zero-query parse 성공, invalid absolute URL 오류, invalid percent-decoding 오류, copy 성공, clear reset, mobile 표시 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 absolute URL만 지원하며 relative URL, credential-bearing URL, parser/builder round-trip sync는 지원하지 않음
  - browser `URL` API canonicalization에 따라 기본 포트, raw `+` vs `%20`, percent-encoding case 같은 byte-level 표현은 그대로 유지되지 않을 수 있음

## 2026-03-12 03:37
- 요약: 홈/검색에 semantic tool family discovery layer 추가
- 변경 이유: 현재 허브는 standalone utilities와 parser/builder pair가 충분히 늘어나면서 대부분이 `productivity` 카테고리로 뭉쳐 있어, category/tag만으로는 intent-based discovery가 점점 덜 유용해지고 있었기 때문
- 사용자 영향: 홈의 `도구 묶음으로 찾기`와 검색의 `도구 묶음으로 둘러보기` 섹션에서 관련 서비스들을 semantic family 기준으로 더 쉽게 다시 찾을 수 있음
- 기술 변경:
  - `src/types/service.ts`에 서비스의 primary `family` 필드 추가
  - `src/lib/service-registry.ts`의 모든 서비스에 단일 family 메타데이터 부여
  - `src/lib/search-discovery.ts`에 family 정의와 `getFamilySummaries()` 추가
  - `src/lib/home-discovery.ts`에 `getHomeFamilyBundles()` 추가
  - `app/page.tsx`에 `도구 묶음으로 찾기` 섹션 추가
  - `app/services/search/page.tsx`에 `도구 묶음으로 둘러보기` 섹션 추가
  - `app/globals.css`에서 home tool families section spacing을 기존 guided/home section 흐름에 통합
- 검증:
  - `lsp_diagnostics` 기준 `src/types/service.ts`, `src/lib/service-registry.ts`, `src/lib/search-discovery.ts`, `src/lib/home-discovery.ts`, `app/page.tsx`, `app/services/search/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - 홈/검색 HTML에 `도구 묶음으로 찾기`, `도구 묶음으로 둘러보기`, `구조화 데이터`, `URL · Query`, `공유 · 출력` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 home family cards 4개 visible, search family card grid visible, family query link 동작, 모바일 폭 390 기준 section/card visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 서비스당 single primary family만 지원하며, 다중 family tagging이나 user-custom grouping은 포함하지 않음
  - family taxonomy는 registry-driven 이지만 hand-curated 분류이므로 새로운 서비스 추가 시 family drift가 생기지 않도록 함께 갱신해야 함

## 2026-03-12 01:42
- 요약: 허브에 로컬 전용 Lorem Ipsum 생성기 신규 서비스 추가
- 변경 이유: current repo state 기준 discovery layer는 recent/pinned까지 이미 충분했고, 그 다음으로는 바로 쓰기 쉬운 standalone deterministic utility 하나를 더하는 편이 더 적합했기 때문
- 사용자 영향: 허브 메인에서 `Lorem Ipsum 생성기` 카드로 이동해 paragraph, sentence, word 단위 placeholder text를 생성하고 바로 복사 가능
- 기술 변경:
  - `src/lib/lorem-ipsum-tools.ts` 생성, fixed internal corpus 기반 deterministic generator helper 추가
  - `src/components/lorem-ipsum-generator.tsx` 생성, mode selector + count input + generate/clear/copy UI 구현
  - `app/services/lorem-ipsum-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `lorem-ipsum-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `Lorem Ipsum 생성기`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/lorem-ipsum-generator` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `Lorem Ipsum 생성기`, `/services/lorem-ipsum-generator` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 paragraphs/sentences/words 생성 성공, copy 성공, invalid count 오류, clear reset, mobile 표시 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 fixed internal corpus 기반 deterministic output만 제공하며 random generation, custom dictionary, markdown/html output은 지원하지 않음
  - 생성 개수는 1~20으로 제한해 지나치게 큰 placeholder payload 생성은 막음

## 2026-03-12 01:10
- 요약: 허브에 로컬 전용 QR 코드 생성기 신규 서비스 추가
- 변경 이유: 현재 허브는 parser/builder/converter 도구가 충분히 넓어졌고 discovery 개선도 한 단계 진행된 상태라, 다음 단계로는 바로 이해되고 반복 사용 가치가 높은 standalone utility 하나를 추가하는 편이 더 적합했기 때문
- 사용자 영향: 허브 메인에서 `QR 코드 생성기` 카드로 이동해 텍스트를 QR 코드 이미지로 생성하고 원문 복사 및 PNG 다운로드 가능
- 기술 변경:
  - `package.json`과 lockfile에 `qrcode`, `@types/qrcode` 추가
  - `src/lib/qr-code-tools.ts` 생성, bounded text payload 기반 QR data URL helper 추가
  - `src/components/qr-code-generator.tsx` 생성, textarea + generate/clear/copy/download UI 구현
  - `app/services/qr-code-generator/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `qr-code-generator` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `QR 코드 생성기`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/qr-code-generator` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `QR 코드 생성기`, `/services/qr-code-generator` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 기본 URL 입력 QR 생성 성공, 원문 copy 성공, 512자 초과 오류, stale copy reset, clear reset, 모바일 이미지 표시 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 bounded text payload + PNG preview/download만 지원하며 색상/크기/custom error correction 설정은 포함하지 않음
  - payload가 너무 길면 생성 품질과 스캔 안정성이 떨어지므로 이번 MVP는 512자 제한으로 고정함

## 2026-03-12 00:31
- 요약: 허브에 로컬 전용 지속 시간 휴머나이저 신규 서비스 추가
- 변경 이유: 현재 utility cluster에는 timestamp와 cron 관련 도구는 충분히 있었지만, 순수 duration 값을 compact human-readable string으로 바꾸는 작은 시간 표현 도구는 아직 없었고, 이는 다음 가장 자연스러운 시간 유틸리티 확장 지점이었기 때문
- 사용자 영향: 허브 메인에서 `지속 시간 휴머나이저` 카드로 이동해 숫자 duration과 단위를 `1d 2h 3m 4s` 같은 compact 출력으로 변환하고 바로 복사 가능
- 기술 변경:
  - `src/lib/duration-humanizer-tools.ts` 생성, numeric duration + unit 기반 deterministic helper 추가
  - `src/components/duration-humanizer.tsx` 생성, textarea + unit selector + convert/clear/copy UI 구현
  - `app/services/duration-humanizer/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `duration-humanizer` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `지속 시간 휴머나이저`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/duration-humanizer` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `지속 시간 휴머나이저`, `/services/duration-humanizer` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 `93784 seconds → 1d 2h 3m 4s`, `1500 milliseconds → 1s 500ms`, `1.5 hours → 1h 30m`, `0 milliseconds → 0ms`, copy 성공, blank/negative/invalid 오류, clear reset, mobile 표시 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 numeric input + explicit unit selector만 지원하며 자연어 parsing, ISO-8601 duration, 상대 시간 표현, 음수 duration은 포함하지 않음
  - 출력은 compact deterministic format으로 고정되며 localized grammar variants는 지원하지 않음

## 2026-03-11 18:05
- 요약: 허브에 로컬 전용 XML 포맷터/검증기 신규 서비스 추가
- 변경 이유: 현재 structured-text utility cluster는 JSON/YAML/TOML까지는 충분히 넓어졌지만, XML에 대한 기본 포맷/검증 도구는 아직 없었고, 이 공백이 다음 가장 자연스러운 확장 지점이었기 때문
- 사용자 영향: 허브 메인에서 `XML 포맷터/검증기` 카드로 이동해 XML 문자열을 검증하고 pretty-print 결과를 확인/복사 가능
- 기술 변경:
  - `src/lib/xml-tools.ts` 생성, well-formed XML validation + deterministic pretty-print helper 추가
  - `src/components/xml-formatter.tsx` 생성, textarea + format/validate/clear/copy UI 구현
  - `app/services/xml-formatter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `xml-formatter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `XML 포맷터/검증기`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/xml-formatter` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `XML 포맷터/검증기`, `/services/xml-formatter` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 valid XML pretty-print 성공, invalid XML 오류, copy 성공, clear reset, mobile 표시 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 well-formed XML validation과 pretty-print에만 집중하며 DTD, ENTITY, schema validation, advanced XML feature coverage는 포함하지 않음
  - 브라우저의 `DOMParser`/`XMLSerializer` 동작에 의존하므로 browser-only helper이며, 서버 컴포넌트에서 직접 사용하지 않도록 주의가 필요함

## 2026-03-11 16:53
- 요약: 서비스 상세 화면 pin과 홈의 고정한 서비스 섹션 추가
- 변경 이유: 최근 사용한 서비스는 시간 기반 재방문에는 유용하지만, 사용자가 의도적으로 오래 유지하고 싶은 도구를 durable 하게 고정하는 계층은 아직 없었고, 이는 이미 충분히 커진 허브에서 다음 체감 가치가 큰 discovery gap이었기 때문
- 사용자 영향: 실제 서비스 상세 화면에서 `홈에 고정`/`고정 해제`를 눌러 자주 쓰는 도구를 홈 상단 `고정한 서비스` 섹션에 유지 가능
- 기술 변경:
  - `src/lib/pinned-services.ts` 생성, pinned slug parse/toggle/resolve helper 추가
  - `src/components/pin-service-button.tsx` 생성, localStorage 기반 pin toggle 구현
  - `src/components/pinned-services.tsx` 생성, 홈의 pinned services 섹션 렌더링 구현
  - `src/components/service-page-pin-control.tsx` 생성, 실제 `/services/*` route에서 pin control을 공통 mount 하도록 구현
  - `app/layout.tsx`에 `ServicePagePinControl` mount 추가
  - `app/services/[slug]/page.tsx`에서 generic page 전용 pin mount 제거, `app/page.tsx`에 `고정한 서비스` 섹션 추가, `app/globals.css`에 pinned section/button 스타일 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/pinned-services.ts`, `src/components/pin-service-button.tsx`, `src/components/pinned-services.tsx`, `src/components/service-page-pin-control.tsx`, `app/layout.tsx`, `app/page.tsx`, `app/services/[slug]/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/` 및 `http://localhost:80/services/url-builder` → 200 확인
  - 실제 headless Chrome + DevTools protocol에서 `/services/url-builder`에서 `홈에 고정` 노출, pin 후 localStorage가 `["url-builder"]`로 저장되고 home `고정한 서비스` 섹션에 `URL 빌더` 카드 노출, `/services/search`에는 pin button 미노출, unpin 후 storage가 `[]`로 초기화되는 흐름 확인
  - 모바일 폭 390 기준 pinned section/card visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 localStorage 기반 pinning만 제공하며 browser/device 간 동기화는 지원하지 않음
  - meta surface(`search`, `hub-intro`, `release-log`, `experiments`)는 pin 대상에서 제외됨

## 2026-03-11 15:51
- 요약: 홈 화면에 최근 사용한 서비스 섹션 추가
- 변경 이유: 허브에 서비스 수가 충분히 쌓인 현재 시점에는 또 하나의 작은 유틸리티를 더하는 것보다, 이미 있는 도구로 빠르게 돌아가는 time-based discovery를 추가하는 편이 더 큰 체감 가치를 줄 수 있었기 때문
- 사용자 영향: 홈 화면에서 실제로 최근 열어본 서비스들을 `최근 사용한 서비스` 섹션으로 다시 빠르게 열 수 있음
- 기술 변경:
  - `src/lib/recent-services.ts` 생성, recent slug parsing/dedupe/limit/filter helper 추가
  - `src/components/recent-service-tracker.tsx` 생성, `/services/*` 방문을 localStorage에 기록하도록 구현
  - `src/components/recently-used-services.tsx` 생성, 최근 사용 서비스 카드 섹션 렌더링 구현
  - `app/layout.tsx`에 tracker mount 추가
  - `app/page.tsx`에 `최근 사용한 서비스` 섹션 추가
  - `app/globals.css`에 home section spacing 보강
- 검증:
  - `lsp_diagnostics` 기준 새 helper/components 및 `app/layout.tsx`, `app/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/` → 200 확인, 기존 홈 섹션 유지 확인
  - 실제 headless Chrome + DevTools protocol에서 `/services/url-builder` → `/services/number-formatter` → `/services/search` → `/services/query-string-parser` 방문 후 home localStorage가 `["query-string-parser","number-formatter","url-builder"]`로 기록되고, `최근 사용한 서비스` 섹션에 해당 카드만 노출됨 확인
  - 같은 브라우저 검증에서 `허브 검색`, `릴리즈 로그` 같은 meta surface는 recent list에 포함되지 않음 확인
  - 모바일 폭 390 기준 section/card visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 localStorage 기반 최근 사용 추적만 제공하며 favorites/pinning/sync 기능은 포함하지 않음
  - 최근 사용 섹션은 클라이언트에서만 계산되므로 SSR HTML에는 직접 포함되지 않음

## 2026-03-11 15:15
- 요약: 허브에 로컬 전용 URL 빌더 신규 서비스 추가
- 변경 이유: 기존 `쿼리 문자열 파서/빌더`가 raw query 수준까지만 다루고 있어 실제 full URL 조합 흐름이 허브 안에서 아직 완성되지 않았고, 이는 현재 deterministic utility 확장 흐름에서 가장 작은 workflow gap이었기 때문
- 사용자 영향: 허브 메인에서 `URL 빌더` 카드로 이동해 base URL, path, query rows, hash를 조합한 full URL을 생성하고 바로 복사 가능
- 기술 변경:
  - `src/lib/url-builder-tools.ts` 생성, base URL/path/query/hash 조합 helper 추가
  - `src/components/url-builder.tsx` 생성, form 입력 + query row 편집 + build/clear/copy UI 구현
  - `app/services/url-builder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `url-builder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `URL 빌더`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/url-builder` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `URL 빌더`, `/services/url-builder` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 canonical full URL 성공, copy 성공, invalid base URL 오류, blank key 오류, clear reset, mobile 표시 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 full URL composition만 제공하며 parser round-trip sync, pre-encoded input handling 고도화, nested query semantics는 지원하지 않음
  - query encoding 정책은 기존 query-string builder와 동일하게 `encodeURIComponent` 기반으로 고정함

## 2026-03-11 14:38
- 요약: 텍스트 비교 도구에 줄 단위 readable diff 출력 추가
- 변경 이유: 현재 `text-diff-checker`는 동일 여부와 첫 차이 위치만 보여 주어 실제로 어떤 줄이 달라졌는지 읽기 어렵다는 공백이 있었고, 이는 최근 요약에서 반복적으로 지목된 `diff-friendly formatter` 성격의 개선을 가장 작은 범위로 흡수할 수 있는 지점이었기 때문
- 사용자 영향: 허브의 `텍스트 비교 도구`에서 첫 차이 위치뿐 아니라 줄 단위 readable diff를 함께 확인 가능
- 기술 변경:
  - `src/lib/text-diff-tools.ts`에 line-based diff row model 추가
  - `src/components/text-diff-checker.tsx`에 same/changed/added/removed 상태별 diff row 렌더링 추가
  - `app/services/text-diff-checker/page.tsx` 안내 문구를 readable diff 기준으로 갱신
  - `app/globals.css`에 diff row/card/grid 스타일 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/lib/text-diff-tools.ts`, `src/components/text-diff-checker.tsx`, `app/services/text-diff-checker/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/text-diff-checker` → 200 확인, 제목/안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 different fixture 기준 `line 2, column 4`, changed row 1건, same fixture 기준 same rows 3건, 빈 입력 오류, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 diff row visible 및 diff columns stacked 확인
  - 최종 clean browser rerun 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 line-based readable diff에 집중하며 full git patch/unified diff export, trailing-space 표시, line-ending-only diff 유지 비교는 포함하지 않음
  - 현재 비교는 여전히 줄바꿈을 LF 기준으로 정규화한 뒤 수행하므로 CRLF-only 차이는 별도 줄바꿈 도구로 확인해야 함

## 2026-03-11 14:14
- 요약: 허브에 로컬 전용 쿼리 문자열 빌더 신규 서비스 추가
- 변경 이유: 기존 `쿼리 문자열 파서`를 실제로 다시 쓰게 만들기 위해서는 역방향 도구인 builder가 자연스러운 다음 단계였고, parser + builder 쌍을 맞추는 편이 현재 deterministic utility 확장 흐름에 가장 잘 맞았기 때문
- 사용자 영향: 허브 메인에서 `쿼리 문자열 빌더` 카드로 이동해 ordered key/value rows를 deterministic query string으로 생성하고 바로 복사 가능
- 기술 변경:
  - `src/lib/query-string-builder-tools.ts` 생성, ordered rows 기반 query string builder/helper 추가
  - `src/components/query-string-builder.tsx` 생성, row-based 입력 + add/remove/build/clear/copy UI 구현
  - `app/services/query-string-builder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `query-string-builder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `쿼리 문자열 빌더`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/query-string-builder` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `쿼리 문자열 빌더`, `/services/query-string-builder` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 canonical output(`page=1&sort=updated_at&tag=hub&tag=local&empty=`) 성공, duplicate preservation 확인, blank key 오류, stale copy state reset, clear reset, mobile 표시 확인
  - helper-level verification에서 multiline value 오류와 canonical output 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 raw query string builder만 제공하며 full URL builder, parser round-trip sync, nested query semantics는 지원하지 않음
  - encoding 정책은 `encodeURIComponent` 기반 deterministic output으로 고정하며 `+` vs `%20` toggle은 포함하지 않음

## 2026-03-11 13:33
- 요약: 허브에 로컬 전용 크론 빌더 신규 서비스 추가
- 변경 이유: 막 추가한 `크론 표현식 파서`를 실제로 다시 쓰게 만들기 위해서는 역방향 도구인 builder가 자연스러운 다음 단계였고, parser + builder 쌍을 맞추는 편이 현재 deterministic utility 확장 흐름에 가장 잘 맞았기 때문
- 사용자 영향: 허브 메인에서 `크론 빌더` 카드로 이동해 자주 쓰는 일정 패턴을 표준 5필드 cron 표현식으로 생성하고 바로 복사 가능
- 기술 변경:
  - `src/lib/cron-builder-tools.ts` 생성, 4가지 일정 모드 기반 cron builder/helper 추가
  - `src/components/cron-builder.tsx` 생성, 모드 기반 입력 + build/clear/copy UI 구현
  - `app/services/cron-builder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `cron-builder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `크론 빌더`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/cron-builder` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `크론 빌더`, `/services/cron-builder` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 `*/5 * * * *`, `30 9 * * *`, `0 9 * * 1-5`, `45 18 * * 0` 성공, invalid interval 오류, copy 성공, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 결과 패널과 copy 버튼 visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 4가지 일정 모드와 표준 5필드 cron만 지원하며 Quartz/macros/next-run 계산/timezone 처리는 포함하지 않음
  - monthly builder mode, advanced free-form editor, named aliases는 이번 단계에 포함하지 않음

## 2026-03-11 13:07
- 요약: 허브에 로컬 전용 ENV 빌더 신규 서비스 추가
- 변경 이유: 막 추가한 `ENV 파서`를 실제로 다시 쓰게 만들기 위해서는 역방향 도구인 builder가 자연스러운 다음 단계였고, parser + builder 쌍을 맞추는 편이 현재 deterministic utility 확장 흐름에 가장 잘 맞았기 때문
- 사용자 영향: 허브 메인에서 `ENV 빌더` 카드로 이동해 key/value 입력으로 deterministic `.env` 출력을 생성하고 바로 복사 가능
- 기술 변경:
  - `src/lib/env-builder-tools.ts` 생성, deterministic `.env` output builder/helper 추가
  - `src/components/env-builder.tsx` 생성, row-based key/value 입력 + build/clear/copy UI 구현
  - `app/services/env-builder/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `env-builder` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `ENV 빌더`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/env-builder` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `ENV 빌더`, `/services/env-builder` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 기본 행 build 성공, duplicate key 오류, invalid key 오류, stale copy state reset, clear reset, mobile 표시 확인
  - helper-level verification에서 multiline value 오류와 canonical output(`APP_NAME="Made by AI"` 등) 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 deterministic quoted output만 생성하며 `export`, interpolation, multiline values, import/editing workflow는 지원하지 않음
  - 값은 항상 double-quoted output으로 생성하므로 quote-style selection이나 inline comment semantics는 포함하지 않음

## 2026-03-11 12:36
- 요약: 허브에 로컬 전용 ENV 파서 신규 서비스 추가
- 변경 이유: 숫자 포맷터와 크론 표현식 파서까지 추가한 뒤에는, 개발자가 반복적으로 열어보는 `.env` 입력을 deterministic 하게 검사하고 구조화해 주는 작은 신규 서비스가 다음 확장 후보로 가장 적합했기 때문
- 사용자 영향: 허브 메인에서 `ENV 파서` 카드로 이동해 `.env` 스타일 입력을 key/value, duplicate 경고, JSON preview 형태로 확인 가능
- 기술 변경:
  - `src/lib/env-parser-tools.ts` 생성, local-only dotenv subset parser/helper 추가
  - `src/components/env-parser.tsx` 생성, textarea + 파싱/지우기/copy UI와 parsed rows/JSON preview 렌더링 구현
  - `app/services/env-parser/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `env-parser` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `ENV 파서`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/env-parser` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `ENV 파서`, `/services/env-parser` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 기본 예시 성공, duplicate key 경고 성공, invalid key 오류, unmatched quote 오류, JSON preview copy 성공, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 결과 패널과 copy 버튼 visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 full-line comment, basic `KEY=value`, single-line quoted value, duplicate warning만 지원하며 multiline, interpolation, export 문법은 지원하지 않음
  - normalized output은 assignment-only deterministic view이며 inline comment parsing이나 schema validation은 포함하지 않음

## 2026-03-11 12:02
- 요약: 허브에 로컬 전용 크론 표현식 파서 신규 서비스 추가
- 변경 이유: structured-text 변환 도구와 숫자 포맷터까지 추가한 뒤에는, 개발자가 반복적으로 확인하는 스케줄 표현식을 deterministic 하게 해석해 주는 작은 신규 서비스가 다음 확장 후보로 가장 적합했기 때문
- 사용자 영향: 허브 메인에서 `크론 표현식 파서` 카드로 이동해 표준 5필드 cron 표현식을 해석하고 각 필드 의미를 확인 가능
- 기술 변경:
  - `src/lib/cron-expression-tools.ts` 생성, 표준 5필드 cron subset parser/helper 추가
  - `src/components/cron-expression-parser.tsx` 생성, textarea + 해석/지우기/copy UI와 field-by-field explanation 렌더링 구현
  - `app/services/cron-expression-parser/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `cron-expression-parser` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `크론 표현식 파서`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/cron-expression-parser` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `크론 표현식 파서`, `/services/cron-expression-parser` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 `*/5 * * * *` 성공, `0 9 * * 1-5` 성공, `61 * * * *` 오류, `@daily` 오류, copy 성공, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 결과 패널과 copy 버튼 visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 표준 5필드 cron subset만 지원하며, Quartz 문법/매크로/next-run 계산/timezone 처리는 포함하지 않음
  - step syntax는 `*/n`, `a-b/n`만 지원하고 named month/day alias는 지원하지 않음

## 2026-03-11 11:29
- 요약: 허브에 로컬 전용 숫자 포맷터 신규 서비스 추가
- 변경 이유: structured-text 변환 도구를 연속으로 추가한 뒤에는 다른 범주의 deterministic utility 하나를 더 보강하는 편이 현재 단계에 더 적합했고, 숫자 포맷은 개발·문서·운영 맥락에서 반복 사용 가치가 높았기 때문
- 사용자 영향: 허브 메인에서 `숫자 포맷터` 카드로 이동해 숫자를 decimal/percent/currency 형식으로 locale 기준 포맷 가능
- 기술 변경:
  - `src/lib/number-format-tools.ts` 생성, explicit locale 기반 number formatting helper 추가
  - `src/components/number-formatter.tsx` 생성, 숫자 입력 + locale/currency/소수 자릿수 선택 + 포맷/지우기/copy UI 구현
  - `app/services/number-formatter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `number-formatter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `숫자 포맷터`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/number-formatter` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `숫자 포맷터`, `/services/number-formatter` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 decimal 성공, percent 성공, currency 성공, invalid number 오류, copy 성공, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 결과 패널과 copy 버튼 visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 explicit locale 선택 기반 decimal/percent/currency 포맷만 지원하며, compact/notation/unit formatting은 포함하지 않음
  - locale을 런타임 기본값에 맡기지 않고 고정 선택하도록 설계해 환경별 포맷 차이는 줄였지만, 지원 locale/currency 종류는 현재 제한적임

## 2026-03-11 11:00
- 요약: 허브에 로컬 전용 TOML ↔ JSON 변환기 신규 서비스 추가
- 변경 이유: `YAML ↔ JSON`까지 추가한 뒤에는 structured-text 변환 도구 묶음을 한 단계 더 넓히는 편이 AGENTS.md의 신규 기능/신규 서비스 우선 원칙에 더 잘 맞았고, TOML은 Python/Rust 설정 파일 흐름에서 반복 사용 가치가 높았기 때문
- 사용자 영향: 허브 메인에서 `TOML ↔ JSON 변환기` 카드로 이동해 TOML document와 JSON object를 서로 변환 가능
- 기술 변경:
  - `package.json`과 lockfile에 `@iarna/toml` dependency 추가
  - `src/lib/toml-json-tools.ts` 생성, deterministic TOML↔JSON helper 추가
  - `src/components/toml-json-converter.tsx` 생성, textarea + 양방향 변환/지우기/copy UI 구현
  - `app/services/toml-json-converter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `toml-json-converter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `TOML ↔ JSON 변환기`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/toml-json-converter` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `TOML ↔ JSON 변환기`, `/services/toml-json-converter` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 TOML→JSON 성공, JSON→TOML 성공, top-level array JSON 오류, JSON null 오류, copy 성공, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 결과 패널과 주요 버튼 visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 TOML document root와 JSON object root만 지원하며, JSON null, top-level array, TOML datetime/date/time 값은 지원하지 않음
  - TOML/JSON output은 deterministic formatting을 우선하며 comment preservation이나 broader TOML feature coverage는 포함하지 않음

## 2026-03-11 10:14
- 요약: 허브에 로컬 전용 YAML ↔ JSON 변환기 신규 서비스 추가
- 변경 이유: `JSON ↔ CSV`와 여러 copy-output UX 정리, `release-log` 가독성 보강까지 마친 시점에는 다음 deterministic 변환 유틸리티를 추가하는 편이 AGENTS.md의 신규 기능/신규 서비스 우선 원칙과 가장 잘 맞았기 때문
- 사용자 영향: 허브 메인에서 `YAML ↔ JSON 변환기` 카드로 이동해 JSON-compatible single-document YAML과 JSON을 서로 변환 가능
- 기술 변경:
  - `package.json`과 lockfile에 `yaml` dependency 추가
  - `src/lib/yaml-json-tools.ts` 생성, deterministic YAML↔JSON helper 추가
  - `src/components/yaml-json-converter.tsx` 생성, textarea + 양방향 변환/지우기/copy UI 구현
  - `app/services/yaml-json-converter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `yaml-json-converter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `YAML ↔ JSON 변환기`를 `승격 완료`와 실제 링크로 반영
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/yaml-json-converter` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `YAML ↔ JSON 변환기`, `/services/yaml-json-converter` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 YAML→JSON 성공, JSON→YAML 성공, multi-document YAML 오류, invalid JSON 오류, copy 성공, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 결과 패널과 주요 버튼 visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 single-document, JSON-compatible YAML만 지원하며 comments/anchors/aliases/merge keys/custom tags는 지원하지 않음
  - YAML/JSON output은 deterministic formatting을 우선하며 원본 formatting/comment preservation은 포함하지 않음

## 2026-03-11 09:49
- 요약: 릴리즈 로그 페이지에 최근 항목 강조와 이전 기록 카드형 정리 추가
- 변경 이유: 최근 몇 사이클 동안 신규 서비스와 출력 도구 UX를 계속 확장한 뒤에는, 현재 `ops/last-summary.md`에서 가장 먼저 지목한 허브 표면 보강 후보인 `release-log`를 더 읽기 쉽게 정리하는 편이 다음 작은 개선으로 적합했기 때문
- 사용자 영향: 허브의 `릴리즈 로그`에서 가장 최근 변경을 먼저 확인하고, 이전 기록도 카드형으로 더 쉽게 훑어볼 수 있음
- 기술 변경:
  - `app/services/release-log/page.tsx`에서 가장 최근 섹션을 hero 카드로 분리하고, 이전 기록을 카드 grid로 재구성
  - 중첩 bullet을 inline style 대신 `release-log-*` 클래스 기반으로 렌더링하도록 정리
  - `app/globals.css`에 release-log 전용 hero/card/list 스타일 추가
- 검증:
  - `lsp_diagnostics app/services/release-log/page.tsx` 기준 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/release-log` → 200 확인, `가장 최근 변경`, `이전 기록`, `누적 기록 수` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 데스크톱/모바일 모두 hero 카드, 이전 기록 grid, count card visible 확인
  - 같은 브라우저 검증에서 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `release-log` 표시 방식만 다루며, CHANGELOG 파싱 규칙 자체는 그대로 유지함
  - 항목 grouping 기준은 계속 `## ` 섹션 split 기반이므로, CHANGELOG 형식이 크게 바뀌면 별도 보완이 필요함

## 2026-03-11 09:25
- 요약: JSON↔CSV 변환기·UUID 생성기·SHA-256 생성기·슬러그 생성기에 결과 복사 UX 추가
- 변경 이유: JSON ↔ CSV 신규 서비스를 추가한 직후에는 또 다른 신규 서비스보다, 방금 늘어난 deterministic 출력 도구 묶음을 같은 복사 UX 패턴으로 빠르게 연결하는 편이 더 작은 변경으로 반복 사용 마찰을 줄이고 허브 사용 경험을 일관되게 만들 수 있었기 때문
- 사용자 영향: 허브의 `JSON ↔ CSV 변환기`, `UUID 생성기`, `SHA-256 생성기`, `슬러그 생성기`에서 생성/변환 결과를 버튼 한 번으로 복사하고, 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/json-csv-converter.tsx`에 `copyStatus` 상태와 `handleCopy` 추가, JSON→CSV/CSV→JSON 재실행과 지우기 시 복사 상태 초기화
  - `src/components/uuid-generator.tsx`에 `copyStatus`, `handleGenerate`, `handleClear`, `handleCopy` 추가
  - `src/components/sha256-generator.tsx`에 `copyStatus`, `handleCopy` 추가 및 재실행/지우기 시 상태 초기화
  - `src/components/slug-generator.tsx`에 `copyStatus`, `handleGenerate`, `handleClear`, `handleCopy` 추가
  - 각 대응 서비스 페이지(`app/services/json-csv-converter/page.tsx`, `app/services/uuid-generator/page.tsx`, `app/services/sha256-generator/page.tsx`, `app/services/slug-generator/page.tsx`) 안내에 결과 복사 가능 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 8개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/json-csv-converter`, `http://localhost:80/services/uuid-generator`, `http://localhost:80/services/sha256-generator`, `http://localhost:80/services/slug-generator` 모두 200 및 안내 문구 확인
  - 실제 headless Chrome + DevTools protocol에서 JSON↔CSV 결과 복사 성공, UUID 생성 후 복사 성공, SHA-256 해시 복사 성공, 슬러그 복사 성공 확인
  - 같은 브라우저 검증에서 stale copy state reset, error state no-copy, 모바일 폭 390 기준 slug 복사 버튼/result visible 확인
  - 최종 확인 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 출력값 복사 UX에만 집중하며, shared clipboard abstraction이나 추가 신규 서비스는 포함하지 않음
  - `json-csv-converter`의 CSV→JSON 결과는 계속 문자열 기반이며 타입 복원은 포함하지 않음

## 2026-03-11 08:42
- 요약: 허브에 로컬 전용 JSON ↔ CSV 변환기 신규 서비스 추가
- 변경 이유: 여러 결과형 도구의 복사 UX를 충분히 정리한 뒤에는 유지보수보다는 허브 안에서 다시 쓰게 될 가능성이 높은 다음 deterministic 유틸리티를 추가하는 편이, AGENTS.md의 신규 기능/신규 서비스 우선 원칙에 더 잘 맞았기 때문
- 사용자 영향: 허브 메인에서 `JSON ↔ CSV 변환기` 카드로 이동해 평면 객체 배열 JSON과 헤더 포함 CSV를 서로 변환 가능
- 기술 변경:
  - `src/lib/json-csv-tools.ts` 생성, flat object array JSON ↔ header-row CSV 변환 helper 추가
  - `src/components/json-csv-converter.tsx` 생성, textarea + 변환/지우기 UI와 결과/열 정보 표시 구현
  - `app/services/json-csv-converter/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `json-csv-converter` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `JSON ↔ CSV 변환기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `lsp_diagnostics` 기준 변경 파일 5개 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/json-csv-converter` → 200 확인, 서비스 제목/안내 문구 포함 확인
  - 홈/실험실/search HTML에 `JSON ↔ CSV 변환기`, `/services/json-csv-converter` 노출 확인
  - 실제 headless Chrome + DevTools protocol에서 JSON→CSV 성공, CSV→JSON 성공, 중첩 객체 JSON 오류, 열 수 불일치 CSV 오류, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 결과 패널과 주요 버튼 visible 확인
  - browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 flat object array JSON과 header-row CSV만 지원하며, 중첩 객체/배열 값은 추측 변환하지 않고 거절함
  - CSV → JSON 변환 시 셀 값은 모두 문자열로 반환하며 타입 복원은 포함하지 않음

## 2026-03-11 08:03
- 요약: Base64 인코더/디코더에 결과 복사 버튼과 액션별 클립보드 피드백 추가
- 변경 이유: URL 인코더/디코더까지 복사 UX를 확장한 뒤에는 새 유틸리티 추가보다 더 작은 변경으로, Base64 인코딩/디코딩 결과를 바로 다음 작업으로 넘기는 마지막 마찰을 줄일 수 있는 기존 변환 도구 보강이 더 적합했기 때문
- 사용자 영향: 허브의 `Base64 인코더/디코더`에서 인코딩/디코딩 결과를 버튼 한 번으로 복사하고, 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/base64-encoder.tsx`에 `copyStatus` 상태와 `handleEncode`, `handleDecode`, `handleClear`, `handleCopy` 핸들러 추가
  - 성공 결과에서만 `결과 복사` 버튼을 노출하고, 현재 액션 기준 성공 메시지와 공통 실패 메시지 추가
  - `app/services/base64-encoder/page.tsx` 서비스 안내에 결과 복사 가능 안내 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/base64-encoder.tsx`, `app/services/base64-encoder/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/base64-encoder` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, ASCII 인코딩/디코딩 결과 복사 성공, UTF-8 인코딩/디코딩 결과 복사 성공, 재실행 시 상태 초기화, 클립보드 실패 메시지, 잘못된 디코딩 입력에서 복사 버튼 미노출, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
  - 최종 browser verification 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `Base64 인코더/디코더` 한 서비스에만 복사 UX를 확장했으며, 신규 유틸리티 추가와 다른 결과형 도구 확장은 후속 단계에서 별도로 진행해야 함

## 2026-03-11 07:32
- 요약: URL 인코더/디코더에 결과 복사 버튼과 액션별 클립보드 피드백 추가
- 변경 이유: 줄바꿈 형식 변환기까지 복사 UX를 확장한 뒤에는 새 유틸리티 추가보다 더 작은 변경으로, 인코딩/디코딩 결과를 바로 다음 작업으로 넘기는 마지막 마찰을 줄일 수 있는 기존 변환 도구 보강이 더 적합했기 때문
- 사용자 영향: 허브의 `URL 인코더/디코더`에서 인코딩/디코딩 결과를 버튼 한 번으로 복사하고, 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/url-encoder.tsx`에 `copyStatus` 상태와 `handleEncode`, `handleDecode`, `handleClear`, `handleCopy` 핸들러 추가
  - 성공 결과에서만 `결과 복사` 버튼을 노출하고, 현재 액션 기준 성공 메시지와 공통 실패 메시지 추가
  - `app/services/url-encoder/page.tsx` 서비스 안내에 결과 복사 가능 안내 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/url-encoder.tsx`, `app/services/url-encoder/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/url-encoder` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 인코딩 결과 복사 성공, 디코딩 결과 복사 성공, 재실행 시 상태 초기화, 클립보드 실패 메시지, 잘못된 디코딩 입력에서 복사 버튼 미노출, 지우기 후 상태 초기화 확인
  - 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
  - 최종 clean browser rerun 기준 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `URL 인코더/디코더` 한 서비스에만 복사 UX를 확장했으며, 신규 유틸리티 추가와 다른 결과형 도구 확장은 후속 단계에서 별도로 진행해야 함

## 2026-03-11 06:55
- 요약: 줄바꿈 형식 변환기에 결과 복사 버튼과 실제 출력 기준 클립보드 피드백 추가
- 변경 이유: 단일 결과형 복사 UX를 이어 확장하되, 이번에는 escaped preview와 실제 출력 중 무엇을 복사해야 하는지 의미가 갈리는 도구였기 때문에, 가장 작은 변경으로 반복 사용 마찰을 줄이면서 복사 기준도 명확히 정리할 필요가 있었기 때문
- 사용자 영향: 허브의 `줄바꿈 형식 변환기`에서 escaped preview가 아닌 실제 정규화 결과를 버튼 한 번으로 복사하고, 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/line-ending-tool.tsx`에 `copyStatus` 상태와 `handleConvert`, `handleClear`, `handleCopy` 핸들러 추가
  - 성공 결과에서만 `결과 복사` 버튼을 노출하고, 복사 대상이 escaped preview가 아닌 `result.output`임을 안내하는 문구 및 성공/실패 메시지 추가
  - `app/services/line-ending-tool/page.tsx` 서비스 안내에 실제 정규화 결과 복사 가능 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/line-ending-tool.tsx`, `app/services/line-ending-tool/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/line-ending-tool` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, LF 모드 복사값 `alpha\nbeta\ngamma\ndelta`, CRLF 모드 복사값 `alpha\r\nbeta\r\ngamma\r\ndelta`, 실패 메시지, 재변환 시 상태 초기화, 지우기 후 상태 초기화, 빈 입력 오류 상태에서 복사 버튼 미노출 확인
  - 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
  - 동일 브라우저 검증에서 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `줄바꿈 형식 변환기` 한 서비스에만 복사 UX를 확장했으며, 신규 유틸리티 추가와 다른 결과형 도구 확장은 후속 단계에서 별도로 진행해야 함

## 2026-03-11 06:38
- 요약: 줄 공백 정리기에 결과 복사 버튼과 클립보드 피드백 추가
- 변경 이유: 가장 최근에 정리한 단일 결과형 복사 UX 패턴을 구조가 거의 같은 텍스트 정리 도구에 확장하면, 새 서비스 추가보다 더 작은 변경으로 반복 사용의 마지막 마찰을 한 번 더 줄일 수 있었기 때문
- 사용자 영향: 허브의 `줄 공백 정리기`에서 정리 결과를 버튼 한 번으로 복사하고, 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/line-trim-tool.tsx`에 `copyStatus` 상태와 `handleTrim`, `handleClear`, `handleCopy` 핸들러 추가
  - 성공 결과에서만 `결과 복사` 버튼을 노출하고, `navigator.clipboard.writeText()` 기반 복사 처리 및 성공/실패 메시지 추가
  - `app/services/line-trim-tool/page.tsx` 서비스 안내에 결과 복사 가능 안내 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/line-trim-tool.tsx`, `app/services/line-trim-tool/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/line-trim-tool` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 기본 `앞뒤 공백 제거` 결과 확인, 복사 성공 메시지, 클립보드 실패 메시지, 재정리 시 상태 초기화, 지우기 후 상태 초기화, 빈 입력 오류 상태에서 복사 버튼 미노출 확인
  - 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
  - 동일 브라우저 검증에서 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `줄 공백 정리기` 한 서비스에만 복사 UX를 확장했으며, 신규 유틸리티 추가와 다른 결과형 도구 확장은 후속 단계에서 별도로 진행해야 함

## 2026-03-11 06:22
- 요약: 빈 줄 정리기에 결과 복사 버튼과 클립보드 피드백 추가
- 변경 이유: 다중 결과 도구까지 복사 UX를 확장한 뒤에는 가장 작고 안전한 단일 결과형 유틸리티에 같은 패턴을 이어 적용하는 편이, 새 서비스 추가보다 더 작은 변경으로 반복 사용의 마지막 마찰을 줄이는 다음 단계로 적합했기 때문
- 사용자 영향: 허브의 `빈 줄 정리기`에서 정리 결과를 버튼 한 번으로 복사하고, 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/blank-line-tool.tsx`에 `copyStatus` 상태와 `handleClean`, `handleClear`, `handleCopy` 핸들러 추가
  - 성공 결과에서만 `결과 복사` 버튼을 노출하고, `navigator.clipboard.writeText()` 기반 복사 처리 및 성공/실패 메시지 추가
  - `app/services/blank-line-tool/page.tsx` 서비스 안내에 결과 복사 가능 안내 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/blank-line-tool.tsx`, `app/services/blank-line-tool/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/blank-line-tool` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, `remove-all`/`collapse-runs` 결과 확인, 복사 성공 메시지, 클립보드 실패 메시지, 지우기 후 상태 초기화, 빈 입력 오류 상태에서 복사 버튼 미노출 확인
  - 모바일 폭 390 기준 복사 버튼과 결과 패널 visible 확인
  - 동일 브라우저 검증에서 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `빈 줄 정리기` 한 서비스에만 복사 UX를 확장했으며, 신규 유틸리티 추가와 다른 결과형 도구 확장은 후속 단계에서 별도로 진행해야 함

## 2026-03-11 06:04
- 요약: 줄 목록 정리기에 입력 순서/정렬 결과별 복사 버튼과 독립 피드백 추가
- 변경 이유: 줄 정렬기에서 먼저 정리한 다중 결과 복사 UX 패턴을 가장 가까운 다중 결과 유틸리티에 확장하면, 새 서비스 추가보다 더 작은 변경으로 반복 사용 마찰을 줄이면서 후속 맞춤 UX 기준도 더 단단하게 만들 수 있었기 때문
- 사용자 영향: 허브의 `줄 목록 정리기`에서 입력 순서 유지 결과와 정렬된 결과를 각각 따로 복사하고, 각 카드에서 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/line-list-cleaner.tsx`에 `ordered`/`sorted` 독립 `copyStatus` 상태와 `handleAnalyze`, `handleClear`, `handleCopy` 핸들러 추가
  - 각 결과 카드에 `입력 순서 유지 복사`, `정렬 결과 복사` 버튼과 카드별 성공/실패 메시지 추가
  - `app/services/line-list-cleaner/page.tsx` 안내에 결과별 복사 가능 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/line-list-cleaner.tsx`, `app/services/line-list-cleaner/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/line-list-cleaner` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 정리 후 각 복사 버튼 노출, 입력 순서 유지 복사 성공, 정렬 결과 복사 실패 메시지, 지우기 후 상태 초기화, 빈 입력 오류 상태에서 복사 버튼 미노출 확인
  - 모바일 폭 390 기준으로 두 결과 카드와 두 복사 버튼 모두 visible 확인
  - 동일 브라우저 검증에서 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `줄 목록 정리기` 한 서비스의 다중 결과 복사 UX에만 집중하며, 다른 다중 결과 유틸리티와 신규 유틸리티는 후속 단계에서 별도로 다뤄야 함

## 2026-03-11 05:48
- 요약: 줄 정렬기에 오름차순/내림차순별 결과 복사 버튼과 독립 피드백 추가
- 변경 이유: 이미 단일 결과형 도구에서 검증된 복사 UX를 다중 결과 도구로 확장하면, 새 서비스 추가보다 더 작은 변경으로 반복 사용 마찰을 줄이면서 후속 다중 결과 패턴도 정리할 수 있었기 때문
- 사용자 영향: 허브의 `줄 정렬기`에서 오름차순/내림차순 결과를 각각 따로 복사하고, 각 카드에서 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/line-sort-tool.tsx`에 `ascending`/`descending` 독립 `copyStatus` 상태와 `handleSort`, `handleClear`, `handleCopy` 핸들러 추가
  - 각 결과 카드에 `오름차순 복사`, `내림차순 복사` 버튼과 카드별 성공/실패 메시지 추가
  - `app/services/line-sort-tool/page.tsx` 안내에 결과별 복사 가능 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/line-sort-tool.tsx`, `app/services/line-sort-tool/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/line-sort-tool` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 정렬 후 각 복사 버튼 노출, 오름차순 복사 성공, 내림차순 복사 실패 메시지, 지우기 후 상태 초기화, 빈 입력 오류 상태에서 복사 버튼 미노출 확인
  - 모바일 폭 390 기준으로 두 결과 카드와 두 복사 버튼 모두 visible 확인
  - 동일 브라우저 검증에서 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `줄 정렬기` 한 서비스의 다중 결과 복사 UX에만 집중하며, 다른 다중 결과 유틸리티는 후속 단계에서 별도로 맞춤 설계해야 함

## 2026-03-11 05:23
- 요약: 텍스트 치환 도구에 결과 복사 버튼과 클립보드 피드백 추가
- 변경 이유: JSON 포맷터에서 먼저 검증된 복사 UX를 같은 결과형 유틸리티에 확장하면, 새 서비스 추가보다 더 작은 변경으로 반복 사용의 마지막 마찰을 바로 줄일 수 있었기 때문
- 사용자 영향: 허브의 `텍스트 치환 도구`에서 치환 결과를 버튼 한 번으로 복사하고, 성공/실패 상태를 바로 확인 가능
- 기술 변경:
  - `src/components/text-replace-tool.tsx`에 `copyStatus` 상태와 `handleReplace`, `handleClear`, `handleCopy` 핸들러 추가
  - 성공 결과에서만 `결과 복사` 버튼을 노출하고, `navigator.clipboard.writeText()` 기반 복사 처리 및 성공/실패 메시지 추가
  - `app/services/text-replace-tool/page.tsx` 서비스 안내에 결과 복사 가능 안내 문구 추가
- 검증:
  - `lsp_diagnostics` 기준 `src/components/text-replace-tool.tsx`, `app/services/text-replace-tool/page.tsx` 모두 `No diagnostics found`
  - `pnpm typecheck && pnpm lint && pnpm build` 통과
  - `http://localhost:80/services/text-replace-tool` → 200 확인, 제목/복사 안내 문구 포함 확인
  - 실제 headless Chrome + DevTools protocol에서 초기 복사 버튼 미노출, 치환 후 `bar bar` 복사 성공 메시지, 클립보드 실패 메시지, 지우기 후 상태 초기화 확인
  - 동일 브라우저 검증에서 console message는 info/log만 있고 exception 없음 확인
- 리스크 / 제한사항:
  - 이번 단계는 `텍스트 치환 도구` 한 서비스에만 복사 UX를 확장했으며, 다중 결과 블록을 가진 다른 유틸리티는 후속 단계에서 별도로 설계해야 함

## 2026-03-11 05:07
- 요약: JSON 포맷터/검증기에 결과 복사 버튼과 클립보드 피드백 추가
- 변경 이유: 이미 배포된 텍스트 결과형 유틸리티들은 출력 결과를 다시 복사해 다른 작업으로 넘기는 흐름이 많았지만, 현재 허브에서는 그 마지막 한 단계가 빠져 있어 반복 마찰이 남아 있었기 때문
- 사용자 영향: 허브의 `JSON 포맷터/검증기`에서 포맷된 JSON 결과를 버튼 한 번으로 복사하고, 성공/실패 피드백을 바로 확인 가능
- 기술 변경:
  - `src/components/json-formatter.tsx`에 `copyStatus` 상태 추가
  - 성공 결과에만 `결과 복사` 버튼을 노출하고, `navigator.clipboard.writeText()` 기반 복사 처리 추가
  - 클립보드 성공/실패 메시지를 기존 패널 문구 스타일에 맞춰 표시
- 검증:
  - `lsp_diagnostics src/components/json-formatter.tsx` 기준 `No diagnostics found`
  - `pnpm build` 통과
  - `http://localhost:80/services/json-formatter` → 200 확인
  - 실제 headless Chrome + DevTools protocol에서 `결과 복사` 클릭 시 성공 메시지와 복사된 JSON 값 확인
  - 동일 브라우저 검증에서 클립보드 실패 상황 주입 시 오류 메시지 확인
- 리스크 / 제한사항:
  - 이번 단계는 `JSON 포맷터/검증기` 한 서비스에만 적용했으며, 다른 결과형 유틸리티로의 확장은 후속 단계에서 이어가야 함

## 2026-03-11 04:59
- 요약: 허브 레지스트리와 실험실 목록의 줄 목록 정리기 중복 항목 제거
- 변경 이유: 실제 현재 코드 기준으로 `line-list-cleaner`가 `src/lib/service-registry.ts`와 `app/services/experiments/page.tsx`에 각각 중복 등록되어 있어 허브 탐색 목록과 카운트가 왜곡될 수 있었기 때문
- 사용자 영향: 허브 내부 탐색에서 `줄 목록 정리기`가 중복 노출되지 않고, 서비스 목록/실험실 기준 데이터가 더 일관되게 유지됨
- 기술 변경:
  - `src/lib/service-registry.ts`에서 중복된 `line-list-cleaner` 서비스 블록 1개 제거
  - `app/services/experiments/page.tsx`에서 중복된 `줄 목록 정리기` 카드 1개 제거
- 검증:
  - 변경 파일 기준 `lsp_diagnostics` 모두 `No diagnostics found`
  - `pnpm build` 통과
  - `grep 'key: "line-list-cleaner"' src/lib/service-registry.ts` 기준 1건 확인
  - `grep 'name: "줄 목록 정리기"' app/services/experiments/page.tsx` 기준 1건 확인
- 리스크 / 제한사항:
  - 이번 단계는 중복 메타데이터 정리에만 집중하며, 추가 UX 개선이나 신규 서비스 확장은 포함하지 않음

## 2026-03-11 04:37
- 요약: 허브에 로컬 전용 줄 정렬기 신규 서비스 추가
- 변경 이유: 줄 목록 정리기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 줄 정렬기였기 때문
- 사용자 영향: 허브 메인에서 `줄 정렬기` 카드로 이동해 중복은 유지한 채 여러 줄 텍스트를 오름차순/내림차순으로 정렬 가능
- 기술 변경:
  - `src/lib/line-sort-tools.ts` 생성, deterministic line sort helper 추가
  - `src/components/line-sort-tool.tsx` 생성, textarea + 정렬/지우기 UI와 ascending/descending 결과 카드 구현
  - `app/services/line-sort-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-sort-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄 정렬기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/line-sort-tool` → 200 OK
  - 서비스/홈/실험실/search HTML에 `줄 정렬기`, `/services/line-sort-tool` 노출 확인
  - 실제 Chrome headless에서 ascending/descending fixture, 빈 입력 오류, 모바일 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 deterministic string sort와 빈 줄 무시에 집중하며, locale-aware sort/natural sort/dedupe 기능은 포함하지 않음

## 2026-03-11 03:57
- 요약: 허브에 로컬 전용 줄 목록 정리기 신규 서비스 추가
- 변경 이유: 빈 줄 정리기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 줄 목록 정리기였기 때문
- 사용자 영향: 허브 메인에서 `줄 목록 정리기` 카드로 이동해 여러 줄 텍스트를 정리하고 중복 제거 결과를 입력 순서/정렬 기준으로 확인 가능
- 기술 변경:
  - `src/lib/line-list-tools.ts` 생성, 줄 정리/중복 제거 helper 추가
  - `src/components/line-list-cleaner.tsx` 생성, textarea + 정리/지우기 UI와 결과 카드 구현
  - `app/services/line-list-cleaner/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-list-cleaner` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄 목록 정리기`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 결과 카드 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/line-list-cleaner` → 200 OK
  - 서비스/홈/실험실/search HTML에 `줄 목록 정리기`, `/services/line-list-cleaner` 노출 확인
  - 실제 Chrome headless에서 fixture 입력 기준 `전체 줄 수 6`, `비어 있지 않은 줄 5`, `고유 줄 수 3`, `제거된 중복 2`, 입력 순서 유지 결과, 정렬 결과 확인
  - 모바일 폭 Chrome 기준 줄 목록 정리기 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 줄 trim, 빈 줄 무시, 입력 순서 유지/정렬 결과 제공에 집중하며, 정규식/CSV/파일 입력 기능은 포함하지 않음

## 2026-03-11 03:17
- 요약: 허브에 로컬 전용 빈 줄 정리기 신규 서비스 추가
- 변경 이유: 줄바꿈 형식 변환기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 빈 줄 정리기였기 때문
- 사용자 영향: 허브 메인에서 `빈 줄 정리기` 카드로 이동해 여러 줄 텍스트에서 빈 줄을 모두 제거하거나 연속 빈 줄을 1개만 유지 가능
- 기술 변경:
  - `src/lib/blank-line-tools.ts` 생성, blank line remove/collapse helper 추가
  - `src/components/blank-line-tool.tsx` 생성, textarea + mode selector + 정리/지우기 UI 및 결과 표시 구현
  - `app/services/blank-line-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `blank-line-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `빈 줄 정리기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/blank-line-tool` → 200 OK
  - 서비스/홈/실험실/search HTML에 `빈 줄 정리기`, `/services/blank-line-tool` 노출 확인
  - 실제 Chrome headless에서 remove-all/collapse-runs fixture, 빈 입력 오류, 모바일 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 빈 줄 제거/연속 빈 줄 축약에 집중하며, dedupe/sort/copy/export 기능은 포함하지 않음

## 2026-03-11 02:28
- 요약: 허브에 로컬 전용 줄바꿈 형식 변환기 신규 서비스 추가
- 변경 이유: 줄 공백 정리기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 줄바꿈 형식 변환기였기 때문
- 사용자 영향: 허브 메인에서 `줄바꿈 형식 변환기` 카드로 이동해 혼합된 줄바꿈 형식을 LF 또는 CRLF로 정규화 가능
- 기술 변경:
  - `src/lib/line-ending-tools.ts` 생성, LF/CRLF 정규화 helper와 escaped preview 추가
  - `src/components/line-ending-tool.tsx` 생성, textarea + mode selector + 변환/지우기 UI 및 결과 표시 구현
  - `app/services/line-ending-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-ending-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄바꿈 형식 변환기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/line-ending-tool` → 200 OK
  - 서비스/홈/실험실/search HTML에 `줄바꿈 형식 변환기`, `/services/line-ending-tool` 노출 확인
  - 실제 Chrome headless에서 LF/CRLF 정규화, 빈 입력 오류, 모바일 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 LF/CRLF 정규화와 escaped preview에 집중하며, diff 비교나 파일 입출력 기능은 포함하지 않음

## 2026-03-11 02:04
- 요약: 허브에 로컬 전용 줄 공백 정리기 신규 서비스 추가
- 변경 이유: 줄 들여쓰기 조정기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 텍스트 정리 유틸리티가 줄 공백 정리기였기 때문
- 사용자 영향: 허브 메인에서 `줄 공백 정리기` 카드로 이동해 각 줄의 앞/뒤 공백을 정리하면서 빈 줄은 그대로 유지 가능
- 기술 변경:
  - `src/lib/line-trim-tools.ts` 생성, per-line trim helper 추가
  - `src/components/line-trim-tool.tsx` 생성, textarea + mode + 정리/지우기 UI 및 결과 표시 구현
  - `app/services/line-trim-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-trim-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄 공백 정리기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/line-trim-tool` → 200 OK
  - 서비스/홈/실험실/search HTML에 `줄 공백 정리기`, `/services/line-trim-tool` 노출 확인
  - 실제 Chrome headless에서 trim-start/trim-end/trim-both fixture, 빈 입력 오류 확인
  - 모바일 폭 Chrome 기준 줄 공백 정리기 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 각 줄의 앞/뒤 공백 정리에 집중하며, dedupe/sort/copy/export 기능은 포함하지 않음

## 2026-03-11 01:43
- 요약: 허브에 로컬 전용 줄 들여쓰기 조정기 신규 서비스 추가
- 변경 이유: 줄 번호 추가기까지 승격된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 텍스트 포맷 유틸리티가 줄 들여쓰기 조정기였기 때문
- 사용자 영향: 허브 메인에서 `줄 들여쓰기 조정기` 카드로 이동해 여러 줄 텍스트를 spaces-only 기준으로 들여쓰기/내어쓰기 가능
- 기술 변경:
  - `src/lib/line-indent-tools.ts` 생성, deterministic line-indent helper 추가
  - `src/components/line-indent-tool.tsx` 생성, textarea + mode + width + 적용/지우기 UI 및 결과 표시 구현
  - `app/services/line-indent-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-indent-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄 들여쓰기 조정기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/line-indent-tool` → 200 OK
  - 서비스/홈/실험실/search HTML에 `줄 들여쓰기 조정기`, `/services/line-indent-tool` 노출 확인
  - 실제 Chrome headless에서 indent fixture, outdent fixture, empty source/invalid width 오류 확인
  - 모바일 폭 Chrome 기준 줄 들여쓰기 조정기 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 공백(space) 기반 들여쓰기/내어쓰기에 집중하며, 탭 문자 처리나 자동 감지 기능은 포함하지 않음

## 2026-03-11 01:36
- 요약: 허브에 로컬 전용 줄 번호 추가기 신규 서비스 추가
- 변경 이유: 줄 접두/접미 추가기까지 승격된 뒤에도 허브 흐름에 자연스럽게 붙는 다음 텍스트 포맷 유틸리티가 줄 번호 추가기였기 때문
- 사용자 영향: 허브 메인에서 `줄 번호 추가기` 카드로 이동해 비어 있지 않은 줄에만 시작 번호/구분자 기준 번호를 붙이고 빈 줄은 그대로 유지할 수 있음
- 기술 변경:
  - `src/lib/line-number-tools.ts` 생성, deterministic line-number helper 추가
  - `src/components/line-number-tool.tsx` 생성, textarea + 시작 번호 + 구분자 + 적용/지우기 UI 및 결과/통계 표시 구현
  - `app/services/line-number-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-number-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄 번호 추가기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - 변경 파일 기준 `lsp_diagnostics` 모두 `No diagnostics found`
  - `pnpm build` 통과
- 리스크 / 제한사항:
  - 이번 단계에서는 비어 있지 않은 줄 번호 추가 MVP만 제공하며 저장/복사/내보내기/증분(step)/0-padding 기능은 포함하지 않음

## 2026-03-11 01:04
- 요약: 허브에 로컬 전용 줄 접두/접미 추가기 신규 서비스 추가
- 변경 이유: 텍스트 치환 도구까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 줄 접두/접미 추가기였기 때문
- 사용자 영향: 허브 메인에서 `줄 접두/접미 추가기` 카드로 이동해 여러 줄 텍스트 각 줄에 접두/접미를 붙여 목록/코드 조각 포맷을 빠르게 맞출 수 있음
- 기술 변경:
  - `src/lib/line-affix-tools.ts` 생성, non-empty lines 기준 접두/접미 적용 helper 추가
  - `src/components/line-affix-tool.tsx` 생성, textarea + prefix/suffix 입력 + 적용/지우기 UI 구현
  - `app/services/line-affix-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-affix-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄 접두/접미 추가기`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/line-affix-tool` → 200 OK
  - 서비스/홈/실험실/search HTML에 `줄 접두/접미 추가기`, `/services/line-affix-tool` 노출 확인
  - 실제 Chrome headless에서 quoted-list fixture, bullet fixture, empty source error, empty affix error 확인
  - 모바일 폭 Chrome 기준 줄 접두/접미 추가기 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 비어 있지 않은 줄에만 접두/접미를 추가하며, CSV/정규식/정렬/중복 제거 기능은 포함하지 않음

## 2026-03-11 00:43
- 요약: 허브에 로컬 전용 텍스트 치환 도구 신규 서비스 추가
- 변경 이유: 텍스트 비교 도구까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 텍스트 치환 도구였기 때문
- 사용자 영향: 허브 메인에서 `텍스트 치환 도구` 카드로 이동해 원문 텍스트에서 찾을 문자열을 literal 방식으로 치환 가능
- 기술 변경:
  - `src/lib/text-replace-tools.ts` 생성, literal replace helper 추가
  - `src/components/text-replace-tool.tsx` 생성, textarea + find/replace 입력 + 치환/지우기 UI 구현
  - `app/services/text-replace-tool/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `text-replace-tool` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `텍스트 치환 도구`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/text-replace-tool` → 200 OK
  - 서비스/홈/실험실/search HTML에 `텍스트 치환 도구`, `/services/text-replace-tool` 노출 확인
  - 실제 Chrome headless에서 치환 성공, no-match unchanged, empty replacement delete-style 치환, empty find 오류 확인
  - 모바일 폭 Chrome 기준 텍스트 치환 도구 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 literal 치환만 제공하며, 정규식 치환 모드나 복사/내보내기 기능은 포함하지 않음

## 2026-03-11 00:10
- 요약: 허브에 로컬 전용 텍스트 비교 도구 신규 서비스 추가
- 변경 이유: 정규식 이스케이프 도구까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 텍스트 비교 도구였기 때문
- 사용자 영향: 허브 메인에서 `텍스트 비교 도구` 카드로 이동해 두 텍스트의 동일 여부와 첫 차이 위치를 바로 확인 가능
- 기술 변경:
  - `src/lib/text-diff-tools.ts` 생성, exact compare/차이 위치 helper 추가
  - `src/components/text-diff-checker.tsx` 생성, 두 textarea + 비교/지우기 UI와 차이 결과 표시 구현
  - `app/services/text-diff-checker/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `text-diff-checker` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `텍스트 비교 도구`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 두 입력창 grid 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/text-diff-checker` → 200 OK
  - 서비스/홈/실험실/search HTML에 `텍스트 비교 도구`, `/services/text-diff-checker` 노출 확인
  - 실제 Chrome headless에서 다른 텍스트 비교 시 `line 2, column 4`, 동일 비교, 빈 입력 오류 확인
  - 모바일 폭 Chrome 기준 텍스트 비교 도구 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 exact compare와 첫 차이 위치 확인에 집중하며, diff 하이라이트/정규화 모드/복사 기능은 포함하지 않음

## 2026-03-10 23:42
- 요약: 허브에 로컬 전용 정규식 이스케이프 도구 신규 서비스 추가
- 변경 이유: 줄 목록 정리기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 정규식 이스케이프 도구였기 때문
- 사용자 영향: 허브 메인에서 `정규식 이스케이프 도구` 카드로 이동해 일반 텍스트를 정규식 source 문자열이나 JavaScript regex literal preview로 안전하게 변환 가능
- 기술 변경:
  - `src/lib/regex-tools.ts` 생성, regex source/js literal preview helper 추가
  - `src/components/regex-escape.tsx` 생성, textarea + 이스케이프/지우기 UI와 결과 표시 구현
  - `app/services/regex-escape/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `regex-escape` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `정규식 이스케이프 도구`를 `승격 완료`와 실제 링크로 갱신
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/regex-escape` → 200 OK
  - 서비스/홈/실험실/search HTML에 `정규식 이스케이프 도구`, `/services/regex-escape` 노출 확인
  - 실제 Chrome headless에서 `hello.*(world)?`, `a/b` 이스케이프, 빈 입력 오류 확인
  - 모바일 폭 Chrome 기준 정규식 이스케이프 도구 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 regex source와 JavaScript literal preview 생성에 집중하며, 실제 정규식 실행/플래그 관리 기능은 포함하지 않음

## 2026-03-10 23:12
- 요약: 허브에 로컬 전용 줄 목록 정리기 신규 서비스 추가
- 변경 이유: 진법 변환기까지 추가된 뒤에도 포모도로 타이머는 여전히 보류 상태였고, 현재 허브 흐름에 가장 자연스럽게 붙는 다음 결정적 입력/출력 유틸리티가 줄 목록 정리기였기 때문
- 사용자 영향: 허브 메인에서 `줄 목록 정리기` 카드로 이동해 여러 줄 텍스트를 정리하고 중복 제거 결과를 입력 순서/정렬 기준으로 확인 가능
- 기술 변경:
  - `src/lib/line-list-tools.ts` 생성, 줄 정리/중복 제거 helper 추가
  - `src/components/line-list-cleaner.tsx` 생성, textarea + 정리/지우기 UI와 결과 카드 구현
  - `app/services/line-list-cleaner/page.tsx` 생성
  - `src/lib/service-registry.ts`에 `line-list-cleaner` 서비스 등록
  - `app/services/experiments/page.tsx`에서 `줄 목록 정리기`를 `승격 완료`와 실제 링크로 갱신
  - `app/globals.css`에 결과 카드 스타일 추가
- 검증:
  - `pnpm typecheck` 통과
  - `pnpm lint` 통과
  - `pnpm build` 통과
  - `curl --max-time 20 http://localhost:80/services/line-list-cleaner` → 200 OK
  - 서비스/홈/실험실/search HTML에 `줄 목록 정리기`, `/services/line-list-cleaner` 노출 확인
  - 실제 Chrome headless에서 fixture 입력 기준 `전체 줄 수 6`, `비어 있지 않은 줄 5`, `고유 줄 수 3`, `제거된 중복 2`, 입력 순서 유지 결과, 정렬 결과 확인
  - 모바일 폭 Chrome 기준 줄 목록 정리기 핵심 요소 표시 확인
  - 브라우저 error-level console 로그 없음 확인
- 리스크 / 제한사항:
  - 이번 단계에서는 줄 trim, 빈 줄 무시, 입력 순서 유지/정렬 결과 제공에 집중하며, 정규식/CSV/파일 입력 기능은 포함하지 않음

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
