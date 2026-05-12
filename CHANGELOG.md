# Changelog

이 문서는 wise-claude-docs 레포의 주요 변경 이력을 기록한다.

---

## 2026-05-12

### 수정 (Part 1·Part 2 공식 docs 동기화)

- `claude-code/01-시작하기.md` — Claude Code 공식 quickstart 기준으로 최신화
  - Native install 자동 업데이트 동작 명시
  - Homebrew `claude-code@latest` cask, Linux apt/dnf/apk 패키지 매니저 안내 추가
  - Windows CMD 설치 명령(`install.cmd`) 추가, Git for Windows 정확한 역할(Bash 도구 한정) 보강
  - Microsoft Foundry(Azure) 인증 옵션, Console 첫 로그인 시 "Claude Code" 워크스페이스 자동 생성 안내 추가
  - 슬래시 명령 표에 `/resume` 추가, `claude commit` 별도 서브명령(실재하지 않음) 제거
  - settings.json 예제에서 존재하지 않는 모델 ID(`claude-opus-4-5`) → `claude-opus-4-7` 정정
- `claude-code/04-훅-시스템.md` — Hook 이벤트·타입·결정 API 최신화
  - 누락되어 있던 이벤트(`Setup`, `UserPromptSubmit` 외 `UserPromptExpansion`, `PermissionDenied`, `PostToolBatch`) 추가, 카테고리별 표로 재정리
  - Hook 타입에 `mcp_tool` 추가(총 5종), `agent`는 실험적으로 분류
  - 종료 코드 외에 JSON 기반 결정 API(`hookSpecificOutput`의 `permissionDecision: allow|deny|ask|defer`, 최상위 `decision: block`) 사용법 추가
  - 참고 문서 링크를 `code.claude.com` 경로로 갱신
- `claude-code/05-MCP-서버-연동.md` — `claude mcp` CLI 실제 동작 기준 최신화
  - `add` 서브명령의 `--transport stdio|sse|http`, `--scope local|user|project`, `-e/--env`, `-H/--header`, OAuth 플래그(`--client-id`, `--client-secret`, `--callback-port`) 정리
  - scope 표를 3단계(local/user/project)로 확장, workspace trust 다이얼로그·`reset-project-choices` 동작 추가
  - 보조 서브명령(`add-json`, `add-from-claude-desktop`, `serve`) 안내 추가
  - 참고 문서 링크 `code.claude.com`으로 갱신, Anthropic MCP Registry API 링크 추가
- `claude-code/03-커스텀-스킬.md` — 공식 Skills 문서 기준 대폭 보강
  - 4단계 scope(Enterprise/Personal/Project/Plugin) 표로 재정리, 라이브 변경 감지·모노레포 nested discovery 추가
  - "Custom commands가 스킬로 통합됨" 안내와 번들 스킬(`/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`) 소개 추가
  - Frontmatter 표를 공식 필드 기준으로 재작성: `name` 선택, `when_to_use`, `arguments`, `hooks`, `shell`, `paths`(glob) 추가; `effort` 값은 `low/medium/high/xhigh/max`로 정정
  - 변수 치환에 `$ARGUMENTS[N]`, 명명 인자 `$name`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`, `${CLAUDE_SKILL_DIR}` 추가
  - 동적 컨텍스트 주입에 multi-line ```` ```! ```` 블록과 `disableSkillShellExecution` 정책 안내 추가
  - 보조 파일에 `scripts/` 실행 자산 패턴 명시(참조용 `references/`와 구분)
  - 이 문서 레포에 `skills/` 디렉터리가 없음을 명확화하고, 예시는 별도 레포 사례로 표기
  - `version` 필드는 공식 frontmatter가 아닌 커뮤니티 컨벤션임을 명시
- `claude/06-도구-사용.md` — Tool use API 최신화
  - Client tool / Server tool(`web_search`, `code_execution`, `web_fetch`, `tool_search`) 구분 추가, 서버 도구 호출 예시 보강
  - `"strict": true` 옵션(스키마 정합성 강제) 섹션 추가
  - 참고 문서 링크를 `platform.claude.com` 경로로 갱신

### 점검 결과 (Part 1·Part 2 변경 없음)

- `claude/01-03`(프롬프트 기초·고급·시스템): 모델 무관한 기초 콘텐츠로 stale 위험 낮음 — 본 동기화에서는 점검만, 변경 없음
- `claude/04-모델-선택-가이드.md`, `claude/05`, `claude/07`, `claude/08`: 2026-04-22 시점 갱신본이 현재 라인업과 일치
- `claude-code/02-CLAUDE-md-작성-가이드.md`, `claude-code/06-실전-워크플로우.md`, `claude-code/07-단축키와-명령어.md`: 최근(2026-04-12~22) 갱신본 — 본 세션에서는 변경 없음

### 수정 (Part 3·Part 4·Appendix 동기화)

- `claude-cowork/04-외부-도구-연동.md` — 기타 커넥터 표에 **Microsoft 365**·**Slack** 추가(공식 [Plugins 가이드](https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork)에 명시되어 있으나 누락되어 있었음). 전체 카탈로그는 공식 문서와 `anthropics/knowledge-work-plugins` 레포에서 확인하도록 안내 추가.
- `appendix/문제-해결.md` — 참고 문서 URL 3개를 `docs.anthropic.com`에서 새 도메인 `code.claude.com`으로 갱신. 본문은 변경 없음.

### 점검 결과 (Part 3·Part 4·Appendix 변경 없음)

- `claude-cowork/01-03, 05-08`: 2026-04-13 작성본. spot-check 결과(plan 라인업, Skills/Plugins/Scheduled tasks/Dispatch 구조, RBAC·예산 관리, Computer Use 안내) 본문 명백한 stale 없음 — 변경 없음
- `codex/01-08`: 2026-04-22 작성본. spot-check 결과(GPT-5.4 / GPT-5.4-mini / GPT-5.3-codex / -spark 모델 라인업, Seatbelt/Landlock 샌드박스, `approval_policy`/`sandbox_mode`, exec 서브명령 플래그) 본문 명백한 stale 없음 — 변경 없음
- `appendix/맷-포콕-스킬-모음.md`(2026-05-07), `appendix/보리스-체르니-인사이트.md`·`appendix/안드레이-카파시-개념.md`(2026-04-25): 인용 기반의 정적 콘텐츠로 추가 갱신 없음

### 동기화 범위 메모

본 동기화는 외부 공식 docs와의 fact-check 깊이가 섹션별로 다르다. Part 1·Part 2(특히 5개 핵심 문서)는 공식 docs와 deep diff를 수행했고, Part 3·Part 4·Appendix는 spot-check 위주로 진행했다 — 후자의 본문은 일반적 설명 위주이며 명백한 stale을 발견하지 못해 변경하지 않았다. 다음 동기화 시에는 가격 표·커넥터 카탈로그 등 데이터성 콘텐츠를 우선 검증할 것을 권장한다.

---

## 2026-04-22

### 수정

- `claude/07-이미지-입력.md` — 이미지 크기/장수 제한 수치 최신 공식 Vision 문서 기준으로 교체
  - 기존: "API 5MB, claude.ai 10MB" (오류)
  - 수정: claude.ai 메시지당 20장, API 200K 모델 요청당 100장·그 외 모델 600장, 표준 엔드포인트 요청 크기 32MB
- `claude/06-도구-사용.md` — Extended Thinking과 `tool_choice` 조합 제약 추가
  - thinking 활성 시 `auto`와 `none`만 허용, `any`·특정 tool 강제는 API 에러
- `claude/08-프롬프트-캐싱.md` — 최신 캐싱 기능 반영
  - 자동 캐싱(Automatic Prompt Caching)과 breakpoint 슬롯 예약 동작 추가
  - `ttl: "1h"` 지정 문법과 혼합 TTL 사용 시 순서 제약(1h이 5m보다 앞) 추가
  - 참고 문서 링크를 `platform.claude.com` 경로로 갱신
- `claude/04-모델-선택-가이드.md`, `claude/05-확장-사고.md`, `claude/07-이미지-입력.md` — 공식 문서 재확인 후 단정문 조정
  - `Option+P`/`Alt+P`(모델 전환), `Option+T`/`Alt+T`(thinking 토글), `Ctrl+V`(이미지 붙여넣기)는 Claude Code 공식 [Interactive mode](https://code.claude.com/docs/en/interactive-mode) 문서에 모두 명시되어 있어 유지하되, macOS Option-as-Meta 설정 조건과 출처 링크를 함께 표시
  - "Extended Thinking이 복잡도에 따라 자동 활성화된다"는 서술은 공식 문서 근거가 없어 관측 기반 참고 설명으로 완화
  - "파일 경로만 언급하면 자동 분석된다"는 서술도 공식 근거가 없어 "`Read` 도구로 분석할 수 있다, 요청을 명시하는 편이 안정적" 수준으로 완화

### 변경

- `claude-code/02-CLAUDE-md-작성-가이드.md` — "자동 메모리(Auto Memory)" 섹션 대폭 확장
  - 네 가지 메모리 타입(user / feedback / project / reference) 분류와 선택 기준
  - 메모리 파일 frontmatter 포맷(`name`, `description`, `type`)과 feedback/project 본문 구조(`**Why:**` / `**How to apply:**`)
  - `MEMORY.md` 인덱스 파일 형식·200줄 제한·한 줄 포인터 규칙
  - 저장 금기 목록(코드 패턴, git 이력, 디버깅 레시피 등)과 이유
  - 검증 원칙 — 메모리는 작성 시점 스냅샷이므로 경로·함수명 재확인 후 사용
  - 플랜·태스크·CLAUDE.md와 메모리의 경계 정리

### 추가

- **Part 4: Codex CLI 활용** — `codex/` 디렉터리에 7개 문서 신규 작성
  - `01-시작하기.md` — 설치, 인증, 세 가지 승인 모드, 첫 작업 따라하기
  - `02-AGENTS-md-작성-가이드.md` — AGENTS.md 파일 구조, 계층, 섹션별 작성 원칙
  - `03-모델과-설정.md` — o3/o4-mini/codex-1 비교, config.yaml 구조, 환경 변수
  - `04-샌드박스와-보안.md` — macOS Seatbelt vs Linux Landlock, 커널 수준 격리 원리
  - `05-실전-워크플로우.md` — Git 연동, 기능 구현, 리팩토링, 버그 수정, 코드 리뷰 패턴
  - `06-비대화형-모드와-자동화.md` — codex exec, GitHub Actions 연동, JSON 출력
  - `07-Claude-Code와-비교.md` — 성능, 보안, 자동화, 비용 비교 및 상황별 선택 가이드
  - `08-단축키와-명령어.md` — 서브명령어, 글로벌 플래그, exec/resume/fork 전용 플래그, 슬래시 명령어 전체 레퍼런스
- **README.md** — Part 4 Codex CLI 섹션, 학습 경로 D(자동화/CI 담당자) 추가

---

## 2026-04-13

### 추가

- **Part 3: Claude Cowork 활용** — `claude-cowork/` 디렉토리에 8개 문서 신규 작성
  - `01-시작하기.md` — Cowork 소개, 설치, Chat/Code 비교, 첫 작업 따라하기
  - `02-파일-다루기.md` — 폴더 공유, 파일 읽기/생성/수정, Excel/Word/PPT/PDF 생성
  - `03-효과적인-지시-작성법.md` — 나쁜 지시 vs 좋은 지시 8쌍, 5원칙, 프롬프트 템플릿
  - `04-외부-도구-연동.md` — Gmail/Drive/Calendar/Zoom/DocuSign/금융 데이터 커넥터
  - `05-반복-작업-자동화.md` — 스킬/플러그인, 예약 작업, Dispatch 모바일 연동
  - `06-실전-활용-사례.md` — 6개 직무(마케팅/재무/법무/운영/리서치/HR) × 3개 시나리오
  - `07-안전하게-사용하기.md` — 보안 4계층, 폴더 권한, Computer Use 주의사항
  - `08-팀-도입-가이드.md` — RBAC, 예산 관리, 사용량 분석, 3단계 도입 전략
- **README.md** — Part 3 섹션, 학습 경로 C(비개발자용), Cowork 공식 문서 링크 추가

### 변경

- **전체 25개 문서** — 헤더에 `최초 작성` / `마지막 수정` 날짜 메타데이터 추가
- **Cowork 참고 문서** — 깨진 URL 5개를 검증된 공식 소스로 교체
  - `docs.anthropic.com/en/docs/claude-cowork` (404) → `support.claude.com` Help Center 링크
  - `support.anthropic.com` (404) → `support.claude.com` 정식 경로
  - Skilljar, GitHub 플러그인 레포, claude.com 튜토리얼 등 추가

---

## 2026-04-12

### 변경

- `claude-code/06-실전-워크플로우.md` — 내용 업데이트
- `claude-code/07-단축키와-명령어.md` — 내용 업데이트

---

## 2026-03-31

### 추가

- **Part 1: Claude 활용** — `claude/` 디렉토리에 8개 문서 작성
- **Part 2: Claude Code 활용** — `claude-code/` 디렉토리에 8개 문서 작성
- **부록** — `appendix/문제-해결.md` 트러블슈팅 가이드
- **README.md** — 프로젝트 소개, 학습 경로 A/B, 전체 문서 목록
- `skill-guide/` — 커스텀 스킬 가이드 HTML 웹뷰
- `visuals/` — Claude Code 가이드 인터랙티브 HTML 허브
