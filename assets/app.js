// wise-claude-docs — runtime markdown renderer
// 마크다운 파일을 fetch하여 marked + highlight.js로 렌더링한다.

const MANIFEST = {
  parts: [
    {
      id: "claude",
      title: "Part 1 · Claude 활용",
      desc: "프롬프팅, 모델 선택, 도구 사용 등 Claude 모델 활용의 기초와 심화",
      docs: [
        { slug: "claude/01-프롬프트-기초", title: "프롬프트 기초" },
        { slug: "claude/02-고급-프롬프팅-기법", title: "고급 프롬프팅 기법" },
        { slug: "claude/03-시스템-프롬프트-설계", title: "시스템 프롬프트 설계" },
        { slug: "claude/04-모델-선택-가이드", title: "모델 선택 가이드" },
        { slug: "claude/05-확장-사고", title: "확장 사고" },
        { slug: "claude/06-도구-사용", title: "도구 사용" },
        { slug: "claude/07-이미지-입력", title: "이미지 입력" },
        { slug: "claude/08-프롬프트-캐싱", title: "프롬프트 캐싱" },
      ],
    },
    {
      id: "claude-code",
      title: "Part 2 · Claude Code 활용",
      desc: "CLI 도구로서 Claude Code의 설정, 스킬, 훅, MCP, 워크플로우",
      docs: [
        { slug: "claude-code/01-시작하기", title: "시작하기" },
        { slug: "claude-code/02-CLAUDE-md-작성-가이드", title: "CLAUDE.md 작성 가이드" },
        { slug: "claude-code/03-커스텀-스킬", title: "커스텀 스킬" },
        { slug: "claude-code/04-훅-시스템", title: "훅 시스템" },
        { slug: "claude-code/05-MCP-서버-연동", title: "MCP 서버 연동" },
        { slug: "claude-code/06-실전-워크플로우", title: "실전 워크플로우" },
        { slug: "claude-code/07-단축키와-명령어", title: "단축키와 명령어" },
        { slug: "claude-code/08-하네스-엔지니어링", title: "하네스 엔지니어링" },
      ],
    },
    {
      id: "claude-cowork",
      title: "Part 3 · Claude Cowork 활용",
      desc: "비개발자를 위한 데스크톱 에이전트 Cowork 사용법",
      docs: [
        { slug: "claude-cowork/01-시작하기", title: "시작하기" },
        { slug: "claude-cowork/02-파일-다루기", title: "파일 다루기" },
        { slug: "claude-cowork/03-효과적인-지시-작성법", title: "효과적인 지시 작성법" },
        { slug: "claude-cowork/04-외부-도구-연동", title: "외부 도구 연동" },
        { slug: "claude-cowork/05-반복-작업-자동화", title: "반복 작업 자동화" },
        { slug: "claude-cowork/06-실전-활용-사례", title: "실전 활용 사례" },
        { slug: "claude-cowork/07-안전하게-사용하기", title: "안전하게 사용하기" },
        { slug: "claude-cowork/08-팀-도입-가이드", title: "팀 도입 가이드" },
      ],
    },
    {
      id: "appendix",
      title: "부록",
      desc: "트러블슈팅, 인물 인사이트",
      docs: [
        { slug: "appendix/문제-해결", title: "트러블슈팅" },
        { slug: "appendix/보리스-체르니-인사이트", title: "보리스 체르니의 Claude Code 설계 사상" },
        { slug: "appendix/안드레이-카파시-개념", title: "안드레이 카파시의 LLM 개념 사전" },
        { slug: "appendix/맷-포콕-스킬-모음", title: "맷 포콕의 Skills For Real Engineers 정리" },
      ],
    },
    {
      id: "meta",
      title: "메타",
      desc: "레포 자체에 대한 문서",
      docs: [
        { slug: "README", title: "README" },
        { slug: "CHANGELOG", title: "CHANGELOG" },
      ],
    },
  ],
};

// Flat list with prev/next refs
const FLAT_DOCS = [];
MANIFEST.parts.forEach((part) => {
  part.docs.forEach((doc) => {
    FLAT_DOCS.push({ ...doc, partId: part.id, partTitle: part.title });
  });
});
FLAT_DOCS.forEach((doc, i) => {
  doc.prev = i > 0 ? FLAT_DOCS[i - 1] : null;
  doc.next = i < FLAT_DOCS.length - 1 ? FLAT_DOCS[i + 1] : null;
});

const el = (q) => document.querySelector(q);
const contentEl = el("#content");
const docTocEl = el("#docToc");
const pageTocEl = el("#pageToc");
const rightRailInnerEl = el("#rightRailInner");
const progressEl = el("#progress");
const searchEl = el("#search");
const sidebarEl = el("#sidebar");
const menuToggle = el("#menuToggle");

// Marked configuration
marked.setOptions({
  breaks: false,
  gfm: true,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (_) {}
    }
    try {
      return hljs.highlightAuto(code).value;
    } catch (_) {
      return code;
    }
  },
});

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function renderSidebar() {
  const html = MANIFEST.parts
    .map((part) => {
      const items = part.docs
        .map(
          (doc) =>
            `<li><a class="toc-link" data-slug="${doc.slug}" data-search="${doc.title.toLowerCase()}" href="#/${doc.slug}">${doc.title}</a></li>`
        )
        .join("");
      return `
        <div class="toc-part" data-part="${part.id}">
          <p class="toc-part-title">${part.title}</p>
          <ul class="toc-list">${items}</ul>
        </div>
      `;
    })
    .join("");
  docTocEl.innerHTML = html;
}

function setActiveSidebar(slug) {
  document.querySelectorAll(".toc-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.slug === slug);
  });
}

function renderLanding() {
  setActiveSidebar(null);
  pageTocEl.innerHTML = "";
  rightRailInnerEl.hidden = true;
  document.title = "wise-claude-docs · Claude 한국어 가이드";

  const cards = MANIFEST.parts
    .map((part) => {
      const items = part.docs
        .map(
          (doc, i) => `
        <a class="landing-card" href="#/${doc.slug}">
          <div class="landing-card-num">${part.id === "meta" ? "ㆍ" : String(i + 1).padStart(2, "0")}</div>
          <div class="landing-card-title">${doc.title}</div>
        </a>
      `
        )
        .join("");
      return `
        <section class="landing-part">
          <h2>${part.title}</h2>
          <p class="landing-part-desc">${part.desc}</p>
          <div class="landing-cards">${items}</div>
        </section>
      `;
    })
    .join("");

  contentEl.innerHTML = `
    <header class="landing-hero">
      <p class="landing-eyebrow">Anthropic 공식 문서 기반 한국어 가이드</p>
      <h1>Claude · Claude Code · Claude Cowork 활용 가이드</h1>
      <p>프롬프팅 기초부터 하네스 엔지니어링, 비개발자용 Cowork 도입까지 — 27개 문서를 한 페이지에서 탐색합니다.</p>
      <p style="font-size:14px;color:var(--text-dim);">사이드바에서 문서를 선택하거나, 검색창으로 빠르게 찾을 수 있습니다.</p>
    </header>
    <div class="landing-grid">${cards}</div>
  `;
  window.scrollTo({ top: 0 });
}

function buildPageToc(rootEl, slug) {
  const headings = rootEl.querySelectorAll("h2, h3, h4");
  if (!headings.length) {
    pageTocEl.innerHTML = "";
    rightRailInnerEl.hidden = true;
    return;
  }
  const items = [];
  headings.forEach((h) => {
    const lvl = parseInt(h.tagName.slice(1), 10);
    const id = h.id;
    if (!id) return;
    const text = h.textContent.replace(/[#§]\s*$/, "").trim();
    const href = `#/${slug}#${id}`;
    items.push(`<li><a class="lvl-${lvl}" data-target="${id}" href="${href}">${text}</a></li>`);
  });
  pageTocEl.innerHTML = `<ol>${items.join("")}</ol>`;
  rightRailInnerEl.hidden = false;
}

function decoratePageToc() {
  const links = pageTocEl.querySelectorAll("a");
  if (!links.length) return;
  const targets = Array.from(links)
    .map((a) => {
      const id = a.dataset.target;
      const t = document.getElementById(id);
      return t ? { link: a, el: t } : null;
    })
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((a) => a.classList.toggle("active", a.dataset.target === id));
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
  );
  targets.forEach(({ el }) => observer.observe(el));
}

async function renderDoc(slug) {
  setActiveSidebar(slug);
  const doc = FLAT_DOCS.find((d) => d.slug === slug);
  if (!doc) {
    contentEl.innerHTML = `<div class="error"><h2>문서를 찾을 수 없습니다</h2><p>슬러그: <code>${slug}</code></p><p><a href="#/">홈으로 돌아가기</a></p></div>`;
    return;
  }

  contentEl.innerHTML = `<div class="loading">불러오는 중…</div>`;

  let mdText;
  try {
    const res = await fetch(`./${doc.slug}.md`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    mdText = await res.text();
  } catch (e) {
    contentEl.innerHTML = `
      <div class="error">
        <h2>문서를 불러올 수 없습니다</h2>
        <p>${doc.title} 파일을 가져오지 못했습니다 (${e.message}).</p>
        <p>로컬에서 열고 있다면 <code>file://</code> 프로토콜은 fetch가 제한될 수 있습니다. 간단한 로컬 서버를 띄워 보세요:</p>
        <pre><code>python3 -m http.server 8000</code></pre>
        <p><a href="#/">홈으로</a></p>
      </div>
    `;
    return;
  }

  // Render
  let html = marked.parse(mdText);

  // Inject heading IDs and anchor links
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const used = new Set();
  tmp.querySelectorAll("h1, h2, h3, h4").forEach((h) => {
    let base = slugifyHeading(h.textContent);
    if (!base) base = "section";
    let id = base;
    let i = 1;
    while (used.has(id)) id = `${base}-${i++}`;
    used.add(id);
    h.id = id;
    const a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = `#/${doc.slug}#${id}`;
    a.dataset.target = id;
    a.textContent = "§";
    h.appendChild(a);
  });

  // Convert relative .md links to hash routes; rewrite ./ and ../ paths
  tmp.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || /^https?:/.test(href) || /^mailto:/.test(href)) return;
    if (href.endsWith(".md")) {
      // resolve relative to current doc folder
      const baseDir = doc.slug.split("/").slice(0, -1).join("/");
      let resolved = href.replace(/\.md$/, "");
      if (resolved.startsWith("./")) resolved = resolved.slice(2);
      if (resolved.startsWith("../")) {
        const upCount = (resolved.match(/^(\.\.\/)+/)[0].length / 3) | 0;
        const parts = baseDir.split("/").slice(0, -upCount);
        resolved = parts.concat(resolved.replace(/^(\.\.\/)+/, "")).join("/");
      } else if (!resolved.startsWith("/")) {
        resolved = baseDir ? `${baseDir}/${resolved}` : resolved;
      }
      a.setAttribute("href", `#/${resolved.replace(/^\//, "")}`);
    }
  });

  // Apply highlight to code blocks (in case marked.highlight didn't run)
  tmp.querySelectorAll("pre code").forEach((c) => {
    if (!c.classList.contains("hljs")) {
      try { hljs.highlightElement(c); } catch (_) {}
    }
  });

  const partTitle = doc.partTitle;
  const breadcrumb = `<p class="doc-breadcrumb"><a href="#/">홈</a> · ${partTitle}</p>`;
  const navHtml = `
    <nav class="doc-nav">
      ${
        doc.prev
          ? `<a href="#/${doc.prev.slug}" class="prev"><span class="label">← 이전</span><span class="title">${doc.prev.title}</span></a>`
          : `<span style="flex:1"></span>`
      }
      ${
        doc.next
          ? `<a href="#/${doc.next.slug}" class="next"><span class="label">다음 →</span><span class="title">${doc.next.title}</span></a>`
          : `<span style="flex:1"></span>`
      }
    </nav>
  `;

  contentEl.innerHTML = `${breadcrumb}<article class="md">${tmp.innerHTML}</article>${navHtml}`;
  document.title = `${doc.title} · wise-claude-docs`;

  // Build page TOC
  buildPageToc(contentEl.querySelector(".md"), doc.slug);
  decoratePageToc();

  // Scroll to top or anchor
  let hashAnchor = window.location.hash.split("#").slice(2).join("#");
  if (hashAnchor) {
    try { hashAnchor = decodeURIComponent(hashAnchor); } catch (_) {}
    const target = document.getElementById(hashAnchor);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "instant", block: "start" }), 0);
    } else {
      window.scrollTo({ top: 0 });
    }
  } else {
    window.scrollTo({ top: 0 });
  }
}

function parseRoute() {
  const hash = window.location.hash || "";
  if (!hash || hash === "#" || hash === "#/") return { type: "home" };
  const m = hash.match(/^#\/(.+?)(?:#(.+))?$/);
  if (m) {
    let slug = m[1];
    let anchor = m[2] || null;
    try { slug = decodeURIComponent(slug); } catch (_) {}
    if (anchor) {
      try { anchor = decodeURIComponent(anchor); } catch (_) {}
    }
    return { type: "doc", slug, anchor };
  }
  return { type: "home" };
}

function route() {
  const r = parseRoute();
  if (r.type === "home") renderLanding();
  else renderDoc(r.slug);
  closeSidebar();
}

function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
  progressEl.style.width = pct + "%";
}

// Search filter
function applySearch() {
  const q = searchEl.value.trim().toLowerCase();
  document.querySelectorAll(".toc-link").forEach((a) => {
    if (!q) {
      a.classList.remove("hidden");
    } else {
      const match = (a.dataset.search || "").includes(q);
      a.classList.toggle("hidden", !match);
    }
  });
  document.querySelectorAll(".toc-part").forEach((part) => {
    const visible = part.querySelectorAll(".toc-link:not(.hidden)").length;
    part.style.display = visible ? "" : "none";
  });
}

function openSidebar() { sidebarEl.classList.add("open"); }
function closeSidebar() { sidebarEl.classList.remove("open"); }

// Init
renderSidebar();
window.addEventListener("hashchange", route);
window.addEventListener("scroll", updateProgress, { passive: true });
searchEl.addEventListener("input", applySearch);
menuToggle.addEventListener("click", openSidebar);

// Intercept anchor jumps within current doc — scroll without triggering route()
function interceptInDocAnchor(e) {
  const a = e.target.closest("a[data-target]");
  if (!a) return;
  const id = a.dataset.target;
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  const r = parseRoute();
  if (r.type === "doc") {
    history.replaceState(null, "", `#/${r.slug}#${id}`);
  }
}
pageTocEl.addEventListener("click", interceptInDocAnchor);
contentEl.addEventListener("click", interceptInDocAnchor);
document.addEventListener("click", (e) => {
  if (
    sidebarEl.classList.contains("open") &&
    !sidebarEl.contains(e.target) &&
    e.target !== menuToggle
  ) {
    closeSidebar();
  }
});

route();
updateProgress();
