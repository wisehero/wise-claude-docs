# 김영규의 Oh My OpenAgent 해부

> **난이도**: 중급~심화 | **선행 문서**: `claude-code/08-하네스-엔지니어링.md`, `claude-code/03-커스텀-스킬.md` | **최초 작성**: 2026-05-13
>
> 한국 개발자 김영규([@code-yeongyu](https://github.com/code-yeongyu))가 만든 [`oh-my-openagent`](https://github.com/code-yeongyu/oh-my-openagent)(이하 OMO)는 OpenCode 위에 얹는 플러그인 형태의 멀티모델 에이전트 하네스다. 2025년 말 `oh-my-opencode`로 출시됐고, Anthropic의 OpenCode 차단 사건 이후 2026년 초 `oh-my-openagent`로 리브랜딩됐다(npm 패키지는 호환 기간 동안 양쪽 이름으로 공개). 이 문서는 README와 공식 docs(`docs/manifesto.md`, `docs/guide/overview.md`, `docs/guide/team-mode.md`, `docs/reference/features.md`)를 1차 출처로 두고 정리한다.
>
> 이 가이드 본문은 Claude Code / Codex CLI 중심이지만, OMO는 두 진영의 좋은 패턴을 모아 OpenCode 쪽으로 옮겨놓은 흥미로운 표본이다. 하네스 엔지니어링과 스킬 설계의 모범 사례를 한 사람의 워크플로우 안에서 일관되게 보고 싶다면 가져갈 게 많다.

---

## 1. 무엇이 화제가 됐나

저자 본인의 표현은 다음과 같다.

> "Install oh-my-openagent. Type `ultrawork`. Done."

GSD/BMAD/Spec-Kit 같은 "프로세스 통째로 가져가는" 프레임워크가 아니라, **다른 모델·다른 도구의 검증된 패턴을 한 하네스 안에 흡수**한 결과물이다. AmpCode의 deep mode, Claude Code의 hook/skill/MCP 호환성, [Can Bölük의 oh-my-pi에서 가져온 hash-anchored 편집 도구](https://blog.can.ac/2026/02/12/the-harness-problem/), [맷 포콕 시리즈](맷-포콕-스킬-모음.md)의 스킬 패턴 등을 한 곳에 모았다.

화제가 된 결정적 사건 두 개:

- 사용자 인용 ["Anthropic blocked OpenCode because of us."](https://x.com/thdxr/status/2010149530486911014) — OpenCode 메인테이너 SST(@thdxr)의 X 게시물. 이로 인해 `oh-my-opencode` → `oh-my-openagent` 리브랜딩이 일어났고, "open" 강조 마케팅이 시작됐다.
- ["Grok Code Fast 1: 6.7% → 68.3% success rate, just from changing the edit tool"](https://github.com/code-yeongyu/oh-my-openagent#codes-better-hash-anchored-edits) — 모델은 그대로, 편집 도구만 hash-anchored로 바꿔서 성공률을 10배로 올렸다는 측정치. 이 가이드의 [하네스 엔지니어링 문서](../claude-code/08-하네스-엔지니어링.md)가 말하는 "모델이 아니라 하네스가 품질을 결정한다"의 가장 극적인 사례다.

---

## 2. 매니페스토의 다섯 가지 주장

`docs/manifesto.md`는 짧고 도발적이다. 핵심 다섯 줄로 압축하면 다음과 같다.

### 2.1 인간 개입은 실패 신호다

> "Human intervention during agentic work is fundamentally a wrong signal."

자율주행 차의 수동 개입과 같은 진단이다. 사용자가 "수정해줘"라고 한 번 말해야 하는 순간이 곧 시스템 실패다.

### 2.2 코드 품질은 "구분 불가" 기준을 만족해야 한다

시니어 엔지니어가 쓴 것과 구별되지 않아야 한다는 명시적 기준. "초안", "스타터"가 아니라 그대로 머지 가능한 상태가 목표다.

### 2.3 토큰은 비용이 아니라 투자다

10–100배의 생산성을 얻을 수 있다면 토큰은 아낄 대상이 아니다. 단, 무의미한 반복은 다른 문제로 본다.

### 2.4 인지 부하 최소화

> "Users should only need to say what they want. Everything else is the agent's job."

모드는 두 개로 단순화: Prometheus(인터뷰 기반 계획)와 Ultrawork(자율 실행).

### 2.5 컴파일러처럼 예측 가능해야 한다

같은 입력 → 같은 동작, 세션 재개 가능, 마이크로매니징 없이 위임 가능. 궁극적으로 "invisible infrastructure"가 되는 것이 목표다.

이 다섯 항목은 [보리스 체르니 인사이트](보리스-체르니-인사이트.md)의 "verifiability가 품질을 2–3배 끌어올린다"와 정확히 같은 방향이다. 단, 체르니가 Claude Code 내부 설계자 관점에서 말한 반면, 김영규는 외부 하네스 작성자 관점에서 같은 결론에 도달했다.

---

## 3. 에이전트 캐스트 — 그리스 신화의 분업

OMO의 에이전트 이름은 그리스 신화에서 따왔고, 분업이 캐릭터 설정과 일치한다.

| 에이전트 | 모델(기본값) | 역할 |
|----------|---------------|------|
| **Sisyphus** | `claude-opus-4-7` (또는 `kimi-k2.6`/`glm-5.1`) | 메인 오케스트레이터. 끝까지 미는 인내력 메타포 |
| **Hephaestus** | `gpt-5.5` | 자율 딥워커. "The Legitimate Craftsman" — AmpCode 차단 사건에 대한 반어 |
| **Prometheus** | `claude-opus-4-7` 계열 | 계획자. 인터뷰 모드로 스코프를 뽑아낸다 |
| **Atlas** | — | Prometheus 계획을 받아 subagent에 분배하는 실행 지휘자 |
| **Oracle** | — | 읽기 전용 아키텍처/디버깅 컨설턴트 |
| **Librarian** | — | 멀티 레포 및 OSS 구현 검색 |
| **Explore** | — | 빠른 코드베이스 grep |
| **Multimodal-Looker** | — | PDF/이미지/다이어그램 분석 |
| **Metis / Momus** | — | 계획 전 갭 분석 / 계획 검증 |

핵심 설계 포인트는 **모델 선택을 사용자한테서 빼앗았다**는 점이다. 사용자나 메인 에이전트가 "GPT-5.5 써줘"라고 지정하지 않는다. 대신 작업을 **카테고리**로 표현한다.

| 카테고리 | 기본 라우팅 | 용도 |
|----------|------------|------|
| `visual-engineering` | Gemini 3.1-pro | 프론트엔드/UI/UX |
| `ultrabrain` | GPT-5.5 xhigh | 어려운 로직, 아키텍처 결정 |
| `deep` | GPT-5.5 medium | 목표 지향 자율 작업 |
| `artistry` | Gemini 3.1-pro high | 창의 작업 |
| `quick` | GPT-5.4 mini | 단일 파일 수정, 오타 |
| `writing` | Gemini 3-flash | 문서/산문 |
| `unspecified-low/high` | Claude Sonnet / Opus 4.7 | 기본 폴백 |

위임할 때는 카테고리만 적고, 매핑이 모델로 자동 해석된다. 이 디커플링은 모델이 매달 바뀌는 현실에 대한 응답이다. 매니페스토의 *"No single provider will dominate"*가 이 설계로 구현됐다.

출처: [`docs/guide/overview.md`](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/guide/overview.md), [`docs/reference/features.md`](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/reference/features.md)

---

## 4. Hephaestus 깊이 보기 — "The Legitimate Craftsman"

에이전트 캐스트 중 가장 특이한 캐릭터다. Sisyphus가 "오케스트레이터", Prometheus가 "계획자"라는 명확한 분업을 갖는다면, Hephaestus는 **AmpCode의 deep mode를 OpenCode 쪽으로 이식한 자율 워커**다. AmpCode 차단 사건과 맞물려 "The Legitimate Craftsman"이라는 별명이 의도된 반어로 붙었다.

출처: 이 절은 저장소의 `src/agents/hephaestus/AGENTS.md`, `src/agents/hephaestus/agent.ts`, `src/agents/hephaestus/gpt-5-5.ts`, `src/agents/builtin-agents/hephaestus-agent.ts`를 1차 자료로 한다.

### 4.1 에이전트 구성

`createHephaestusAgent()`가 반환하는 `AgentConfig`의 핵심 값.

| 필드 | 값 | 의미 |
|------|-----|------|
| `mode` | `"primary"` | UI에서 직접 선택 가능한 메인 에이전트(서브에이전트가 아님) |
| `model` | 입력으로 받음, 기본 GPT-5.5 | OpenAI 호환 프로바이더 필수. 폴백 체인 없음 |
| `maxTokens` | 32,000 | 한 응답 최대 출력 크기 |
| `reasoningEffort` | `"medium"` | xhigh가 아니라 medium — 깊은 추론보다 끝까지 미는 인내력 우선 |
| `color` | `#D97706` (amber) | 대장간 불의 색 |
| `cost` | `EXPENSIVE` | 사용자에게 비용 등급 노출 |
| `permission.question` | `allow` | 사용자에게 질문 가능 |
| `permission.call_omo_agent` | `deny` | **다른 OMO 에이전트(Sisyphus 등)를 재귀 호출 금지** |

`call_omo_agent: deny`가 중요하다. Hephaestus는 Sisyphus의 부하가 아니라 **혼자 끝내야 하는 자율 워커**다. 다른 에이전트로 다시 위임할 수 없다. 대신 `task(subagent_type="explore"|"librarian"|"oracle")`와 카테고리 위임은 허용된다. 즉 *조사/조언은 위임하되, 책임은 자기가 진다*.

### 4.2 모델 변형 — 한 캐릭터, 네 가지 시스템 프롬프트

`getHephaestusPromptSource()`가 모델 ID로 프롬프트 빌더를 라우팅한다.

| 모델 | 프롬프트 빌더 | 최적화 포인트 |
|------|--------------|--------------|
| `gpt-5.5` 계열 | `gpt-5-5.ts` | GPT-5.5 라우팅에 맞춰 튜닝된 메인 프롬프트 |
| `gpt-5.4` (Sisyphus-native) | `gpt-5-4.ts` | XML 태그 8개 섹션, 엔트로피 감소형 |
| `gpt-5.3-codex` | `gpt-5-3-codex.ts` | 549줄, 태스크 디시플린 강화 |
| 그 외 GPT | `gpt.ts` | 507줄 베이스 프롬프트 |

같은 캐릭터인데 모델마다 별도의 프롬프트를 갖는 이유는 — XML 인식, 패치 적용 방식, 추론 깊이 표현이 모델마다 다르기 때문이다. 이 가이드의 [시스템 프롬프트 설계 문서](../claude/03-시스템-프롬프트-설계.md)에서 다룬 "모델별 프롬프트 변형"의 실전 사례로 볼 만하다.

### 4.3 시스템 프롬프트 해부 (GPT-5.5 변형)

GPT-5.5 프롬프트 원문에서 설계적으로 가장 흥미로운 블록 6개를 꼽으면 다음과 같다.

#### 4.3.1 정체성과 자율 디폴트

> "Default: implement, don't propose. Unless the user is asking a question, brainstorming, or explicitly requesting a plan, assume they want code and tools, not a description of one."

"코드를 제안하지 말고 구현하라"가 디폴트다. Claude Code의 기본값(보수적/대화적)과 정반대다.

> "Status requests are not stop signals. Give the update, then keep working."

상태 질문에 답하느라 작업을 멈추지 않는다. "어디까지 됐어?"는 진행 종료가 아니라 진행 중에 응답하는 사이드 채널이다.

#### 4.3.2 Intent Extraction Table — 표면 발화 vs 진짜 의도

프롬프트 본문에 인텐트 추출 표가 박혀 있다.

| Surface | True intent | Move |
|---------|-------------|------|
| "Did you do X?" (and you didn't) | Do X now | Acknowledge briefly, do X |
| "How does X work?" | Understand to fix or improve | Explore, then act |
| "Can you look into Y?" | Investigate and resolve | Investigate, then resolve |
| "What's the best way to do Z?" | Do Z the best way | Decide, then implement |
| "Why is A broken?" / "Seeing error B" | Fix A or B | Diagnose, then fix |
| "What do you think about C?" | Evaluate and implement | Evaluate, then act |

"순수 질문"으로 인정하려면 사용자가 명시적으로 "그냥 설명해" / "건드리지 마" / "그냥 궁금해서"라고 말해야 한다는 단서가 붙는다. 메시지의 표면이 아니라 의도를 강제로 끌어내는 장치다.

#### 4.3.3 Discovery & Retrieval — "한 번 넓게, 그 다음에 좁게"

> "Start broad once. For non-trivial work, fire 2-5 `explore` or `librarian` sub-agents in parallel with `run_in_background=true` plus direct reads of files you already know are relevant - same response."

초기 1회는 병렬 2~5개 fan-out, 그 이후엔 *답이 부족하거나*, *2차 질문이 떴거나*, *결정에 필요한 특정 문서가 있을 때*만 추가 호출. 그리고:

> "Don't duplicate delegated searches. ... Do non-overlapping prep, or end your response and wait for the completion notification. Do not poll `background_output` on running tasks."

위임한 검색을 자기가 또 하지 않는다. 폴링 금지. 다른 준비 작업으로 넘어가거나, 응답을 끝내고 백그라운드 완료 알림을 기다린다.

#### 4.3.4 Manual QA Gate — 가장 특이한 설계

> "**'Done' requires you have personally used the deliverable through its matching surface and observed it working** within this turn."

`lsp_diagnostics` clean / 빌드 통과 / 테스트 통과 — 이건 다 "증거"일 뿐 "게이트"가 아니라고 못박는다. 진짜 게이트는 *자기 손으로 산출물을 그 표면(surface)으로 한 번 굴려보는 것*이다.

| 산출물 표면 | 강제 검증 방법 |
|------------|---------------|
| TUI / CLI / shell binary | `interactive_bash`(tmux)에서 키 입력, happy path, 잘못된 입력 1회, `--help` 확인 |
| Web / 브라우저 UI | `playwright` 스킬 로드, 실제 브라우저에서 클릭/폼/콘솔/스크린샷 |
| HTTP API / 서비스 | `curl` 또는 드라이버 스크립트로 실프로세스 호출 |
| Library / SDK / 모듈 | 임포트해서 end-to-end로 돌리는 최소 드라이버 스크립트 작성 |
| 일치하는 표면이 없음 | "실제 사용자라면 어떻게 이게 동작하는 걸 발견할까?" 묻고 그대로 함 |

> "Reading the source and concluding 'this should work' does not pass this gate."

소스만 읽고 "될 거 같다"는 통과 불가. 이 가이드의 [하네스 엔지니어링 문서](../claude-code/08-하네스-엔지니어링.md)에서 다룬 "검증 가능성" 원칙을 가장 강하게 강제하는 형태다.

#### 4.3.5 Three-Attempt Failure Protocol

> "After three different approaches have failed: 1. Stop editing immediately. 2. Revert to a known-good state. 3. Document each attempt and why it failed. 4. Consult Oracle synchronously with full failure context. 5. If Oracle cannot resolve, ask the user one precise question."

세 번 시도해서 다 실패하면 — 편집 중단, 알려진 정상 상태로 롤백, 시도 기록, Oracle 동기 호출, 그래도 안 되면 사용자에게 *정확히 한 가지* 질문. 단순한 "포기 조건"이 아니라 **롤백을 강제**하는 구조다. 이건 "agent slop"의 가장 흔한 실패 모드 — 점점 더 망가뜨리며 작업을 계속하는 것 — 을 끊는다.

#### 4.3.6 Hard Invariants — 절대 금지

> "Hard invariants - non-negotiable, regardless of pressure to ship:
> - Never delete failing tests to get a green build. Never weaken a test to make it pass.
> - Never use `as any`, `@ts-ignore`, or `@ts-expect-error` to suppress type errors.
> - Never use destructive git commands (`reset --hard`, `checkout --`, force-push) without explicit approval.
> - Never amend commits unless explicitly asked.
> - Never revert changes you did not make unless explicitly asked.
> - Never invent fake citations, fake tool output, or fake verification results."

매니페스토 1번("인간 개입 = 실패 신호")이 자율성을 *최대화*하는 방향이라면, Hard Invariants는 그 자율성에 *상한선*을 친다. "출시 압박에도 절대 양보 못 함"이라는 표현이 그대로 박혀 있다.

### 4.4 운영 루프 — Explore → Plan → Implement → Verify → Manually QA

> "Loops are short and tight; do not loop back with a draft when the work is yours to do."

5단계가 명시되고, 각 단계 사이에 "초안을 들고 사용자에게 돌아가지 마라"가 박혀 있다. 즉 *plan 단계 후 사용자 확인을 받지 않고 바로 implement*가 디폴트다. Prometheus(인터뷰형 계획자)와 명확히 다른 포지션 — Prometheus는 작업 *전*에 사람과 대화하고, Hephaestus는 작업 *중*에 사람을 부르지 않는다.

### 4.5 언제 쓰고 언제 쓰지 말 것인가

저장소가 메타데이터로 명시한 가이드.

**적합**:
- 구현 전 깊은 탐색이 필요한 태스크
- 사용자가 end-to-end 자율 완료를 원할 때
- 멀티파일 변경이 필요한 복합 작업

**부적합**:
- 단일 단계의 단순 작업 (오버킬, 비용만 비쌈 — `quick` 카테고리가 적합)
- 단계마다 사용자 확인이 필요한 작업 (Hephaestus는 안 멈춤)
- 여러 에이전트 간 오케스트레이션이 필요할 때 (Atlas 또는 Sisyphus가 적합)

`cost: EXPENSIVE` 라벨이 붙은 이유는 GPT-5.5 토큰 가격이 아니라 *완료까지 안 멈추는 성향* 때문이다. 잘못된 태스크에 붙이면 비용이 폭발한다.

### 4.6 이 가이드 레포 관점에서 가져갈 점

- **Manual QA Gate를 강제 조항으로 박는다**. "테스트 통과 = 완료"가 아니라 "실제 표면으로 한 번 굴려본다 = 완료"로 정의를 끌어올린 것. 이 가이드의 [실전 워크플로우](../claude-code/06-실전-워크플로우.md)나 커스텀 스킬을 작성할 때, "검증 도구 출력 = 완료 증거" 패턴을 "산출물 사용 = 완료 증거"로 한 단계 격상시킬 수 있다.
- **Intent Extraction Table을 프롬프트에 박는 패턴**. 표면 표현과 진짜 의도의 매핑을 표로 명시하는 것은, 모델한테 "행간 읽기"를 결정론적으로 강제하는 좋은 방법이다. 한국어 도메인이라면 "한번 봐줄래?", "혹시 가능하면", "되면 좋을 텐데" 같은 한국어 특유의 완곡표현 매핑이 강력한 후보다.
- **Three-Attempt Protocol의 롤백 강제**. 단순 "포기 조건"이 아니라 *상태 복구*까지 묶어둔 점이 특히 좋다. 시도 누적 → 롤백 → 컨설팅 → 질문의 4단 sequence는 일반 스킬에도 그대로 이식 가능하다.
- **Hard Invariants 분리 명시**. "절대 금지"를 본문이 아니라 별도 섹션으로 빼서 박는 형식은 [맷 포콕의 4.3 안티패턴 박기](맷-포콕-스킬-모음.md#43-안티패턴을-따로-빼서-못박는다) 사상과 같은 방향이다. 우회 명령에 대한 저항력이 올라간다.

---

## 5. 기능 카탈로그 — 가져갈 만한 것 위주로

### 5.1 Hashline — "하네스 문제"의 구체적 처방

Can Bölük이 ["The Harness Problem"](https://blog.can.ac/2026/02/12/the-harness-problem/)에서 지적한 핵심은 다음이다.

> "None of these tools give the model a stable, verifiable identifier for the lines it wants to change... They all rely on the model reproducing content it already saw. When it can't — and it often can't — the user blames the model."

OMO는 [`oh-my-pi`](https://github.com/can1357/oh-my-pi)의 패턴을 가져와 **Hashline**으로 구현했다. 파일을 읽으면 줄마다 `LINE#ID|` 접두사가 붙는다.

```
11#VK| function hello() {
22#XJ|   return "world";
33#MB| }
```

편집할 때 이 태그를 참조하고, 파일이 그 사이 바뀌었다면 hash가 어긋나 편집이 **검증 단계에서** 거부된다. 모델이 화이트스페이스를 똑같이 재생산하길 기대하지 않는다.

이 가이드의 [하네스 엔지니어링 문서](../claude-code/08-하네스-엔지니어링.md)에서 "도구 인터페이스가 모델 성공률을 직접 결정한다"고 말한 그 주장을, OMO는 단일 도구 교체로 6.7% → 68.3% 사례를 제시한다.

### 5.2 IntentGate — 키워드 분류 전 의도 분석

`ultrawork`, `search`, `analyze`, `team` 같은 키워드를 단순 정규식이 아니라 LLM 기반 의도 분석으로 분류한다. "literal misinterpretation"을 피하는 게 목표.

이 가이드의 [실전 워크플로우](../claude-code/06-실전-워크플로우.md)에서 "프롬프트 분기 패턴"으로 다룬 것을 한 단계 일반화한 구조라고 볼 수 있다.

### 5.3 Ralph Loop / Ultrawork Loop — 자기참조 루프

Ralph Loop은 출력에 `<promise>DONE</promise>` 토큰이 등장할 때까지 같은 프롬프트를 재투입하는 단순한 self-referential 루프다. `/ulw-loop`은 그 위에 병렬 에이전트와 공격적 탐색을 얹은 풀버전이다.

핵심은 모델이 "끝났다"고 자기 선언할 때까지 루프가 끊기지 않는다는 점이다. **Todo Enforcer**가 보조 역할로, 에이전트가 idle 상태로 빠지면 강제로 컨텍스트를 되돌려준다.

Karpathy가 ["agentic engineering"](안드레이-카파시-개념.md#vibe-coding)에서 말한 "vibe coding의 후속 단계 — 더 자율적이고 더 오래 도는 루프"의 한 구현 사례다.

### 5.4 Team Mode (v4.0) — 진짜 멀티에이전트

기본 OFF. 활성화하면 `team_create`/`team_send_message`/`team_task_create` 등 12개의 `team_*` 도구가 잠금 해제된다. 리드 에이전트가 최대 8명(병렬 4명)의 카테고리 특화 멤버에게 메일박스 기반 비동기 통신으로 작업을 분배한다. tmux로 모든 멤버의 상황을 실시간으로 본다.

```jsonc
// .opencode/oh-my-openagent.jsonc
{
  "team_mode": {
    "enabled": true,
    "max_parallel_members": 4,
    "tmux_visualization": true
  }
}
```

이 위에 두 가지 스킬이 미리 깔려 있다.

- `hyperplan` — 5명의 적대적(hostile) 비평가가 계획을 직교 각도에서 분해
- `security-research` — 취약점 헌터 3명 + PoC 엔지니어 2명이 코드베이스를 병렬 감사

제약: 멤버당 500턴, 메시지 본문 32KB, 런타임 최대 120분, 메시지 10,000개.

### 5.5 `/init-deep` — 계층적 AGENTS.md

저장소 전체를 훑어 디렉토리마다 `AGENTS.md`를 생성한다.

```
project/
├── AGENTS.md              ← 프로젝트 전역
├── src/
│   ├── AGENTS.md          ← src 한정
│   └── components/
│       └── AGENTS.md      ← 컴포넌트 한정
```

에이전트는 작업 디렉토리에서 루트까지 거슬러 올라가며 자동 주입한다. 이 가이드의 [AGENTS.md 작성 가이드](../codex/02-AGENTS-md-작성-가이드.md)가 다룬 계층 구조를 자동화한 셈이다.

### 5.6 Skill-Embedded MCP

스킬이 자기 MCP 서버를 SKILL.md의 frontmatter에 선언한다. 스킬이 활성화될 때만 MCP가 뜨고, 끝나면 사라진다. 컨텍스트 윈도우에 MCP 도구가 상주하지 않는다는 게 핵심.

이 가이드의 [커스텀 스킬 문서](../claude-code/03-커스텀-스킬.md)에서 다룬 스킬 구조를 [MCP 서버 연동](../claude-code/05-MCP-서버-연동.md)과 결합한 형태로, **scope를 task 단위로 좁힌** 변형이다.

### 5.7 Comment Checker — "AI slop" 차단

에이전트가 생성한 장황한 주석(`// Now we initialize the variable that holds the user...` 같은)을 PreToolUse 단계에서 차단한다. 우회는 `// @allow` 또는 파일 상단 비활성화 주석으로만 가능.

[맷 포콕 시리즈](맷-포콕-스킬-모음.md#46-자동-해제-조건을-명시한다)의 `caveman`("토큰 절감 모드")과 같은 사상이다 — 모델이 자기 매니페스토를 어기지 못하게 하네스 단에서 가드를 박는다.

### 5.8 모델 폴백 체인

API 오류(429/503/529) 시 자동으로 다음 모델로 전환한다. `fallback_models`는 단순 문자열 배열과 per-model 객체 설정을 한 배열에 섞어쓸 수 있고, per-model cooldown 설정도 가능하다. Sisyphus가 Opus/Kimi/GLM 사이에서 무중단으로 움직이는 이유다.

### 5.9 OAuth MCP

RFC 9728/8414/7591 준수. 동적 클라이언트 등록, PKCE, 자동 토큰 갱신까지 구현했다. MCP 서버 인증을 직접 다뤄본 적이 있다면 이게 얼마나 손이 많이 가는지 알 것이다.

---

## 6. 가져갈 만한 설계 원칙

스킬을 그대로 쓸지와 별개로, OMO의 설계에서 뽑아낼 수 있는 패턴들.

### 6.1 모델을 카테고리로 추상화하라

`task(category: "ultrabrain", prompt: ...)` 같은 형태로 위임 시점에 모델을 직접 지정하지 않는다. 매월 모델이 바뀌는 현실에서, 호출부와 매핑부를 분리해두면 라우팅 정책만 바꿔서 전체를 옮길 수 있다. 본 가이드의 [모델 선택 가이드](../claude/04-모델-선택-가이드.md)가 사용자 의사결정용이라면, OMO는 같은 의사결정을 시스템 레이어로 끌어올렸다.

### 6.2 도구 신뢰성 = 모델 능력의 곱셈 상수

Hashline의 6.7% → 68.3% 사례가 단적이다. 같은 모델, 같은 프롬프트, 도구만 교체. 새 스킬이나 새 프롬프트를 짜기 전에, 기존 도구 인터페이스가 모델한테 "안전하게 실패하는" 형태인지 점검하는 게 ROI가 훨씬 크다.

### 6.3 자기참조 루프와 강제 복귀를 한 쌍으로 둔다

Ralph Loop("끝났다고 자기선언할 때까지 돌린다") 단독은 무한 루프 위험이 있다. OMO는 Todo Enforcer("idle 상태 감지 시 컨텍스트 복귀")와 짝으로 둔다. 매니페스토 5번 항목("compiler처럼 예측 가능")이 이렇게 구현됐다.

### 6.4 카테고리화된 적대적 검토 팀을 미리 만들어둔다

`hyperplan`의 "5명의 hostile critic" 패턴이 흥미롭다. 일반화하면 — *계획 단계에 직교 관점의 비평가 N명을 자동 호출하는 스킬*은 어느 도메인에서나 적용 가능하다. 한국어 도메인이라면 보안/PM/QA/성능/접근성 5각도 비평가 정도.

### 6.5 AI slop은 하네스에서 차단한다, 프롬프트로 부탁하지 않는다

`Comment Checker`가 모범 사례다. "주석을 간결히 써줘"는 매번 잊힌다. PreToolUse 단계에서 정규식/AST 기반으로 차단하면 한 번만 박으면 된다. [훅 시스템 문서](../claude-code/04-훅-시스템.md)의 PreToolUse 패턴과 같은 사상.

---

## 7. 비판적으로 볼 부분

OMO 마케팅 톤은 강하다. 객관적으로 짚을 만한 지점들.

- **벤더 중립을 표방하지만 OpenCode에 강하게 묶여 있다.** OpenCode 플러그인 API와 hook 시스템을 그대로 쓴다. OpenCode가 죽으면 OMO도 죽는다. "Not locked to Claude. Not locked to OpenAI."는 사실이지만, OpenCode에는 잠겨 있다.
- **"Anthropic blocked OpenCode" 서사는 1차 출처가 트윗이다.** Anthropic 공식 발표가 아니라 OpenCode 메인테이너의 X 게시물이 근거다. 마케팅 카피로는 강하지만, 인과관계를 단정할 만큼 검증된 사실은 아니다.
- **벤치마크 숫자 출처가 단일하다.** 6.7% → 68.3%는 oh-my-pi의 원 측정치를 인용하는 형태이고, OMO가 자체 측정한 숫자는 공개되지 않았다. 도구 교체가 큰 효과라는 방향성은 합리적이지만, 절대 수치는 다른 모델/태스크에서 그대로 재현되지 않을 수 있다.
- **Team Mode는 OFF가 기본이고 제약이 많다.** 120분 / 8명 / 500턴 / 32KB. 진짜 멀티에이전트라기보단 "오케스트레이션이 잘 도구화된 subagent" 수준에 가깝다. 멀티에이전트가 단일 에이전트보다 항상 낫다는 증거는 아직 없다는 점도 기억할 만하다.
- **`ultrawork` 같은 "한 마디로 끝" 표현은 잘 작동하는 케이스가 한정적이다.** README 인용 사례들(8000개 eslint 경고, 45k줄 tauri → SaaS)은 모두 *구조가 단순하고 검증 가능한* 작업이다. 도메인 모델 설계나 비기능 요구사항이 얽힌 작업에서도 같은 결과가 나온다는 보장은 없다.

이 비판이 OMO의 가치를 깎지는 않는다. 다만 매니페스토의 도발적 톤을 그대로 받아들이지 말고 *어떤 패턴이 유효하고 어떤 부분이 마케팅인지* 분리해서 가져가는 게 좋다.

---

## 8. 이 가이드 레포에 적용한다면

이 저장소는 Claude/Claude Code/Claude Cowork/Codex CLI 네 도구를 다루지만, OMO에서 도구 독립적으로 가져올 만한 게 있다.

**바로 가져올 만한 것**:

- **Hashline 패턴** — 한국어 도메인 한정 스킬을 만들 때, `Read`/`Edit` 도구 인터페이스를 그대로 쓰지 말고 hash 검증 레이어를 한 겹 두르는 게 ROI가 크다. 이 가이드의 [하네스 엔지니어링](../claude-code/08-하네스-엔지니어링.md) 사례 모음에 추가 가능.
- **카테고리 → 모델 매핑 분리** — `skills/refactor-advisor`, `skills/spec-writer` 같은 기존 스킬들이 모델을 직접 지정하고 있다면, 카테고리 라벨로 추상화하면 향후 모델 교체 비용이 사라진다.
- **`/init-deep` 패턴의 한국어판** — [AGENTS.md 작성 가이드](../codex/02-AGENTS-md-작성-가이드.md)의 계층 구조를 자동 생성하는 스킬은 모노레포에 특히 유효하다.
- **Comment Checker 같은 PreToolUse 가드** — "AI 냄새 주석 차단"은 `humanizer` 스킬의 사후 교정보다 PreToolUse 단계 차단이 더 효율적이다.

**그대로 가져오면 안 되는 것**:

- **Sisyphus/Hephaestus 같은 캐릭터 네이밍** — OMO 내부에서는 일관된 메타포지만, 다른 레포에 옮기면 단순히 멋스러운 네이밍에 그칠 위험이 크다. 본 가이드의 기존 스킬 네이밍 컨벤션(`refactor-advisor`, `spec-writer` 같은 기능 서술형)을 유지하는 게 발견 가능성이 높다.
- **Team Mode 자체** — 제약(120분/8명)이 강하고, Claude Code/Codex CLI 양쪽 모두 자체 subagent 시스템이 이미 있다. OMO 전용 인프라에 의존하지 말고, [실전 워크플로우 문서](../claude-code/06-실전-워크플로우.md)의 멀티에이전트 패턴을 활용하는 게 낫다.

---

## 9. 함께 보면 좋은 1차 출처

- [oh-my-openagent 저장소](https://github.com/code-yeongyu/oh-my-openagent) — README가 매니페스토 역할까지 겸한다
- [Ultrawork Manifesto](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/manifesto.md) — 짧고 도발적인 5개 원칙
- [Overview](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/guide/overview.md) / [Team Mode](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/guide/team-mode.md) / [Features](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/reference/features.md)
- [Can Bölük — The Harness Problem (2026-02-12)](https://blog.can.ac/2026/02/12/the-harness-problem/) — Hashline의 사상적 출처. 이 가이드의 [하네스 엔지니어링 문서](../claude-code/08-하네스-엔지니어링.md)와 같이 읽으면 좋다
- [`can1357/oh-my-pi`](https://github.com/can1357/oh-my-pi) — Hashline의 구현 원본
- [`@code-yeongyu`](https://github.com/code-yeongyu) / [`@justsisyphus`](https://x.com/justsisyphus) — 저자와 프로젝트 업데이트 채널
- [SST(@thdxr) — Anthropic OpenCode 차단 게시물](https://x.com/thdxr/status/2010149530486911014) — 리브랜딩 배경 (1차 출처는 트윗이라는 점 유의)
