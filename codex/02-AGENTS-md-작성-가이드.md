# AGENTS.md 작성 가이드

> **난이도**: 기초~중급 | **선행 문서**: [시작하기](01-시작하기.md) | **최초 작성**: 2026-04-22 | **마지막 수정**: 2026-04-22
>
> Codex CLI가 프로젝트 맥락을 이해하도록 AGENTS.md를 작성하는 방법을 다룬다.

---

## 들어가며

AGENTS.md는 Codex 에이전트에게 프로젝트별 지침을 전달하는 파일이다. Claude Code의 CLAUDE.md와 같은 역할이지만, 설계 목표는 다르다. AGENTS.md는 오픈 포맷(open format)이어서 Claude Code, Devin, GitHub Copilot Workspace 등 다양한 AI 에이전트 도구가 공통으로 읽도록 설계되었다. 하나의 파일로 여러 도구에 지침을 전달할 수 있다.

---

## 1. 파일 발견 순서

Codex는 세션 시작 시 전역 지침과 현재 작업 디렉터리까지의 디렉터리별 지침을 읽어 병합한다. 중요한 점은 **각 디렉터리에서는 `AGENTS.override.md`가 있으면 같은 위치의 `AGENTS.md`보다 우선하며, 둘 다 동시에 적용되지 않는다는 것**이다.

```
전역 범위
1. ~/.codex/AGENTS.override.md   (있으면 사용)
2. ~/.codex/AGENTS.md            (override가 없을 때 사용)

프로젝트 범위
3. 작업 디렉터리까지의 각 상위 디렉터리에서 다음 중 하나를 선택
   - AGENTS.override.md
   - AGENTS.md
4. 더 가까운 디렉터리의 파일이 더 나중에 적용됨
```

즉, 프로젝트 루트의 AGENTS 문서로 전체 기준을 잡고, 하위 모듈의 AGENTS 문서로 세부 규칙을 덮어쓰는 방식이다.

**파일 크기 제한**: 기본 32 KiB(`~/.codex/config.toml`의 `project_doc_max_bytes` 설정으로 조정 가능).

---

## 2. 기본 구조

AGENTS.md의 형식에 강제 규칙은 없다. 마크다운으로 자유롭게 작성한다. 다만 에이전트가 내용을 파악하기 쉽도록 섹션을 명확히 나누는 것이 좋다.

```markdown
# Project: [프로젝트 이름]

## Overview
이 프로젝트가 무엇인지 한 문단으로 설명한다.

## Tech Stack
- Language: TypeScript 5.x
- Framework: Next.js 14
- Database: PostgreSQL + Prisma ORM
- Testing: Jest + React Testing Library

## Code Style
코딩 컨벤션과 린팅 규칙을 기술한다.

## Important Constraints
절대 건드리지 말아야 할 것, 팀 승인이 필요한 작업 등 제약사항.

## Testing
테스트 작성 기준, 커버리지 요구사항, 실행 방법.

## Security
보안 관련 주의사항.
```

---

## 3. 섹션별 작성 원칙

### Overview

프로젝트의 목적과 핵심 구성 요소를 짧게 기술한다. 에이전트가 "이 코드가 무엇을 하는가"를 파악하는 데 사용한다.

```markdown
## Overview
전자상거래 플랫폼의 주문 관리 백엔드. 주문 생성, 재고 차감, 결제 처리, 배송 추적을 담당한다.
판매자 포털(`/seller`)과 고객 앱(`/customer`) API를 동시에 제공한다.
```

### Code Style

린터, 포매터 설정 파일의 위치와 핵심 컨벤션을 기술한다. 에이전트가 생성하는 코드의 스타일이 팀 기준에 맞도록 안내하는 역할이다.

```markdown
## Code Style
- ESLint: `.eslintrc.js` 기준, 규칙 변경 금지
- Prettier: `.prettierrc` 기준, 자동 포맷 적용
- 함수명: camelCase, 클래스명: PascalCase
- 상수: UPPER_SNAKE_CASE
- 타입 단언(`as Type`) 사용 금지 — 제네릭 또는 타입 가드 사용
- any 타입 사용 금지
```

### Important Constraints

잘못 건드리면 심각한 문제가 생기는 영역을 명시한다. 에이전트가 변경을 시도하려 할 때 멈추거나 확인을 요청하도록 유도한다.

```markdown
## Important Constraints
- `db/migrations/` 파일은 절대 수정하지 않는다. 새 마이그레이션만 추가 가능.
- `src/payment/` 모듈은 PCI-DSS 심사 대상이다. 변경 전 보안팀 승인 필요.
- `.env` 파일은 절대 커밋하지 않는다. 예시는 `.env.example`에만 기록.
- `package.json`의 버전 다운그레이드는 팀 논의 후 결정.
```

### Testing

테스트 작성 기준과 실행 방법을 기술한다. 에이전트가 코드를 변경할 때 테스트도 함께 작성하거나 업데이트하도록 유도한다.

```markdown
## Testing
- 단위 테스트: Jest, `src/**/*.test.ts`
- 통합 테스트: `tests/integration/` — 실제 DB 사용, 모킹 금지
- 최소 커버리지: 라인 80%, 브랜치 70%
- 테스트 실행: `npm test`
- 새 기능 추가 시 반드시 테스트 포함
```

### Security

민감 데이터 처리 원칙, 금지된 패턴 등을 기술한다.

```markdown
## Security
- API 키, 비밀번호, 토큰을 코드에 하드코딩하지 않는다.
- 사용자 입력은 반드시 zod로 검증한 뒤 사용한다.
- SQL은 Prisma ORM을 통해서만 실행한다 (raw query 금지).
- 로그에 개인정보(이름, 이메일, 전화번호)를 출력하지 않는다.
```

---

## 4. 전역 설정 vs 프로젝트 설정

개인 기본값은 `~/.codex/AGENTS.md`에, 프로젝트 규칙은 프로젝트 루트의 AGENTS.md에 분리하여 관리한다.

**`~/.codex/AGENTS.md` — 개인 기본값 예시**

```markdown
# Global Defaults

## General Behavior
- 변경 사항을 적용하기 전 영향 범위를 간략히 설명한다.
- 불확실한 내용은 추측하지 않고 질문한다.
- 영어 코드, 한국어 주석 정책을 따른다.

## Commit Convention
- 커밋 메시지는 Conventional Commits 형식 사용 (feat:, fix:, docs: 등)
- 한 커밋에 하나의 논리적 변경만 포함
```

**프로젝트 루트 `AGENTS.md` — 프로젝트별 규칙**

```markdown
# Project: Order Service

## Tech Stack
- Java 21 + Spring Boot 3.x
- PostgreSQL 15

## Code Style
- Google Java Style Guide 적용
- 모든 public 메서드에 Javadoc 필수
```

---

## 5. 실전 예시: Spring Boot 프로젝트

```markdown
# Project: Wise Commerce API

## Overview
B2B 전자상거래 플랫폼 백엔드. 판매자 관리, 상품 카탈로그, 주문 처리, 정산을 담당한다.
Java 21 + Spring Boot 3.2, PostgreSQL 15, Redis 7 환경에서 실행된다.

## Tech Stack
- Java 21 (virtual threads 활성화)
- Spring Boot 3.2
- Spring Data JPA + QueryDSL
- PostgreSQL 15 (메인 DB) / Redis 7 (캐시, 세션)
- Flyway (DB 마이그레이션)
- JUnit 5 + Testcontainers (통합 테스트)

## Project Structure
src/main/java/com/wisehero/commerce/
├── domain/        # 도메인 모델, 리포지토리 인터페이스
├── application/   # 유즈케이스, 서비스
├── infrastructure/# JPA 구현체, 외부 API 클라이언트
└── presentation/  # REST 컨트롤러, DTO

## Code Style
- Lombok 사용 금지 — 명시적 생성자, getter/setter 작성
- 레코드 클래스(record) 적극 활용 (DTO, VO)
- 트랜잭션은 application 레이어에서만 관리
- N+1 쿼리 발생 시 반드시 fetch join 또는 @BatchSize 적용

## Important Constraints
- `src/main/resources/db/migration/` 파일 수정 금지. 새 버전 파일만 추가.
- `infrastructure/payment/` 패키지는 PG사 계약 코드. 변경 전 리드 엔지니어 확인.
- `application.yml`의 `spring.datasource.url` 변경 금지.

## Testing
- 단위 테스트: 외부 의존성 없이 순수 자바로 작성
- 슬라이스 테스트: @DataJpaTest, @WebMvcTest 활용
- 통합 테스트: Testcontainers로 실제 PostgreSQL/Redis 사용, 모킹 금지
- 테스트 실행: `./gradlew test`
- 커버리지 기준: 라인 75% 이상

## Git Convention
- 브랜치: feature/OC-{티켓번호}-{설명}
- 커밋: feat(module): 설명 (Conventional Commits)
- PR: 기능 단위로 분리, 500줄 초과 시 분할 요청
```

---

## 6. CLAUDE.md와의 차이점

| 항목 | AGENTS.md | CLAUDE.md |
|------|-----------|-----------|
| 설계 목표 | 다양한 AI 도구 공통 | Claude Code 전용 |
| 형식 | 자유 마크다운 | 자유 마크다운 |
| 계층 구조 | 전역/프로젝트/하위 디렉터리 | 전역/프로젝트/하위 디렉터리 |
| 오버라이드 | `AGENTS.override.md` 별도 파일 | 같은 파일 내 섹션 |
| 도구 지원 | Codex, Devin, Copilot Workspace 등 | Claude Code |

실용적으로는 두 파일의 내용이 거의 동일하다. 팀에서 여러 AI 도구를 사용한다면 AGENTS.md 하나로 통일하고, Claude Code에서는 `CLAUDE.md`에 `@AGENTS.md`로 임포트하는 방식을 고려할 수 있다.

---

## 7. 핵심 정리

- AGENTS.md는 Codex에게 프로젝트 규칙을 전달하는 마크다운 파일이다.
- 전역 범위와 프로젝트 디렉터리 체인을 따라 AGENTS 문서를 계층적으로 적용한다.
- 같은 디렉터리에서는 `AGENTS.override.md`가 `AGENTS.md`보다 우선한다.
- Code Style, Important Constraints, Testing, Security 섹션을 중심으로 작성한다.
- 오픈 포맷이므로 Claude Code, Devin 등 다른 AI 도구도 함께 사용할 수 있다.
- 최대 크기는 기본 32 KiB다. 불필요한 내용은 넣지 않는다.

---

## 참고 문서

- [Custom instructions with AGENTS.md – Codex](https://developers.openai.com/codex/guides/agents-md)
- [CLAUDE.md 작성 가이드](../claude-code/02-CLAUDE-md-작성-가이드.md)
