/* One-off build step: adds data-cat to each project card and inserts the
   "Open project" / "View code" links at the end of each card's footer.
   Run once with node; asserts every replacement landed. */
const fs = require("fs");

const FILE = "C:/Users/cyrus/OneDrive/Desktop/Portfolio/index.html";
const REPO = "https://github.com/diamondzya/portfolio/tree/main/projects/";

// comment text, category, folder slug
const CARDS = [
  ["Calculator", "apps", "calculator"],
  ["Weather", "apps", "weather"],
  ["Grade Tracker", "systems", "grade-tracker"],
  ["DONAT Attendance", "systems", "donat-attendance"],
  ["Study Timer", "tools", "study-timer"],
  ["Task Manager", "tools", "task-manager"],
  ["Web Dev Quiz", "practice", "web-dev-quiz"],
  ["Typing Speed Test", "practice", "typing-test"],
  ["Password Generator", "tools", "password-generator"],
  ["Expense Tracker", "systems", "expense-tracker"]
];

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

let html = fs.readFileSync(FILE, "utf8");
let added = 0;

for (const [comment, cat, slug] of CARDS) {
  const cardStart = '<!-- ' + comment + ' -->\n        <article class="proj" data-reveal>';
  const cardStartNew = '<!-- ' + comment + ' -->\n        <article class="proj" data-reveal data-cat="' + cat + '">';

  if (html.indexOf(cardStartNew) !== -1) continue;          // already done
  if (html.indexOf(cardStart) === -1) {
    console.error("MISSING card start for " + comment);
    process.exit(1);
  }
  html = html.replace(cardStart, cardStartNew);

  // find this card's end, then insert the links before the last </div> that closes .proj-foot
  const from = html.indexOf(cardStartNew);
  const cardEnd = html.indexOf("</article>", from);
  if (cardEnd === -1) { console.error("MISSING </article> for " + comment); process.exit(1); }

  const closeFoot = html.lastIndexOf("</div>", cardEnd);
  if (closeFoot === -1 || closeFoot < from) { console.error("MISSING proj-foot close for " + comment); process.exit(1); }

  // the last </div> before </article> closes .proj-foot; step back to the line start
  const lineStart = html.lastIndexOf("\n", closeFoot) + 1;
  html = html.slice(0, lineStart) + links(slug) + "\n" + html.slice(lineStart);
  added++;
}

fs.writeFileSync(FILE, html);

// verify
const out = fs.readFileSync(FILE, "utf8");
const cats = (out.match(/data-cat="/g) || []).length;
const linkBlocks = (out.match(/class="proj-links"/g) || []).length;
console.log("cards updated:", added);
console.log("data-cat attributes:", cats, "(expect 10)");
console.log("proj-links blocks:", linkBlocks, "(expect 10)");
if (cats !== 10 || linkBlocks !== 10) process.exit(1);
