/* One-off build step: splits each demo out of index.html into its own
   standalone project page under projects/<slug>/.
   Run with node from the Portfolio folder. */
const fs = require("fs");
const path = require("path");

const ROOT = "C:/Users/cyrus/OneDrive/Desktop/Portfolio";
const REPO = "https://github.com/diamondzya/portfolio/tree/main/projects/";

const PROJECTS = [
  { slug: "calculator",           comment: "Calculator",         css: "calculator",           js: "Demo 1 — Calculator" },
  { slug: "weather",              comment: "Weather",            css: "weather",              js: "Demo 2 — Weather app" },
  { slug: "grade-tracker",        comment: "Grade Tracker",      css: "grade tracker",        js: "Demo 3 — Grade tracker" },
  { slug: "donat-attendance",     comment: "DONAT Attendance",   css: "attendance",           js: "Demo 4 — DONAT attendance" },
  { slug: "study-timer",          comment: "Study Timer",        css: "study timer",          js: "Demo 5 — Study timer" },
  { slug: "task-manager",         comment: "Task Manager",       css: "task manager",         js: "Demo 6 — Task manager" },
  { slug: "web-dev-quiz",         comment: "Web Dev Quiz",       css: "quiz",                 js: "Demo 7 — Web dev quiz" },
  { slug: "typing-test",          comment: "Typing Speed Test",  css: "typing test",          js: "Demo 8 — Typing speed test", wide: true },
  { slug: "password-generator",   comment: "Password Generator", css: "password generator",   js: "Demo 9 — Password generator" },
  { slug: "expense-tracker",      comment: "Expense Tracker",    css: "expense tracker",      js: "Demo 10 — Expense tracker" },
  { slug: "tic-tac-toe",          comment: "Tic-Tac-Toe",        css: "tic tac toe",          js: "Demo 11 — Tic tac toe" },
  { slug: "snake",                comment: "Snake",              css: "snake",                js: "Demo 12 — Snake" },
  { slug: "notes",                comment: "Notes",              css: "notes",                js: "Demo 13 — Notes" },
  { slug: "java-student-records", comment: "Java Student Records", css: "code viewer",        name: "Java Student Records", wide: true, code: true },
  { slug: "cpp-library-system",   comment: "C++ Library System", css: "code viewer",          name: "C++ Library System",   wide: true, code: true },
  { slug: "sql-player-database",  comment: "SQL Player Database", css: "code viewer",         name: "SQL Player Database",  wide: true, code: true },
  { slug: "pawn-faction-system",  comment: "Pawn Faction System", css: "code viewer",         name: "Pawn Faction System",  wide: true, code: true }
];

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* ---------- helpers ---------- */

function cardFor(comment) {
  const start = html.indexOf("<!-- " + comment + " -->");
  if (start === -1) throw new Error("card not found: " + comment);
  const end = html.indexOf("</article>", start);
  if (end === -1) throw new Error("card end not found: " + comment);
  return html.slice(start, end + "</article>".length);
}

// the demo markup: the opening tag keeps its id/data-* (some demos read them)
function demoFor(card) {
  const open = card.indexOf('<div class="demo-body"');
  if (open === -1) throw new Error("demo-body not found");
  const tagEnd = card.indexOf(">", open) + 1;
  const openTag = card.slice(open, tagEnd).replace('class="demo-body"', 'class="demo-stage"');

  let depth = 1;
  let i = tagEnd;
  while (depth > 0) {
    const nextOpen = card.indexOf("<div", i);
    const nextClose = card.indexOf("</div>", i);
    if (nextClose === -1) throw new Error("unbalanced demo markup");
    if (nextOpen !== -1 && nextOpen < nextClose) { depth += 1; i = nextOpen + 4; }
    else { depth -= 1; i = nextClose + 6; }
  }

  const inner = card.slice(tagEnd, i - 6)
    .replace(/\s*<h3 class="demo-title">[\s\S]*?<\/h3>/, "");
  return { openTag: openTag, inner: inner };
}

function nameOf(card) {
  const m = card.match(/<h3 class="demo-title">([\s\S]*?)<\/h3>/);
  if (!m) throw new Error("demo title not found");
  return m[1].trim();
}

function ledeOf(card) {
  const foot = card.slice(card.indexOf('<div class="proj-foot">'));
  const m = foot.match(/<p>([\s\S]*?)<\/p>/);
  if (!m) throw new Error("card description not found");
  return m[1].replace(/\s+/g, " ").trim();
}

function plainText(s) {
  return s.replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&rsquo;/g, "'").replace(/&mdash;/g, "-").replace(/\s+/g, " ")
    .trim();
}

function metaDescription(lede) {
  const text = plainText(lede);
  if (text.length <= 155) return text;
  return text.slice(0, 152).replace(/\s+\S*$/, "") + "…";
}

// css: from the project's marker up to the next section marker
function cssFor(key) {
  const marker = "/* ---------- " + key + " ---------- */";
  const start = html.indexOf(marker);
  if (start === -1) throw new Error("css marker not found: " + key);
  const after = start + marker.length;
  const candidates = [
    html.indexOf("/* ----------", after),
    html.indexOf("/* ===", after)
  ].filter(function (n) { return n !== -1; });
  const end = Math.min.apply(null, candidates);
  return html.slice(start, end).trim();
}

// js: the demo's IIFE, from after its header comment to the next header
function jsFor(label) {
  const start = html.indexOf(label);
  if (start === -1) throw new Error("js label not found: " + label);
  const afterHeader = html.indexOf("*/", start) + 2;
  const end = html.indexOf("/* ============================================================", afterHeader);
  return html.slice(afterHeader, end === -1 ? undefined : end).trim();
}

function dedent(text) {
  const lines = text.replace(/^\n+|\s+$/g, "").split("\n");
  const widths = lines.filter(function (l) { return l.trim(); })
    .map(function (l) { return l.match(/^ */)[0].length; });
  const cut = widths.length ? Math.min.apply(null, widths) : 0;
  return lines.map(function (l) { return l.slice(cut); }).join("\n");
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text.split("\n").map(function (l) { return l.trim() ? pad + l : l; }).join("\n");
}

/* ---------- shell templates ---------- */

const SHELL_CSS_TOP = `/* {{NAME}} — a standalone project page by Cyrus Daniel Madriaga
   Tokens match the portfolio, so the theme carries across. */

:root {
  --bg: #E8F0FA;
  --bg-soft: #F6FAFE;
  --surface: #FFFFFF;
  --surface-2: #F1F6FC;
  --ink: #0D1B2E;
  --ink-2: #46586F;
  --line: rgba(13, 27, 46, 0.14);
  --accent: #0369A1;
  --accent-soft: rgba(3, 105, 161, 0.12);
  --accent-2: #B45309;
  --ok: #047857;
  --ok-soft: rgba(4, 120, 87, 0.14);
  --bad: #B91C1C;
  --bad-soft: rgba(185, 28, 28, 0.12);
  --shadow: 0 18px 44px -24px rgba(13, 27, 46, 0.4);
  --weather-grad: linear-gradient(135deg, #4FACFE 0%, #00C6FB 60%, #00F2FE 100%);
  color-scheme: light;
}

[data-theme="dark"] {
  --bg: #070B14;
  --bg-soft: #0B1220;
  --surface: #0E1729;
  --surface-2: #131F36;
  --ink: #E7EEF9;
  --ink-2: #96A8C2;
  --line: rgba(231, 238, 249, 0.13);
  --accent: #38BDF8;
  --accent-soft: rgba(56, 189, 248, 0.14);
  --accent-2: #FBBF24;
  --ok: #34D399;
  --ok-soft: rgba(52, 211, 153, 0.14);
  --bad: #F87171;
  --bad-soft: rgba(248, 113, 113, 0.14);
  --shadow: 0 26px 55px -30px rgba(0, 0, 0, 0.85);
  --weather-grad: linear-gradient(135deg, #0B2545 0%, #10406E 55%, #1565A8 100%);
  color-scheme: dark;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  transition: background 0.35s ease, color 0.35s ease;
}

button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
input, select { font: inherit; color: inherit; }
a { color: var(--accent); }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px; }
::selection { background: var(--accent); color: var(--bg); }

.mono { font-family: "JetBrains Mono", ui-monospace, "Cascadia Code", Consolas, monospace; }

/* ---------- page chrome ---------- */
.page-bar {
  max-width: 660px;
  margin: 0 auto;
  padding: 22px clamp(18px, 4vw, 28px) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.page-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--ink-2);
  text-decoration: none;
  transition: color 0.2s ease;
}
.page-back:hover { color: var(--accent); }
.page-back svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.theme-toggle {
  width: 40px; height: 40px;
  display: grid; place-items: center;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.theme-toggle:hover { border-color: var(--accent); transform: translateY(-1px); }
.theme-toggle svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.i-sun { display: none; }
[data-theme="dark"] .i-sun { display: block; }
[data-theme="dark"] .i-moon { display: none; }

.page { max-width: 660px; margin: 0 auto; padding: clamp(26px, 5vw, 44px) clamp(18px, 4vw, 28px) 64px; }
.page-title { font-size: clamp(1.7rem, 5vw, 2.3rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; }
.page-lede { color: var(--ink-2); margin: 10px 0 30px; max-width: 62ch; }

.stage {
  max-width: 520px;
  margin-inline: auto;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: clamp(18px, 4vw, 26px);
  box-shadow: var(--shadow);
}
.stage-wide { max-width: 640px; }

.page-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px 20px;
  margin-top: 30px;
  font-size: 0.82rem;
  color: var(--ink-2);
}
.page-foot a { color: var(--accent); text-decoration: none; }
.page-foot a:hover { text-decoration: underline; text-underline-offset: 3px; }

.demo-title { text-align: center; font-size: 1.02rem; font-weight: 600; margin-bottom: 12px; color: var(--ink); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}

/* ---------- project styles ---------- */
`;

const SHELL_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{NAME}} — Cyrus Daniel Madriaga</title>
<meta name="description" content="{{DESC}}">
<meta name="theme-color" content="#070B14">

<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2338BDF8'/%3E%3Cstop offset='1' stop-color='%230284C7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='url(%23g)'/%3E%3Ctext x='32' y='44' font-family='Arial, sans-serif' font-size='36' font-weight='bold' fill='white' text-anchor='middle'%3EC%3C/text%3E%3C/svg%3E">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<script>
  (function () {
    try {
      var saved = localStorage.getItem("cdm-theme");
      var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.dataset.theme = saved || (prefersLight ? "light" : "dark");
    } catch (e) {
      document.documentElement.dataset.theme = "dark";
    }
  })();
</script>

<link rel="stylesheet" href="style.css">
</head>
<body>

<header class="page-bar">
  <a class="page-back" href="../../index.html#projects">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>
    All projects
  </a>
  <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to light theme">
    <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
    <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  </button>
</header>

<main class="page">
  <h1 class="page-title">{{NAME}}</h1>
  <p class="page-lede">{{LEDE}}</p>

  <section class="stage{{STAGE_CLASS}}">
{{DEMO}}
  </section>

  <footer class="page-foot">
    <p>Made with ♥ by <a href="../../index.html">Cyrus Daniel Madriaga</a></p>
    <a href="{{REPO}}{{SLUG}}">View the source</a>
  </footer>
</main>

{{SCRIPT}}<script>
  /* page chrome: theme toggle, sharing the same preference as the portfolio */
  (function () {
    var root = document.documentElement;
    var btn = document.getElementById("themeToggle");
    var meta = document.querySelector('meta[name="theme-color"]');

    function label() {
      var goingTo = root.dataset.theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", "Switch to " + goingTo + " theme");
      if (meta) meta.setAttribute("content", root.dataset.theme === "dark" ? "#070B14" : "#E8F0FA");
    }
    label();

    btn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("cdm-theme", next); } catch (e) {}
      label();
    });
  })();
</script>
</body>
</html>
`;

/* ---------- generate ---------- */

let written = 0;

for (const project of PROJECTS) {
  const card = cardFor(project.comment);
  const demo = demoFor(card);
  const name = project.name || nameOf(card);
  const lede = ledeOf(card);
  const css = cssFor(project.css);
  const js = project.js ? jsFor(project.js) : "";

  if (!demo.inner.trim()) throw new Error("empty demo for " + project.slug);
  if (project.js && !js.trim()) throw new Error("empty js for " + project.slug);

  const dir = path.join(ROOT, "projects", project.slug);
  fs.mkdirSync(dir, { recursive: true });

  // code showcases keep their source at column zero; live demos get re-indented
  const demoBlock = project.code
    ? [indent(demo.openTag, 4), demo.inner.trim(), "    </div>"].join("\n")
    : [indent(demo.openTag, 4), indent(dedent(demo.inner), 6), "    </div>"].join("\n");

  const pageHtml = SHELL_HTML
    .replace(/\{\{NAME\}\}/g, name)
    .replace(/\{\{DESC\}\}/g, metaDescription(lede))
    .replace(/\{\{LEDE\}\}/g, lede)
    .replace(/\{\{STAGE_CLASS\}\}/g, project.wide ? " stage-wide" : "")
    .replace(/\{\{DEMO\}\}/g, demoBlock)
    .replace(/\{\{SCRIPT\}\}/g, project.js ? '<script src="script.js"></script>\n' : "")
    .replace(/\{\{REPO\}\}/g, REPO)
    .replace(/\{\{SLUG\}\}/g, project.slug);

  const pageCss = SHELL_CSS_TOP.replace(/\{\{NAME\}\}/g, name) + "\n" + css + "\n";

  fs.writeFileSync(path.join(dir, "index.html"), pageHtml);
  fs.writeFileSync(path.join(dir, "style.css"), pageCss);
  if (project.js) fs.writeFileSync(path.join(dir, "script.js"), js + "\n");

  written += 1;
  console.log(
    project.slug.padEnd(20),
    "html", String(pageHtml.length).padStart(6),
    "css", String(pageCss.length).padStart(6),
    "js", String(js.length).padStart(6)
  );
}

console.log("\nprojects written:", written, "(expect " + PROJECTS.length + ")");
