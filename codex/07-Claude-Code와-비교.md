# Claude Code와 비교

> **난이도**: 기초~중급 | **선행 문서**: [시작하기](01-시작하기.md) | **최초 작성**: 2026-04-22 | **마지막 수정**: 2026-04-22
>
> Codex CLI와 Claude Code의 특징을 비교하고, 상황별 선택 기준을 제시한다.

---

## 들어가며

Codex CLI(OpenAI)와 Claude Code(Anthropic)는 둘 다 터미널 기반 AI 코딩 에이전트다. 표면적인 사용 경험은 비슷하지만, 보안 모델, 자율성 수준, 성능 특성, 가격 구조에서 차이가 있다. 이 문서는 두 도구를 실제로 사용하는 관점에서 비교한다.

---

## 1. 한눈에 비교

| 항목 | Codex CLI | Claude Code |
|------|-----------|-------------|
| 개발사 | OpenAI | Anthropic |
| 기반 모델 | gpt-5.4, gpt-5.4-mini, gpt-5.3-codex | Claude Sonnet/Opus/Haiku |
| 설치 | `npm install -g @openai/codex` | `npm install -g @anthropic-ai/claude-code` |
| 기본 모드 | Suggest (승인 필요) | 계획 제시 후 승인 |
| 샌드박스 | OS 커널 수준 (Seatbelt/Landlock) | 애플리케이션 레벨 훅 |
| 자율성 | full-auto 모드 지원 | 높은 자율성, 훅으로 통제 |
| 비대화형 실행 | `codex exec` 지원 | `claude -p` 플래그 지원 |
| 프로젝트 지침 파일 | AGENTS.md | CLAUDE.md |
| 설정 파일 | `~/.codex/config.toml` | `~/.claude/settings.json` |
| MCP 지원 | 지원 | 지원 |
| 오픈소스 | MIT 라이선스 | 비공개 |
| 가격 | API 사용량 기반 | $20/월 Pro 또는 API 사용량 |

---

## 2. 코딩 성능

### SWE-Bench Verified (2025년 기준)

SWE-Bench는 실제 GitHub 이슈를 AI가 자동으로 해결하는 능력을 측정하는 벤치마크다.

| 도구/모델 | 점수 (참고값) |
|-----------|-------------|
| Claude Code (Opus 4) | ~80% |
| Codex (gpt-5.3-codex) | 외부 비교 자료 기준 |

> **주의**: SWE-Bench 점수는 모델 버전과 측정 시점에 따라 달라진다. 최신 수치는 공식 리더보드를 확인한다.

Claude Code가 복잡한 멀티파일 변경에서 높은 정확도를 보이는 경향이 있다.

### Terminal-Bench

터미널 작업 자동화 능력을 측정하는 벤치마크다.

| 도구 | 점수 |
|------|------|
| Codex CLI | ~77% |
| Claude Code | 비교 데이터 없음 |

Codex는 셸 명령 자동화와 파이프라인 통합에 강점이 있다.

### 비용과 효율

비용 효율은 모델 선택, 승인 정책, 도구 사용량, 프롬프트 길이에 따라 크게 달라진다. 따라서 특정 배수로 단정하기보다, 실제 팀 워크로드로 직접 측정하는 편이 안전하다.

---

## 3. 보안 모델 차이

### Claude Code

훅(hook) 시스템으로 위험한 명령을 차단한다. 예를 들어 `rm -rf`나 `git push --force` 같은 명령이 실행되기 전 훅이 실행되어 사용자에게 확인을 요청하거나 거부할 수 있다. 이 방식은 유연하지만 훅이 누락되면 우회될 수 있다.

### Codex CLI

OS 커널이 직접 프로세스를 격리한다. 다만 샌드박스가 작동하려면 macOS의 Seatbelt나 Linux의 Landlock 같은 커널 기능이 필요하고, 일부 컨테이너 환경에서는 제약이 있다. 또 Codex에도 별도의 훅 기능이 있으므로, "훅이 전혀 없다"라고 보기는 어렵다.

**실용적 차이**: 두 도구 모두 실수에 의한 심각한 손상을 방지한다. 보안 측면에서 절대적 우위를 판단하기보다는 팀의 환경에 맞는 도구를 선택하는 것이 더 중요하다.

---

## 4. 워크플로우 자동화 비교

### Codex CLI의 강점 — 비대화형 자동화

`codex exec`로 비대화형 실행 흐름을 만들기 쉽다. CI/CD 파이프라인에 붙이기 좋다.

```bash
# GitHub Actions에서
codex exec "주간 의존성 업데이트 후 테스트 실행" --full-auto
```

### Claude Code의 강점 — 멀티에이전트 병렬 처리

`claude --agent` 플래그로 여러 에이전트를 병렬로 실행할 수 있다. 큰 코드베이스를 여러 모듈로 나눠 동시에 작업할 때 유리하다.

```bash
# 두 에이전트가 서로 다른 모듈을 병렬로 처리
claude --agent "order 모듈 리팩토링" &
claude --agent "payment 모듈 리팩토링" &
wait
```

### 훅 시스템

Claude Code는 훅 기반 자동화가 강점으로 자주 언급된다. Codex 역시 훅 기능을 제공하므로, 이 항목은 "유무"보다는 훅의 성숙도와 팀이 익숙한 워크플로우 차이로 비교하는 편이 정확하다.

---

## 5. 프로젝트 지침 파일 비교

### AGENTS.md vs CLAUDE.md

두 파일은 역할이 같다. 에이전트에게 프로젝트 규칙을 전달하는 마크다운 파일이다.

**AGENTS.md**는 오픈 포맷이다. Codex, Devin, GitHub Copilot Workspace 등 여러 AI 도구가 읽도록 설계되었다. 팀에서 여러 AI 도구를 사용한다면 AGENTS.md 하나로 통일할 수 있다.

**CLAUDE.md**는 Claude Code 전용이다. `@filename` 임포트, 멀티파일 구조, 스킬 트리거 등 Claude Code 고유 기능을 활용할 수 있다.

**권장 방식**: 두 도구를 함께 사용한다면 AGENTS.md를 기본으로 하고, CLAUDE.md에서 `@AGENTS.md`로 임포트한다.

```markdown
# CLAUDE.md
@AGENTS.md

## Claude Code 전용 설정
<!-- Claude Code 고유 기능 설정 -->
```

---

## 6. 상황별 선택 가이드

### Codex CLI를 선택하는 경우

**CI/CD 자동화 중심**

사람이 관여하지 않는 자동화 파이프라인에 AI를 붙이려면 Codex가 적합하다. `codex exec`의 비대화형 실행 모델이 파이프라인에 자연스럽게 맞는다.

```bash
# 주간 코드 품질 개선 자동화
codex exec "사용하지 않는 import 정리 후 테스트 실행" --full-auto
```

**OS 수준 샌드박스가 중요한 경우**

보안 요구사항이 높거나, full-auto 모드에서 에이전트가 실행하는 명령에 대한 신뢰가 필요한 경우.

**비용 구조를 단순하게 관리하고 싶은 경우**

Codex 쪽 자동화 흐름이 팀의 기존 파이프라인과 잘 맞는다면 운영 비용을 예측하고 관리하기 쉬울 수 있다. 다만 실제 비용 우위는 작업 패턴에 따라 달라진다.

**여러 AI 도구를 함께 사용하는 팀**

AGENTS.md 오픈 포맷으로 Codex, Devin 등 여러 도구에 같은 지침을 공유할 수 있다.

### Claude Code를 선택하는 경우

**복잡한 코드 변경에서 특정 모델 선호가 뚜렷한 경우**

팀이 이미 Claude 계열 모델에서 더 좋은 결과를 경험했다면 그 흐름을 유지하는 것이 합리적일 수 있다.

**멀티에이전트 병렬 작업**

여러 모듈을 동시에 처리하는 병렬 워크플로우.

**세밀한 생명주기 제어**

12가지 훅 이벤트로 코드 변경 전후 동작을 세밀하게 제어.

**Claude Code 특화 스킬**

커스텀 스킬(SKILL.md)로 팀 고유의 워크플로우를 재사용 가능한 슬래시 명령으로 만들 수 있다.

---

## 7. 함께 사용하기

두 도구는 경쟁 관계가 아닌 보완 관계로 활용할 수 있다.

**추천 조합**

- **일상 개발**: Claude Code (더 높은 정확도, 세밀한 제어)
- **CI/CD 자동화**: Codex CLI (비대화형 실행, 비용 효율)
- **프로젝트 지침**: AGENTS.md를 기본, CLAUDE.md에서 임포트

```bash
# 개발 중
claude  # Claude Code로 대화하며 코딩

# CI/CD에서
codex exec "주간 의존성 업데이트" --full-auto  # Codex로 자동화
```

---

## 8. 핵심 정리

- 자동화 파이프라인 통합은 Codex CLI가 특히 자연스럽다.
- 보안 모델에서 Codex는 OS 커널 수준, Claude Code는 훅 기반 애플리케이션 수준이다.
- 두 도구를 함께 쓸 때는 AGENTS.md로 지침을 공유하고, 역할을 분리한다.
- 비용 비교는 실제 팀 워크로드로 검증하는 편이 안전하다.
- 멀티에이전트 병렬 처리가 필요하다면 Claude Code를 선택한다.

---

## 참고 문서

- [openai/codex GitHub](https://github.com/openai/codex)
- [Claude Code 시작하기](../claude-code/01-시작하기.md)
- [Claude Code 실전 워크플로우](../claude-code/06-실전-워크플로우.md)
