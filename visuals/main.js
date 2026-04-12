// ============================================================
// wise-claude-docs / visuals — Claude Code 가이드 HTML 허브
// ============================================================

// ------------------------------------------------------------
// 1. 상단 진행률 바
// ------------------------------------------------------------
(function initProgressBar() {
  const progress = document.getElementById('progress');
  if (!progress) return;

  function update() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ------------------------------------------------------------
// 2. 사이드바 스크롤 스파이 — 챕터 + h2 모두
// ------------------------------------------------------------
(function initScrollSpy() {
  const links = document.querySelectorAll('.toc a[href^="#"]');
  const targets = Array.from(links)
    .map(a => {
      const id = a.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!targets.length) return;

  let currentActive = null;

  const observer = new IntersectionObserver(entries => {
    // 가장 위에 걸려 있는 섹션 하나만 활성화
    const visible = entries
      .filter(e => e.isIntersecting)
      .map(e => ({ el: e.target, top: e.boundingClientRect.top }))
      .sort((a, b) => a.top - b.top);

    if (visible.length === 0) return;

    const topId = visible[0].el.id;
    if (topId === currentActive) return;
    currentActive = topId;

    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + topId);
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  targets.forEach(t => observer.observe(t));
})();

// ------------------------------------------------------------
// 3. 코드 블록 복사 버튼
// ------------------------------------------------------------
(function initCopyButtons() {
  document.querySelectorAll('.code-wrap').forEach(wrap => {
    const btn = wrap.querySelector('.copy-btn');
    const code = wrap.querySelector('pre code') || wrap.querySelector('pre');
    if (!btn || !code) return;

    btn.addEventListener('click', async () => {
      const text = code.innerText;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '복사됨';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '복사';
          btn.classList.remove('copied');
        }, 1500);
      } catch (err) {
        btn.textContent = '실패';
        setTimeout(() => { btn.textContent = '복사'; }, 1500);
      }
    });
  });
})();

// ------------------------------------------------------------
// 4. Hook 이벤트 데이터
// ------------------------------------------------------------
const HOOK_EVENTS = [
  {
    name: 'SessionStart',
    phase: '세션 시작 시',
    blockable: false,
    description: '세션이 시작되거나 재개될 때 한 번 발생한다. 차단 효과는 없고, 세션 초기 상태를 준비하는 용도로 쓴다.',
    example: '현재 브랜치·Git 상태·환경 변수 등을 stdout으로 내보내 Claude의 초기 컨텍스트에 주입한다.'
  },
  {
    name: 'UserPromptSubmit',
    phase: '사용자 메시지 제출 시',
    blockable: true,
    description: '사용자가 입력한 메시지가 Claude에 전달되기 직전에 발생한다. 차단 가능한 이벤트 중 하나로, 민감 정보가 들어간 메시지를 걸러내는 용도로 쓴다.',
    example: 'API 키 패턴(예: sk-로 시작하는 문자열)이 메시지에 포함되어 있으면 exit 2로 제출 자체를 차단하고 경고를 stdout으로 출력한다.'
  },
  {
    name: 'PreToolUse',
    phase: '도구 실행 직전',
    blockable: true,
    description: '도구 호출이 실행되기 직전에 발생한다. 가장 중요한 차단 훅으로, 보호된 파일 수정·위험 명령 실행 등을 사전에 막는다.',
    example: '.env나 secrets.yaml 파일에 대한 Edit/Write를 exit 2로 차단하고 "보호된 파일입니다" 메시지를 출력한다.'
  },
  {
    name: 'PostToolUse',
    phase: '도구 실행 성공 후',
    blockable: false,
    description: '도구 호출이 성공적으로 끝난 직후 발생한다. 차단 효과는 없고, 후처리·포맷팅·로깅 용도로 쓴다. 실전에서 가장 자주 쓰이는 훅이다.',
    example: 'Edit/Write 이후 prettier --write를 자동 실행해 저장된 파일을 포맷팅한다. 지원 안 되는 확장자는 "|| true"로 무시한다.'
  },
  {
    name: 'PostToolUseFailure',
    phase: '도구 실행 실패 후',
    blockable: false,
    description: '도구 호출이 실패(비제로 종료)로 끝난 뒤 발생한다. 실패 원인 분석이나 대체 동작 제안을 자동화하는 데 쓴다.',
    example: 'Bash가 실패로 끝나면 최근 로그 파일 경로나 자주 쓰는 복구 명령을 stdout으로 출력해 Claude가 참고하게 한다.'
  },
  {
    name: 'PermissionRequest',
    phase: '권한 확인 프롬프트 시',
    blockable: true,
    description: '도구 실행 전 사용자에게 권한 확인을 요청해야 할 때 발생한다. 종료 코드로 자동 승인·거부·기본 동작을 지정할 수 있다.',
    example: '"git status", "git log" 같은 안전 명령으로 시작하는 Bash 호출은 exit 0으로 자동 승인, 나머지는 exit 1로 기본 확인 동작으로 넘긴다.'
  },
  {
    name: 'Stop',
    phase: 'Claude 응답 완료 시',
    blockable: false,
    description: 'Claude가 응답 생성을 마친 시점에 발생한다. 긴 작업을 맡겨두고 자리를 비웠을 때 알림을 보내는 용도로 주로 쓴다.',
    example: 'macOS에서 osascript로 "작업 완료" 데스크톱 알림을 띄우거나, 팀 슬랙 채널에 완료 메시지를 웹훅으로 전송한다.'
  },
  {
    name: 'SessionEnd',
    phase: '세션 종료 시',
    blockable: false,
    description: '세션이 종료될 때 발생한다. 대화 로그 아카이브, 사용량 집계, 최종 git 상태 저장 같은 정리 작업에 쓴다.',
    example: '세션 로그 파일을 ~/claude-archive/YYYY-MM-DD/ 디렉터리로 이동시키고, 최종 git status를 함께 저장한다.'
  }
];

// ------------------------------------------------------------
// 5. Hook 타입 데이터
// ------------------------------------------------------------
const HOOK_TYPES = [
  {
    name: 'command',
    summary: '셸 명령을 직접 실행한다. 가장 일반적이고 빠르며 디버깅이 쉽다.',
    use: '포맷터, 린터, 알림, 파일 검사 같은 단순 규칙 기반 작업',
    example: {
      type: 'command',
      command: 'prettier --write $TOOL_INPUT_FILE_PATH'
    }
  },
  {
    name: 'prompt',
    summary: 'Claude Haiku 모델에게 평가를 맡긴다. 자연어로 정책을 정의할 수 있다.',
    use: '고정 규칙으로 표현하기 어려운 맥락 기반 판단',
    example: {
      type: 'prompt',
      prompt: '이 파일 편집이 보안에 영향을 줄 수 있는지 확인해라. 영향이 있다면 차단하라.'
    }
  },
  {
    name: 'agent',
    summary: '서브에이전트를 별도로 실행한다. 여러 도구를 조합해야 하는 작업에 적합하다.',
    use: '여러 파일을 교차 참조해야 하는 취약점 검토 같은 작업',
    example: {
      type: 'agent',
      agent: 'security-reviewer',
      prompt: '변경된 파일에서 SQL 인젝션 취약점을 검토하라.'
    }
  },
  {
    name: 'http',
    summary: 'HTTP 엔드포인트를 호출한다. 외부 시스템 연동과 웹훅 전송에 쓴다.',
    use: '슬랙 웹훅, 사내 모니터링 시스템으로 이벤트 전송',
    example: {
      type: 'http',
      url: 'https://hooks.example.com/claude-event',
      method: 'POST',
      headers: { Authorization: 'Bearer $WEBHOOK_TOKEN' }
    }
  }
];

// ------------------------------------------------------------
// 6. Hook 라이프사이클 타임라인 하이드레이션
// ------------------------------------------------------------
function hydrateHookTimeline(host) {
  // 컨트롤 + 타임라인 + 상세 패널 생성
  const controls = document.createElement('div');
  controls.className = 'timeline-controls';
  controls.setAttribute('role', 'tablist');
  controls.setAttribute('aria-label', '타임라인 필터');

  const chipAll = makeChip('all', '전체 보기', true);
  const chipBlock = makeChip('blocking', '차단 가능한 이벤트만', false);
  controls.append(chipAll, chipBlock);

  const wrap = document.createElement('div');
  wrap.className = 'timeline-wrap';

  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  timeline.setAttribute('role', 'list');
  timeline.setAttribute('aria-label', 'Hook 이벤트 타임라인');
  wrap.appendChild(timeline);

  const panel = document.createElement('div');
  panel.className = 'detail-panel';
  panel.setAttribute('aria-live', 'polite');

  host.appendChild(controls);
  host.appendChild(wrap);
  host.appendChild(panel);

  // 노드 렌더
  HOOK_EVENTS.forEach((ev, idx) => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'event-node';
    node.dataset.idx = String(idx);
    node.dataset.blockable = ev.blockable ? 'true' : 'false';
    node.setAttribute('role', 'listitem');
    node.setAttribute('aria-label', `${ev.name} — ${ev.phase}`);

    const nameEl = document.createElement('span');
    nameEl.className = 'event-name';
    nameEl.textContent = ev.name;

    const phaseEl = document.createElement('span');
    phaseEl.className = 'event-phase';
    phaseEl.textContent = ev.phase;

    node.appendChild(nameEl);
    node.appendChild(phaseEl);

    if (ev.blockable) {
      const badge = document.createElement('span');
      badge.className = 'event-blockable';
      badge.textContent = '차단 가능';
      node.appendChild(badge);
    }

    node.addEventListener('click', () => selectEvent(idx));
    timeline.appendChild(node);
  });

  function selectEvent(idx) {
    const ev = HOOK_EVENTS[idx];
    if (!ev) return;

    timeline.querySelectorAll('.event-node').forEach((n, i) => {
      n.classList.toggle('is-selected', i === idx);
    });

    panel.hidden = false;
    panel.classList.remove('is-updated');
    void panel.offsetWidth;
    panel.classList.add('is-updated');

    panel.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = ev.name;

    const meta = document.createElement('p');
    meta.className = 'detail-meta';
    meta.textContent = `${ev.phase} · ${ev.blockable ? '차단 가능 (exit 2로 차단)' : '차단 불가 (알림·후처리용)'}`;

    const body = document.createElement('div');
    body.className = 'detail-body';

    const desc = document.createElement('p');
    desc.textContent = ev.description;

    const usage = document.createElement('p');
    const label = document.createElement('strong');
    label.textContent = '활용 예시 — ';
    usage.appendChild(label);
    usage.appendChild(document.createTextNode(ev.example));

    body.appendChild(desc);
    body.appendChild(usage);

    panel.appendChild(title);
    panel.appendChild(meta);
    panel.appendChild(body);
  }

  // 필터 칩
  [chipAll, chipBlock].forEach(chip => {
    chip.addEventListener('click', () => {
      [chipAll, chipBlock].forEach(c => c.classList.remove('chip-active'));
      chip.classList.add('chip-active');

      const filter = chip.dataset.filter;
      timeline.querySelectorAll('.event-node').forEach(n => {
        const isBlockable = n.dataset.blockable === 'true';
        const shouldDim = filter === 'blocking' && !isBlockable;
        n.classList.toggle('is-dimmed', shouldDim);
      });
    });
  });

  // 초기 선택
  selectEvent(0);

  function makeChip(filter, label, active) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (active ? ' chip-active' : '');
    btn.dataset.filter = filter;
    btn.textContent = label;
    return btn;
  }
}

// ------------------------------------------------------------
// 7. Hook 타입 카드 하이드레이션
// ------------------------------------------------------------
function hydrateHookTypeCards(host) {
  const container = document.createElement('div');
  container.className = 'type-cards';
  host.appendChild(container);

  HOOK_TYPES.forEach(t => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'type-card';
    card.setAttribute('aria-expanded', 'false');

    const name = document.createElement('span');
    name.className = 'type-name';
    name.textContent = t.name;

    const summary = document.createElement('p');
    summary.className = 'type-summary';
    summary.textContent = t.summary;

    const use = document.createElement('p');
    use.className = 'type-use';
    const useLabel = document.createElement('strong');
    useLabel.textContent = '적합한 경우 — ';
    use.appendChild(useLabel);
    use.appendChild(document.createTextNode(t.use));

    const pre = document.createElement('pre');
    pre.className = 'type-example';
    const code = document.createElement('code');
    code.textContent = JSON.stringify(t.example, null, 2);
    pre.appendChild(code);

    const hint = document.createElement('span');
    hint.className = 'type-hint';

    card.appendChild(name);
    card.appendChild(summary);
    card.appendChild(use);
    card.appendChild(pre);
    card.appendChild(hint);

    card.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    container.appendChild(card);
  });
}

// ------------------------------------------------------------
// 8. 인터랙티브 블록 하이드레이션 디스패처
// ------------------------------------------------------------
(function initInteractiveBlocks() {
  const blocks = document.querySelectorAll('[data-interactive]');

  blocks.forEach(block => {
    const kind = block.dataset.interactive;
    switch (kind) {
      case 'hook-timeline':
        hydrateHookTimeline(block);
        break;
      case 'hook-type-cards':
        hydrateHookTypeCards(block);
        break;
      default:
        console.warn(`Unknown interactive block: ${kind}`);
    }
  });
})();
