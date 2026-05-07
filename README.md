# Claude & Claude Code & Claude Cowork & Codex CLI 활용 가이드

이 가이드는 Claude, Claude Code, Claude Cowork, OpenAI Codex CLI를 실전에서 효과적으로 활용하기 위한 공식 문서 기반 학습 자료입니다. 각 도구의 공식 문서를 바탕으로 정리했으며, 처음 시작하는 사람부터 이미 사용 중인 사람까지 모두를 대상으로 합니다.

---

## 이 가이드를 읽기 전에

Claude는 AI 모델이고, Claude Code는 Anthropic의 개발자용 CLI 에이전트, Claude Cowork는 비개발자를 위한 데스크톱 에이전트, Codex CLI는 OpenAI의 터미널 기반 코딩 에이전트입니다. 이 가이드는 네 도구를 모두 다루며, Part 1(Claude), Part 2(Claude Code), Part 3(Claude Cowork), Part 4(Codex CLI)로 나뉩니다.

---

## 학습 경로

### 경로 A: 처음 시작하는 분

Claude Code를 처음 설치하거나, 프롬프트 작성 경험이 없다면 아래 순서대로 읽을 것을 권장합니다.

| 순서 | 문서 | 이유 |
|------|------|------|
| 1 | [Claude Code 시작하기](claude-code/01-시작하기.md) | 설치와 기본 사용법부터 |
| 2 | [프롬프트 기초](claude/01-프롬프트-기초.md) | Claude에게 잘 말하는 법 |
| 3 | [CLAUDE.md 작성 가이드](claude-code/02-CLAUDE-md-작성-가이드.md) | 프로젝트에 Claude 길들이기 |
| 4 | [모델 선택 가이드](claude/04-모델-선택-가이드.md) | 상황에 맞는 모델 고르기 |
| 5 | [단축키와 슬래시 명령어](claude-code/07-단축키와-명령어.md) | 작업 속도 높이기 |
| 6 | 나머지 | 필요한 주제 선택 |

### 경로 B: 이미 사용 중인 분

기본은 알고 있고 특정 주제를 더 깊이 파고 싶다면, 아래 전체 문서 목록에서 관심 있는 항목을 직접 선택하세요.

### 경로 D: 자동화/CI 담당자 — Codex CLI 시작하기

CI/CD 파이프라인에 AI를 붙이거나 반복 작업을 완전 자동화하고 싶다면 아래 순서를 추천합니다.

| 순서 | 문서 | 이유 |
|------|------|------|
| 1 | [Codex CLI 시작하기](codex/01-시작하기.md) | 설치와 세 가지 승인 모드 이해 |
| 2 | [AGENTS.md 작성 가이드](codex/02-AGENTS-md-작성-가이드.md) | 프로젝트 규칙 에이전트에 전달하기 |
| 3 | [샌드박스와 보안](codex/04-샌드박스와-보안.md) | 자동화 전 보안 모델 이해 |
| 4 | [비대화형 모드와 자동화](codex/06-비대화형-모드와-자동화.md) | GitHub Actions 등 파이프라인 연동 |
| 5 | [Claude Code와 비교](codex/07-Claude-Code와-비교.md) | 도구 선택 기준 이해 |
| 6 | 나머지 | 필요한 주제 선택 |

### 경로 C: 비개발자 — Claude Cowork 시작하기

개발자가 아니고 문서 작업, 데이터 분석, 파일 관리 등 지식 노동 자동화에 관심이 있다면 아래 순서를 추천합니다.

| 순서 | 문서 | 이유 |
|------|------|------|
| 1 | [Cowork 시작하기](claude-cowork/01-시작하기.md) | 설치와 첫 작업 따라하기 |
| 2 | [파일 다루기](claude-cowork/02-파일-다루기.md) | 파일 공유와 생성의 기본 |
| 3 | [효과적인 지시 작성법](claude-cowork/03-효과적인-지시-작성법.md) | Cowork에게 잘 말하는 법 |
| 4 | [실전 활용 사례](claude-cowork/06-실전-활용-사례.md) | 직무별 레시피 모음 |
| 5 | [안전하게 사용하기](claude-cowork/07-안전하게-사용하기.md) | 보안과 주의사항 |
| 6 | 나머지 | 필요한 주제 선택 |

---

## 전체 문서 목록

### Part 1: Claude 활용

| 문서 | 난이도 | 설명 |
|------|--------|------|
| [프롬프트 기초](claude/01-프롬프트-기초.md) | 기초 | 명확한 지시, 역할 부여, 구조화된 출력 |
| [고급 프롬프팅 기법](claude/02-고급-프롬프팅-기법.md) | 중급 | CoT, Few-shot, XML 태그, 프롬프트 체이닝 |
| [시스템 프롬프트 설계](claude/03-시스템-프롬프트-설계.md) | 중급 | 설계 원칙, 모범 사례, 안티패턴 |
| [모델 선택 가이드](claude/04-모델-선택-가이드.md) | 기초 | Opus/Sonnet/Haiku 비교, 상황별 선택 기준 |
| [확장 사고](claude/05-확장-사고.md) | 심화 | 확장 사고 모드 활용, budget_tokens 설정 |
| [도구 사용](claude/06-도구-사용.md) | 중급 | 외부 함수 호출, 도구 정의, 구조화된 데이터 추출 |
| [이미지 입력](claude/07-이미지-입력.md) | 중급 | 이미지 분석, 스크린샷 기반 작업, 디자인→코드 변환 |
| [프롬프트 캐싱](claude/08-프롬프트-캐싱.md) | 중급~심화 | 반복 입력 캐싱으로 비용 90% 절감, TTL 관리 |

### Part 2: Claude Code 활용

| 문서 | 난이도 | 설명 |
|------|--------|------|
| [시작하기](claude-code/01-시작하기.md) | 기초 | 설치, 인증, 기본 명령어, 권한 모드 |
| [CLAUDE.md 작성 가이드](claude-code/02-CLAUDE-md-작성-가이드.md) | 기초~중급 | 계층 구조, 작성법, .claude/rules/ 활용 |
| [커스텀 스킬](claude-code/03-커스텀-스킬.md) | 중급 | SKILL.md 구조, 트리거 키워드, 버전 관리 |
| [훅 시스템](claude-code/04-훅-시스템.md) | 심화 | 12가지 이벤트, 4가지 타입, 활용 패턴 |
| [MCP 서버](claude-code/05-MCP-서버-연동.md) | 중급~심화 | MCP 개념, 설정 방법, 주요 서버 소개 |
| [실전 워크플로우](claude-code/06-실전-워크플로우.md) | 중급~심화 | Git 연동, 멀티에이전트, 컨텍스트 관리 |
| [단축키와 슬래시 명령어](claude-code/07-단축키와-명령어.md) | 기초 | 키보드 단축키, 슬래시 명령어 전체 레퍼런스 |
| [하네스 엔지니어링](claude-code/08-하네스-엔지니어링.md) | 중급~심화 | 프롬프트 vs 하네스 비교, 6대 레이어, 설계 원칙, 전환 패턴 |

### Part 3: Claude Cowork 활용

| 문서 | 난이도 | 설명 |
|------|--------|------|
| [시작하기](claude-cowork/01-시작하기.md) | 기초 | Cowork 소개, 설치, Chat/Code와의 차이, 첫 작업 따라하기 |
| [파일 다루기](claude-cowork/02-파일-다루기.md) | 기초 | 폴더 공유, 파일 읽기/생성/수정, Excel/Word/PPT/PDF 생성 |
| [효과적인 지시 작성법](claude-cowork/03-효과적인-지시-작성법.md) | 기초~중급 | 나쁜 지시 vs 좋은 지시, 멀티스텝 분해, 프롬프트 템플릿 |
| [외부 도구 연동](claude-cowork/04-외부-도구-연동.md) | 중급 | Gmail, Drive, Calendar, Zoom, DocuSign, 금융 데이터 연동 |
| [반복 작업 자동화](claude-cowork/05-반복-작업-자동화.md) | 중급 | 스킬/플러그인, 예약 작업, Dispatch 모바일 연동 |
| [실전 활용 사례](claude-cowork/06-실전-활용-사례.md) | 기초~중급 | 마케팅/재무/법무/운영/리서치/HR 직무별 시나리오 |
| [안전하게 사용하기](claude-cowork/07-안전하게-사용하기.md) | 기초 | 보안 4계층, 폴더 권한, 민감 데이터 보호, Computer Use 주의사항 |
| [팀 도입 가이드](claude-cowork/08-팀-도입-가이드.md) | 중급~심화 | RBAC, 예산 관리, 사용량 분석, 단계별 도입 전략 |

### Part 4: Codex CLI 활용

| 문서 | 난이도 | 설명 |
|------|--------|------|
| [시작하기](codex/01-시작하기.md) | 기초 | 설치, 인증, 세 가지 승인 모드, 첫 작업 따라하기 |
| [AGENTS.md 작성 가이드](codex/02-AGENTS-md-작성-가이드.md) | 기초~중급 | 파일 구조, 계층, 섹션별 작성 원칙, 실전 예시 |
| [모델과 설정](codex/03-모델과-설정.md) | 기초~중급 | o3/o4-mini/codex-1 비교, config.yaml 구조 |
| [샌드박스와 보안](codex/04-샌드박스와-보안.md) | 중급 | macOS Seatbelt vs Linux Landlock, 커널 수준 격리 |
| [실전 워크플로우](codex/05-실전-워크플로우.md) | 중급 | Git 연동, 기능 구현, 리팩토링, 버그 수정, 코드 리뷰 |
| [비대화형 모드와 자동화](codex/06-비대화형-모드와-자동화.md) | 중급~심화 | codex exec, GitHub Actions, JSON 출력, Makefile 통합 |
| [Claude Code와 비교](codex/07-Claude-Code와-비교.md) | 기초~중급 | 성능, 보안, 자동화, 비용 비교 및 상황별 선택 가이드 |
| [단축키와 명령어](codex/08-단축키와-명령어.md) | 기초 | 서브명령어, 글로벌 플래그, 슬래시 명령어 전체 레퍼런스 |

### 부록

| 문서 | 설명 |
|------|------|
| [트러블슈팅](appendix/문제-해결.md) | 자주 겪는 문제와 해결법 |
| [보리스 체르니의 Claude Code 설계 사상](appendix/보리스-체르니-인사이트.md) | Anthropic Head of Claude Code의 공개 발언 정리 — "왜 그렇게 만들었는가" |
| [안드레이 카파시의 LLM 개념 사전](appendix/안드레이-카파시-개념.md) | Software 3.0, Vibe Coding, Context Engineering 등 시그니처 개념의 1차 출처 정리 |
| [맷 포콕의 "Skills For Real Engineers" 정리](appendix/맷-포콕-스킬-모음.md) | `mattpocock/skills` 저장소의 4대 실패 모드 진단과 17개 스킬 카탈로그 정리 |

---

## 이 프로젝트의 커스텀 스킬

`skills/` 디렉토리에는 실전에서 사용 중인 커스텀 스킬들이 있습니다. 각 스킬은 `SKILL.md`와 필요한 경우 `references/` 디렉토리로 구성됩니다.

| 스킬 | 설명 |
|------|------|
| `code-analyzer` | 코드베이스 구조와 비즈니스 로직을 분석하여 Mermaid 다이어그램 포함 리포트 생성 |
| `claude-docs-reviewer` | 가이드 문서를 Anthropic 공식 문서와 대조하여 최신성과 정확성을 검증하고 검수 리포트 생성 |
| `humanizer` | AI가 생성한 텍스트에서 AI 냄새를 제거하고 자연스러운 사람 문체로 교정 |
| `junit-test-writer` | JUnit 5 기반 단위 테스트, 슬라이스 테스트, 통합 테스트 코드 작성 |
| `performance-profiler` | Java/Spring 코드의 N+1 쿼리, 알고리즘 비효율, 메모리 낭비 등 성능 병목 분석 |
| `refactor-advisor` | 코드 스멜, SOLID 위반, 디자인 패턴 적용 기회를 식별하고 리팩토링 방향 제시 |
| `spec-writer` | 대화형 인터뷰를 통해 IEEE 830 표준 기반 시스템 요구사항 명세서(SRS) 작성 |
| `study-helper` | 기술 학습 노트의 AI 냄새 제거, 오타 수정, 팩트체크 수행 후 검수 리포트 제공 |

커스텀 스킬을 직접 만들고 싶다면 [커스텀 스킬 문서](claude-code/03-커스텀-스킬.md)와 함께 `skills/` 디렉토리의 실제 스킬 파일들을 참고하면 좋습니다.

---

## 참고 자료

### Anthropic 공식 문서

- [Anthropic Docs](https://docs.anthropic.com) - API, 모델, 프롬프팅 전반
- [Anthropic Prompt Library](https://docs.anthropic.com/en/prompt-library/library) - 공식 프롬프트 예시 모음
- [Claude Models Overview](https://docs.anthropic.com/en/docs/about-claude/models/overview) - 최신 모델 목록과 스펙

### Claude Code 공식 문서

- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview) - Claude Code 소개
- [Claude Code Quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart) - 빠른 시작 가이드
- [Claude Code GitHub](https://github.com/anthropics/claude-code) - 소스 및 릴리스 노트

### Codex CLI 공식 문서

- [Codex Overview](https://developers.openai.com/codex/) - Codex CLI 소개
- [Codex CLI GitHub](https://github.com/openai/codex) - 소스 및 릴리스 노트
- [AGENTS.md 가이드](https://developers.openai.com/codex/guides/agents-md) - 프로젝트 지침 파일 작성법
- [Non-interactive mode](https://developers.openai.com/codex/noninteractive) - CI/CD 자동화

### Claude Cowork 공식 문서

- [Claude Cowork 제품 페이지](https://www.anthropic.com/product/claude-cowork) - 제품 소개
- [Cowork 시작 가이드](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) - 설치 및 설정
- [Cowork 안전 사용 가이드](https://support.claude.com/en/articles/13364135-use-claude-cowork-safely) - 보안 모범 사례
- [플러그인 사용](https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork) - 플러그인 설치 및 관리
- [예약 작업 설정](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) - 반복 작업 자동화
