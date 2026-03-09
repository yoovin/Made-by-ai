# Made by AI — oh-my-opencode 전용 스타터 (로컬 Ubuntu)

이 스타터는 **로컬 Ubuntu 한 대**에서 돌아가는 `OpenCode + oh-my-opencode` 프로젝트용입니다.

핵심 목표는 4가지입니다.

1. **허브형 웹서비스**를 시작점으로 잡는다.
2. 새 기능은 전부 **서비스**로 추가한다.
3. 진행 흐름은 **텔레그램으로 한국어 실시간 보고**한다.
4. 위험 변경은 **승인 대기 큐로 분리**하고, 다른 안전한 작업은 계속 진행한다.

---

## 이 스타터가 하는 일

- Next.js 허브형 웹앱 기본 골격 제공
- `service-registry` 기반으로 서비스 확장 구조 제공
- `AGENTS.md`로 프로젝트 규칙 고정
- `.opencode/oh-my-opencode.jsonc`로 OMO 프로젝트 설정 제공
- 텔레그램 진행 보고 / 승인 요청 스크립트 제공
- 로컬 배포 / 스모크 테스트 / git push 스크립트 제공
- 자동 루프용 스크립트와 systemd 템플릿 제공

---

## 폴더에서 가장 먼저 볼 것

- `AGENTS.md`
- `.opencode/oh-my-opencode.jsonc`
- `src/lib/service-registry.ts`
- `scripts/omo-autoloop.sh`
- `scripts/approval_bot.py`
- `.opencode/plugins/telegram-live.js`

---

## 시작 전에 준비할 것

### 1. 필수 프로그램

Ubuntu 기준으로 먼저 설치합니다.

```bash
sudo apt update
sudo apt install -y git curl jq python3 python3-venv python3-pip nginx tmux
```

Node.js 20 이상과 pnpm도 필요합니다.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
corepack prepare pnpm@latest --activate
```

OpenCode가 설치되어 있어야 합니다.

```bash
which opencode
opencode --version
```

### 2. oh-my-opencode 설치

이미 설치되어 있으면 넘어가도 됩니다.

설치 후 `opencode` 안에서 OMO 명령이 보여야 합니다.
예: `/start-work`, `/ralph-loop`

### 3. OpenCode 로그인

API 키 대신 **이미 로그인된 OpenCode 계정**을 사용한다는 전제입니다.

```bash
opencode auth login
```

또는 OpenCode를 실행해서 연결을 완료하세요.

---

## 프로젝트 적용 순서

### 1단계. 저장소 준비

```bash
git clone https://github.com/yoovin/Made-by-ai.git
cd Made-by-ai
```

이 스타터 파일들을 저장소 루트에 복사합니다.

### 2단계. 환경파일 만들기

```bash
cp .env.local.example .env.local
nano .env.local
```

최소한 아래는 채우세요.

```env
APP_NAME=Made by AI
PUBLIC_APP_URL=http://127.0.0.1
APP_PORT=3000
PUBLIC_PORT=80

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_APPROVER_USER_ID=

LOCAL_GIT_PUSH=false
AUTOLOOP_INTERVAL_SECONDS=1800
AUTO_DEPLOY=true
```

- `LOCAL_GIT_PUSH=false`면 자동 커밋은 해도 자동 push는 하지 않습니다.
- `AUTOLOOP_INTERVAL_SECONDS=1800`은 30분마다 한 사이클입니다.

### 3단계. 의존성 설치

```bash
pnpm install
```

### 4단계. 웹앱 로컬 확인

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 확인

### 5단계. 텔레그램 승인 봇 테스트

터미널 하나 더 열고:

```bash
python3 scripts/approval_bot.py
```

에러 없이 대기하면 정상입니다.

### 6단계. OMO 수동 실행 테스트

```bash
bash scripts/start-omo.sh
```

OpenCode가 열리면 아래처럼 시작하세요.

```text
/start-work
이 저장소의 AGENTS.md와 service-registry 구조를 읽고,
허브형 구조를 유지하면서 가장 작은 안전한 개선 1개를 진행해.
진행 흐름은 한국어로 텔레그램에 보고해.
```

---

## 한 번 켜두면 계속 돌게 하기

자동 루프는 `scripts/omo-autoloop.sh`가 담당합니다.
이 스크립트는 매 사이클마다:

1. 텔레그램에 시작 보고
2. 자동 프롬프트 생성
3. `opencode run` 실행
4. 배포 가능하면 로컬 배포
5. 스모크 테스트
6. 요약 보고
7. 다음 사이클까지 대기

### 수동 테스트

```bash
bash scripts/omo-autoloop.sh
```

### 백그라운드로 계속 실행

systemd 사용자 서비스로 등록합니다.

```bash
bash scripts/install-omo-services.sh
systemctl --user daemon-reload
systemctl --user enable --now made-by-ai-telegram.service
systemctl --user enable --now made-by-ai-omo-autoloop.service
loginctl enable-linger "$USER"
```

상태 확인:

```bash
systemctl --user status made-by-ai-omo-autoloop.service
journalctl --user -u made-by-ai-omo-autoloop.service -f
```

중지:

```bash
systemctl --user stop made-by-ai-omo-autoloop.service
```

재시작:

```bash
systemctl --user restart made-by-ai-omo-autoloop.service
```

---

## 실서비스를 80번 포트로 열기

이 스타터는 **nginx가 80번 포트를 받고**, 앱은 기본적으로 `3000`에서 실행되도록 되어 있습니다.

### nginx 적용

```bash
sudo cp nginx/made-by-ai.conf.template /etc/nginx/sites-available/made-by-ai
sudo ln -sf /etc/nginx/sites-available/made-by-ai /etc/nginx/sites-enabled/made-by-ai
sudo nginx -t
sudo systemctl reload nginx
```

### 앱 실행

```bash
pnpm build
APP_PORT=3000 pnpm start
```

또는 systemd 템플릿을 사용하세요.

---

## 위험 변경 승인 흐름

위험 변경이 필요하면 AI는 바로 배포하지 않고:

1. `ops/approvals/pending/*.json` 생성
2. 텔레그램으로 승인 요청 전송
3. 당신의 답변을 기다림
4. 그 작업은 보류
5. 다른 안전한 작업은 계속 진행

승인 봇에서 받을 수 있는 답변 예시는:

- `resume <id>`
- `discard <id>`
- `status`

---

## 서비스 추가 규칙

이 프로젝트의 핵심은 **허브형 구조**입니다.

즉, 새 기능을 만들 때는 항상:

1. 서비스 페이지 생성
2. `src/lib/service-registry.ts` 등록
3. 허브 화면에서 노출
4. changelog 기록

이 규칙을 깨면 안 됩니다.

---

## 가장 추천하는 실제 사용 순서

처음 1회:

```bash
cp .env.local.example .env.local
nano .env.local
pnpm install
pnpm dev
python3 scripts/approval_bot.py
bash scripts/start-omo.sh
```

안정화 후 자동화:

```bash
bash scripts/install-omo-services.sh
systemctl --user daemon-reload
systemctl --user enable --now made-by-ai-telegram.service
systemctl --user enable --now made-by-ai-omo-autoloop.service
```

---

## 문제가 생기면 먼저 볼 곳

- `ops/logs/`
- `ops/last-summary.md`
- `ops/approvals/pending/`
- `journalctl --user -u made-by-ai-omo-autoloop.service -f`
- 텔레그램 진행 로그

---

## 마지막 정리

이 스타터는 다음 전제를 깔고 있습니다.

- GitHub는 버전관리용
- 실행/배포는 로컬 Ubuntu
- OpenCode는 로그인된 계정 사용
- OMO가 주 오케스트레이터 역할
- 텔레그램은 한국어 관제창 역할
- 제품은 허브형 구조로 영구 확장
