# Changelog

이 문서는 wise-claude-docs 레포의 주요 변경 이력을 기록한다.

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
