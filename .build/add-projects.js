/* One-off build step: adds three live demos (tic-tac-toe, snake, notes) and
   four code showcases (Java, C++, SQL, Pawn) to the portfolio, plus the new
   skills and filter categories. Every anchor must match exactly once. */
const fs = require("fs");
const path = require("path");
const { highlight } = require("./highlight.js");

const ROOT = "C:/Users/cyrus/OneDrive/Desktop/Portfolio";
const FILE = path.join(ROOT, "index.html");
const REPO = "https://github.com/diamondzya/portfolio/tree/main/projects/";

let html = fs.readFileSync(FILE, "utf8");

function replaceOnce(oldText, newText, label) {
  const count = html.split(oldText).length - 1;
  if (count !== 1) throw new Error(label + ": found " + count + " matches (expected 1)");
  html = html.replace(oldText, newText);
  console.log("ok   " + label);
}

function insertBefore(anchor, text, label) {
  replaceOnce(anchor, text + anchor, label);
}

const ICON_OPEN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const ICON_CODE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 6-5 6 5 6"/><path d="m16 6 5 6-5 6"/></svg>';

function links(slug) {
  return [
    '            <div class="proj-links">',
    '              <a class="proj-link" href="projects/' + slug + '/index.html" target="_blank" rel="noopener">',
    "                " + ICON_OPEN,
    "                Open project",
    "              </a>",
    '              <a class="proj-link" href="' + REPO + slug + '" target="_blank" rel="noopener">',
    "                " + ICON_CODE,
    "                View code",
    "              </a>",
    "            </div>"
  ].join("\n");
}

function chips(list) {
  return '            <div class="chips">' +
    list.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") +
    "</div>";
}

/* ============================================================
   1. Skills — three groups, with the new languages
   ============================================================ */

replaceOnce(
`      <div class="skills-grid">
        <div class="skill-col" data-reveal>
          <h3>Comfortable with</h3>
          <p>The everyday tools behind every project on this page.</p>
          <ul class="skill-list">
            <li class="skill">HTML5</li>
            <li class="skill">CSS3</li>
            <li class="skill">JavaScript</li>
            <li class="skill">Tailwind CSS</li>
            <li class="skill">Responsive design</li>
            <li class="skill">Git &amp; GitHub</li>
            <li class="skill">UI design</li>
          </ul>
        </div>

        <div class="skill-col" data-reveal>
          <h3>Currently learning</h3>
          <p>What I&rsquo;m studying now to level up as a developer.</p>
          <ul class="skill-list">
            <li class="skill learning">React</li>
            <li class="skill learning">Node.js</li>
            <li class="skill learning">UI animation</li>
            <li class="skill learning">Mobile app development</li>
          </ul>
        </div>
      </div>`,
`      <div class="skills-grid">
        <div class="skill-col" data-reveal>
          <h3>Languages</h3>
          <p>What I write code in, from web pages to game servers.</p>
          <ul class="skill-list">
            <li class="skill">HTML5</li>
            <li class="skill">CSS3</li>
            <li class="skill">JavaScript</li>
            <li class="skill">Java</li>
            <li class="skill">C++</li>
            <li class="skill">SQL</li>
            <li class="skill">Pawn</li>
          </ul>
        </div>

        <div class="skill-col" data-reveal>
          <h3>Tools &amp; practices</h3>
          <p>How I work day to day.</p>
          <ul class="skill-list">
            <li class="skill">Tailwind CSS</li>
            <li class="skill">Git &amp; GitHub</li>
            <li class="skill">Responsive design</li>
            <li class="skill">UI design</li>
          </ul>
        </div>

        <div class="skill-col" data-reveal>
          <h3>Currently learning</h3>
          <p>What I&rsquo;m studying now to level up as a developer.</p>
          <ul class="skill-list">
            <li class="skill learning">React</li>
            <li class="skill learning">Node.js</li>
            <li class="skill learning">UI animation</li>
            <li class="skill learning">Mobile app development</li>
          </ul>
        </div>
      </div>`,
  "skills section");

replaceOnce(
  "        The tools I reach for every day, and the ones I&rsquo;m teaching myself next.",
  "        The languages and tools I build with, and what I&rsquo;m teaching myself next.",
  "skills lede");

/* ============================================================
   2. Filters + projects lede
   ============================================================ */

replaceOnce(
`        <button type="button" data-filter="systems" aria-pressed="false">Systems</button>
        <button type="button" data-filter="practice" aria-pressed="false">Practice</button>`,
`        <button type="button" data-filter="games" aria-pressed="false">Games</button>
        <button type="button" data-filter="systems" aria-pressed="false">Systems</button>
        <button type="button" data-filter="practice" aria-pressed="false">Practice</button>
        <button type="button" data-filter="code" aria-pressed="false">Code</button>`,
  "filter buttons");

replaceOnce(
`        These aren&rsquo;t screenshots — every app below is running live, right here on this page.
        Try them; the task list and expense tracker even remember your changes after a refresh.`,
`        These aren&rsquo;t screenshots — the web apps below run live, right here on this page.
        Four more are written in Java, C++, SQL, and Pawn, with their full source on the page.`,
  "projects lede");

/* ============================================================
   3. Three new live demos
   ============================================================ */

const tttCard = `        <!-- Tic-Tac-Toe -->
        <article class="proj" data-reveal data-cat="games">
          <div class="demo-bar" aria-hidden="true"><i></i><i></i><i></i><b>tic-tac-toe.js</b></div>
          <div class="demo-body" id="tttDemo">
            <h3 class="demo-title">Tic-Tac-Toe</h3>
            <p class="ttt-status" id="tttStatus">Your turn — you play X.</p>
            <div class="ttt-grid" id="tttGrid">
              <button class="ttt-cell" type="button" aria-label="Cell 1"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 2"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 3"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 4"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 5"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 6"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 7"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 8"></button>
              <button class="ttt-cell" type="button" aria-label="Cell 9"></button>
            </div>
            <div class="ttt-foot">
              <span class="ttt-score" id="tttScore">W 0 · L 0 · D 0</span>
              <button class="ttt-reset" id="tttReset" type="button">New game</button>
            </div>
          </div>
          <div class="proj-foot">
            <h3>You against a minimax AI</h3>
            <p>
              Play X against an opponent that searches the game tree before every move.
              It&rsquo;s hard to beat — but not impossible. The scoreboard keeps your wins,
              losses, and draws.
            </p>
${chips(["HTML", "CSS", "JavaScript", "Minimax"])}
${links("tic-tac-toe")}
          </div>
        </article>

`;

const snakeCard = `        <!-- Snake -->
        <article class="proj" data-reveal data-cat="games">
          <div class="demo-bar" aria-hidden="true"><i></i><i></i><i></i><b>snake.js</b></div>
          <div class="demo-body" id="snakeDemo" tabindex="0" aria-label="Snake — steer with the arrow keys, WASD, or the buttons below">
            <h3 class="demo-title">Snake</h3>
            <div class="snake-top">
              <span>Score <b id="snakeScore">0</b></span>
              <span>Best <b id="snakeBest">0</b></span>
            </div>
            <div class="snake-wrap">
              <canvas class="snake-canvas" id="snakeCanvas" width="300" height="300"></canvas>
              <div class="snake-over show" id="snakeOver">
                <div>
                  <b id="snakeOverTitle">Snake</b>
                  <span id="snakeOverText">Arrow keys, WASD, or the buttons below.</span>
                  <button class="snake-start" id="snakeStart" type="button">Start game</button>
                </div>
              </div>
            </div>
            <div class="snake-pad">
              <button class="sp-up" type="button" data-dir="up" aria-label="Up">&#9650;</button>
              <button class="sp-left" type="button" data-dir="left" aria-label="Left">&#9664;</button>
              <button class="sp-down" type="button" data-dir="down" aria-label="Down">&#9660;</button>
              <button class="sp-right" type="button" data-dir="right" aria-label="Right">&#9654;</button>
            </div>
          </div>
          <div class="proj-foot">
            <h3>The classic, on canvas</h3>
            <p>
              Steer with the arrow keys, WASD, or the on-screen pad. Eat, grow, and don&rsquo;t
              bite yourself — your best score is saved in
              <span class="mono">localStorage</span>.
            </p>
${chips(["HTML", "CSS", "JavaScript", "Canvas"])}
${links("snake")}
          </div>
        </article>

`;

const notesCard = `        <!-- Notes -->
        <article class="proj" data-reveal data-cat="tools">
          <div class="demo-bar" aria-hidden="true"><i></i><i></i><i></i><b>notes.js</b></div>
          <div class="demo-body" id="notesDemo">
            <h3 class="demo-title">Notes</h3>
            <form class="notes-form" id="notesForm" autocomplete="off">
              <input type="text" id="notesInput" placeholder="Write a note…" aria-label="New note" required>
              <button type="submit">Add</button>
            </form>
            <input class="notes-search" type="search" id="notesSearch" placeholder="Search notes…" aria-label="Search notes">
            <ul class="notes-list" id="notesList"></ul>
            <div class="notes-foot">
              <span id="notesCount">0 notes</span>
              <span>Saved in your browser</span>
            </div>
          </div>
          <div class="proj-foot">
            <h3>Quick notes that stick</h3>
            <p>
              Jot something down, search across your notes, and delete what you don&rsquo;t need.
              Everything lives in <span class="mono">localStorage</span>, so it&rsquo;s still here
              after a refresh.
            </p>
${chips(["HTML", "CSS", "JavaScript", "localStorage"])}
${links("notes")}
          </div>
        </article>

`;

const GRID_END = `      </div>
    </div>
  </section>

  <!-- ============================ Skills ============================ -->`;

insertBefore(GRID_END, tttCard + snakeCard + notesCard, "three new demo cards");

/* ============================================================
   4. Four code showcases, highlighted from the source files
   ============================================================ */

const CODE_PROJECTS = [
  {
    comment: "Java Student Records",
    slug: "java-student-records",
    file: "StudentRecords.java",
    lang: "java",
    title: "A console grade book in Java",
    text: "A small OOP exercise: a <span class=\"mono\">Student</span> class that averages grades, ranks the class with a comparator, and prints a summary table. The passing mark is 75, Philippine-style.",
    chips: ["Java", "OOP", "Collections"]
  },
  {
    comment: "C++ Library System",
    slug: "cpp-library-system",
    file: "Library.cpp",
    lang: "cpp",
    title: "A library system in C++",
    text: "Add, search, borrow, and return books from a console menu. Structs, vectors, and file I/O keep the catalogue alive between runs.",
    chips: ["C++", "STL", "File I/O"]
  },
  {
    comment: "SQL Player Database",
    slug: "sql-player-database",
    file: "players.sql",
    lang: "sql",
    title: "The database behind a game server",
    text: "Schema and queries for a multiplayer roleplay server: accounts, factions, ranks, and bans — with joins and aggregates for leaderboards and rosters.",
    chips: ["SQL", "MySQL", "Schema design"]
  },
  {
    comment: "Pawn Faction System",
    slug: "pawn-faction-system",
    file: "factions.pwn",
    lang: "pawn",
    title: "A faction system in Pawn",
    text: "Server-side scripting for a roleplay server: create factions, invite players, set ranks, and save membership. Pawn is the language behind SA-MP and open.mp servers.",
    chips: ["Pawn", "SA-MP / open.mp", "Game logic"]
  }
];

let codeCards = "";

for (const project of CODE_PROJECTS) {
  const sourcePath = path.join(ROOT, "projects", project.slug, project.file);
  const source = fs.readFileSync(sourcePath, "utf8").replace(/\s+$/, "");
  const marked = highlight(source, project.lang);

  codeCards += `        <!-- ${project.comment} -->
        <article class="proj" data-reveal data-cat="code">
          <div class="demo-bar" aria-hidden="true"><i></i><i></i><i></i><b>${project.file}</b></div>
          <div class="demo-body">
            <div class="code-view">
<pre class="code"><code>${marked}</code></pre>
            </div>
          </div>
          <div class="proj-foot">
            <h3>${project.title}</h3>
            <p>
              ${project.text}
            </p>
${chips(project.chips)}
${links(project.slug)}
          </div>
        </article>

`;
  console.log("ok   code card: " + project.slug + " (" + source.split("\n").length + " lines)");
}

insertBefore(GRID_END, codeCards, "four code cards");

/* ============================================================
   5. CSS
   ============================================================ */

const NEW_CSS = `/* ---------- tic tac toe ---------- */
.ttt-status {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  min-height: 1.5em;
  margin-bottom: 10px;
}
.ttt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 234px;
  margin: 0 auto 12px;
}
.ttt-cell {
  aspect-ratio: 1;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  font-size: 1.6rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}
.ttt-cell:hover:not(:disabled) { border-color: var(--accent); transform: translateY(-2px); }
.ttt-cell:disabled { cursor: default; }
.ttt-cell.x { color: var(--accent); }
.ttt-cell.o { color: var(--accent-2); }
.ttt-cell.win { background: var(--ok-soft); border-color: var(--ok); }
.ttt-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.78rem;
  color: var(--ink-2);
}
.ttt-score { font-family: "JetBrains Mono", monospace; }
.ttt-reset {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--ink-2);
  font-size: 0.78rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.ttt-reset:hover { border-color: var(--accent); color: var(--accent); }

/* ---------- snake ---------- */
.snake-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--ink-2);
  margin-bottom: 8px;
}
.snake-top b { font-family: "JetBrains Mono", monospace; color: var(--ink); }
.snake-wrap {
  position: relative;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  overflow: hidden;
}
.snake-canvas { display: block; width: 100%; height: auto; }
.snake-over {
  position: absolute;
  inset: 0;
  display: none;
  place-items: center;
  text-align: center;
  padding: 18px;
  background: color-mix(in srgb, var(--surface) 84%, transparent);
  backdrop-filter: blur(3px);
}
.snake-over.show { display: grid; }
.snake-over b { display: block; font-size: 1.05rem; margin-bottom: 4px; }
.snake-over span { display: block; font-size: 0.8rem; color: var(--ink-2); margin-bottom: 12px; }
.snake-start {
  padding: 9px 20px;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  font-size: 0.86rem;
  transition: filter 0.2s ease;
}
.snake-start:hover { filter: brightness(1.1); }
.snake-pad {
  display: grid;
  grid-template-columns: repeat(3, 42px);
  grid-template-rows: repeat(2, 36px);
  gap: 6px;
  justify-content: center;
  margin-top: 12px;
}
.snake-pad button {
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 0.85rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.snake-pad button:hover { border-color: var(--accent); color: var(--accent); }
.snake-pad .sp-up { grid-column: 2; }
.snake-pad .sp-left { grid-column: 1; grid-row: 2; }
.snake-pad .sp-down { grid-column: 2; grid-row: 2; }
.snake-pad .sp-right { grid-column: 3; grid-row: 2; }

/* ---------- notes ---------- */
.notes-form { display: flex; gap: 8px; margin-bottom: 9px; }
.notes-form input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  outline: none;
  font-size: 0.88rem;
}
.notes-form input:focus { border-color: var(--accent); }
.notes-form button {
  padding: 0 16px;
  border-radius: 11px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  font-size: 0.88rem;
  transition: filter 0.2s ease;
}
.notes-form button:hover { filter: brightness(1.1); }
.notes-search {
  width: 100%;
  padding: 9px 12px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--surface);
  outline: none;
  font-size: 0.84rem;
  margin-bottom: 10px;
}
.notes-search:focus { border-color: var(--accent); }
.notes-list { list-style: none; min-height: 176px; display: grid; gap: 8px; align-content: start; }
.note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-2);
}
.note-text { flex: 1; font-size: 0.86rem; overflow-wrap: anywhere; }
.note-time { display: block; font-size: 0.68rem; color: var(--ink-2); margin-top: 3px; }
.note-del {
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 8px;
  color: var(--ink-2);
  display: grid;
  place-items: center;
  transition: background 0.2s ease, color 0.2s ease;
}
.note-del:hover { background: var(--bad-soft); color: var(--bad); }
.note-del svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; }
.notes-empty { text-align: center; color: var(--ink-2); font-size: 0.85rem; padding: 28px 0; }
.notes-foot { display: flex; justify-content: space-between; gap: 10px; font-size: 0.74rem; color: var(--ink-2); margin-top: 10px; }

/* ---------- code viewer ---------- */
.code-view {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0A1120;
  overflow: hidden;
}
pre.code {
  margin: 0;
  padding: 15px 16px;
  overflow: auto;
  font-family: "JetBrains Mono", ui-monospace, "Cascadia Code", Consolas, monospace;
  font-size: 0.76rem;
  line-height: 1.7;
  color: #D7E2F2;
  tab-size: 4;
}
pre.code code { font-family: inherit; white-space: pre; }
.tok-c { color: #6E7F99; font-style: italic; }
.tok-p { color: #F2A0C0; }
.tok-s { color: #9BE38B; }
.tok-n { color: #F5C87A; }
.tok-k { color: #5EC8F5; }
.tok-t { color: #C9A6F5; }

/* ---------- portfolio-only ---------- */
/* clips the code preview inside a card; never matches on a project page */
.proj .code-view { position: relative; max-height: 300px; }
.proj .code-view::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 64px;
  background: linear-gradient(to bottom, transparent, #0A1120);
  pointer-events: none;
}

`;

insertBefore(`/* ============================================================
   Skills
   ============================================================ */`, NEW_CSS, "demo + code CSS");

/* ============================================================
   6. JS for the three demos
   ============================================================ */

const NEW_JS = `/* ============================================================
   Demo 11 — Tic tac toe
   The AI searches the game tree with a memoised minimax, but
   slips now and then so the game stays winnable.
   ============================================================ */
(function () {
  const demo = document.getElementById("tttDemo");
  if (!demo) return;

  const grid = document.getElementById("tttGrid");
  const cells = Array.prototype.slice.call(grid.querySelectorAll(".ttt-cell"));
  const statusEl = document.getElementById("tttStatus");
  const scoreEl = document.getElementById("tttScore");
  const resetBtn = document.getElementById("tttReset");

  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const memo = new Map();

  let board = new Array(9).fill("");
  let over = false;
  let thinking = false;
  let score = { win: 0, loss: 0, draw: 0 };

  function result(b) {
    for (let i = 0; i < LINES.length; i++) {
      const line = LINES[i];
      const first = b[line[0]];
      if (first && first === b[line[1]] && first === b[line[2]]) return first;
    }
    return b.indexOf("") === -1 ? "draw" : null;
  }

  function lineFor(b, player) {
    for (let i = 0; i < LINES.length; i++) {
      const line = LINES[i];
      if (b[line[0]] === player && b[line[1]] === player && b[line[2]] === player) return line;
    }
    return null;
  }

  function best(b, player, depth) {
    const key = b.join("") + player + depth;
    if (memo.has(key)) return memo.get(key);

    const done = result(b);
    if (done === "X") return { score: -10 + depth, move: -1 };
    if (done === "O") return { score: 10 - depth, move: -1 };
    if (done === "draw") return { score: 0, move: -1 };

    let bestScore = player === "O" ? -Infinity : Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = player;
      const reply = best(b, player === "O" ? "X" : "O", depth + 1).score;
      b[i] = "";
      if (player === "O" ? reply > bestScore : reply < bestScore) {
        bestScore = reply;
        bestMove = i;
      }
    }

    const out = { score: bestScore, move: bestMove };
    memo.set(key, out);
    return out;
  }

  function openCells() {
    const open = [];
    for (let i = 0; i < 9; i++) {
      if (!board[i]) open.push(i);
    }
    return open;
  }

  function aiMove() {
    const open = openCells();
    if (!open.length) return -1;
    if (Math.random() < 0.2) {
      return open[Math.floor(Math.random() * open.length)];
    }
    return best(board.slice(), "O", 0).move;
  }

  function paint(winLine) {
    cells.forEach(function (cell, i) {
      cell.textContent = board[i];
      cell.className = "ttt-cell" + (board[i] ? " " + board[i].toLowerCase() : "") +
        (winLine && winLine.indexOf(i) !== -1 ? " win" : "");
      cell.disabled = !!board[i] || over || thinking;
    });
  }

  function end(state) {
    over = true;
    thinking = false;
    const winLine = state === "draw" ? null : lineFor(board, state);
    if (state === "X") { score.win += 1; statusEl.textContent = "You win!"; }
    else if (state === "O") { score.loss += 1; statusEl.textContent = "The AI takes this one."; }
    else { score.draw += 1; statusEl.textContent = "Draw — well played."; }
    scoreEl.textContent = "W " + score.win + " · L " + score.loss + " · D " + score.draw;
    paint(winLine);
  }

  function play(index) {
    if (over || thinking || board[index]) return;

    board[index] = "X";
    let state = result(board);
    if (state) return end(state);

    thinking = true;
    paint();
    statusEl.textContent = "The AI is thinking…";

    setTimeout(function () {
      const move = aiMove();
      if (move >= 0) board[move] = "O";
      thinking = false;
      state = result(board);
      if (state) return end(state);
      paint();
      statusEl.textContent = "Your turn — you play X.";
    }, 260);
  }

  grid.addEventListener("click", function (e) {
    const cell = e.target.closest(".ttt-cell");
    if (cell) play(cells.indexOf(cell));
  });

  resetBtn.addEventListener("click", function () {
    board = new Array(9).fill("");
    over = false;
    thinking = false;
    paint();
    statusEl.textContent = "Your turn — you play X.";
  });

  paint();
})();

/* ============================================================
   Demo 12 — Snake
   Canvas game loop on a timer, keyboard plus on-screen pad.
   The best score is kept in localStorage.
   ============================================================ */
(function () {
  const demo = document.getElementById("snakeDemo");
  if (!demo) return;

  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("snakeScore");
  const bestEl = document.getElementById("snakeBest");
  const overEl = document.getElementById("snakeOver");
  const overTitle = document.getElementById("snakeOverTitle");
  const overText = document.getElementById("snakeOverText");
  const startBtn = document.getElementById("snakeStart");

  const CELL = 20;
  const COLS = canvas.width / CELL;
  const ROWS = canvas.height / CELL;
  const SPEED = 120;

  const SNAKE_COLOR = "#2AA9E0";
  const HEAD_COLOR = "#1B87B8";
  const FOOD_COLOR = "#F59E0B";

  let snake, dir, queued, food, score, ticker, running;

  let best = parseInt(localStorage.getItem("cdm-snake-best") || "0", 10) || 0;
  bestEl.textContent = best;

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
    } while (snake.some(function (part) { return part.x === food.x && part.y === food.y; }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = FOOD_COLOR;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach(function (part, i) {
      ctx.fillStyle = i === 0 ? HEAD_COLOR : SNAKE_COLOR;
      const x = part.x * CELL + 2;
      const y = part.y * CELL + 2;
      const size = CELL - 4;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 5);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, size, size);
      }
    });
  }

  function reset() {
    snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
    dir = { x: 1, y: 0 };
    queued = [];
    score = 0;
    scoreEl.textContent = "0";
    placeFood();
    draw();
  }

  function stop() {
    if (ticker) { clearInterval(ticker); ticker = null; }
    running = false;
  }

  function die() {
    stop();
    overTitle.textContent = "Game over";
    overText.textContent = "You scored " + score + ".";
    startBtn.textContent = "Play again";
    overEl.classList.add("show");
  }

  function step() {
    if (queued.length) dir = queued.shift();

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) return die();
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) return die();
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = score;
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        try { localStorage.setItem("cdm-snake-best", String(best)); } catch (e) {}
      }
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function start() {
    stop();
    reset();
    overEl.classList.remove("show");
    startBtn.textContent = "Start game";
    ticker = setInterval(step, SPEED);
    running = true;
    demo.focus();
  }

  function turn(x, y) {
    const last = queued.length ? queued[queued.length - 1] : dir;
    if (last.x === -x && last.y === -y) return;
    if (last.x === x && last.y === y) return;
    if (queued.length < 2) queued.push({ x: x, y: y });
  }

  const KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
  };

  demo.addEventListener("keydown", function (e) {
    const move = KEYS[e.key];
    if (!move) return;
    e.preventDefault();
    if (running) turn(move[0], move[1]);
  });

  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  demo.querySelectorAll(".snake-pad button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (running) turn(DIRS[btn.dataset.dir][0], DIRS[btn.dataset.dir][1]);
      demo.focus();
    });
  });

  startBtn.addEventListener("click", start);

  reset();
})();

/* ============================================================
   Demo 13 — Notes
   Quick notes saved in localStorage, with search.
   ============================================================ */
(function () {
  const form = document.getElementById("notesForm");
  if (!form) return;

  const KEY = "cdm-notes";
  const input = document.getElementById("notesInput");
  const search = document.getElementById("notesSearch");
  const list = document.getElementById("notesList");
  const countEl = document.getElementById("notesCount");

  const DAY = 86400000;
  const SEED = [
    { id: 1, text: "Review the DONAT sprint board before Friday", at: Date.now() - 2 * DAY },
    { id: 2, text: "Practice Java collections for the quiz", at: Date.now() - DAY },
    { id: 3, text: "Push the portfolio updates to GitHub", at: Date.now() - 3600000 }
  ];

  let notes = load();
  let nextId = notes.reduce(function (max, note) { return Math.max(max, note.id); }, 0) + 1;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return SEED.slice();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(function (n) { return n && typeof n.text === "string"; })
          .map(function (n) {
            return { id: Number(n.id) || 0, text: n.text, at: Number(n.at) || Date.now() };
          });
      }
    } catch (e) {}
    return SEED.slice();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {}
  }

  function when(at) {
    const mins = Math.floor((Date.now() - at) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    return days === 1 ? "yesterday" : days + "d ago";
  }

  function render() {
    const term = search.value.trim().toLowerCase();
    const shown = term
      ? notes.filter(function (n) { return n.text.toLowerCase().indexOf(term) !== -1; })
      : notes;

    list.innerHTML = "";

    if (!shown.length) {
      const empty = document.createElement("li");
      empty.className = "notes-empty";
      empty.textContent = notes.length === 0
        ? "No notes yet — write your first one above."
        : "No notes match that search.";
      list.appendChild(empty);
    }

    shown.slice().reverse().forEach(function (note) {
      const item = document.createElement("li");
      item.className = "note";

      const text = document.createElement("span");
      text.className = "note-text";
      text.textContent = note.text;

      const time = document.createElement("span");
      time.className = "note-time";
      time.textContent = when(note.at);
      text.appendChild(time);

      const del = document.createElement("button");
      del.type = "button";
      del.className = "note-del";
      del.setAttribute("aria-label", "Delete note: " + note.text);
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      del.addEventListener("click", function () {
        notes = notes.filter(function (n) { return n.id !== note.id; });
        save();
        render();
      });

      item.append(text, del);
      list.appendChild(item);
    });

    countEl.textContent = term
      ? shown.length + " of " + notes.length + " notes"
      : (notes.length === 1 ? "1 note" : notes.length + " notes");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    notes.push({ id: nextId++, text: text, at: Date.now() });
    input.value = "";
    save();
    render();
    input.focus();
  });

  search.addEventListener("input", render);

  render();
})();

`;

insertBefore(`/* ============================================================
   Footer year
   ============================================================ */`, NEW_JS, "three demo scripts");

/* ============================================================
   Write + verify
   ============================================================ */

fs.writeFileSync(FILE, html);

const out = fs.readFileSync(FILE, "utf8");
const count = (re) => (out.match(re) || []).length;

console.log("");
const checks = [
  ["project cards", /<article class="proj" data-reveal/g, 17],
  ["data-cat=\"games\"", /data-cat="games"/g, 2],
  ["data-cat=\"code\"", /data-cat="code"/g, 4],
  ["filter buttons", /data-filter="/g, 7],
  ["code blocks", /<pre class="code">/g, 4],
  ["tok- spans", /class="tok-/g, null],
  ["Java skill", /<li class="skill">Java<\/li>/g, 1],
  ["C++ skill", /<li class="skill">C\+\+<\/li>/g, 1],
  ["SQL skill", /<li class="skill">SQL<\/li>/g, 1],
  ["Pawn skill", /<li class="skill">Pawn<\/li>/g, 1]
];

let ok = true;
for (const [label, re, expected] of checks) {
  const n = count(re);
  const pass = expected === null ? n > 100 : n === expected;
  if (!pass) ok = false;
  console.log((pass ? "ok   " : "FAIL ") + label + " → " + n + (expected === null ? "" : " (expect " + expected + ")"));
}

if (!ok) process.exit(1);
console.log("\nall project additions applied");
