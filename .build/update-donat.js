/* One-off: the club is DONAT (Developers of Next Advanced Technology), the
   school is STI Ortigas-Cainta, and IT MAWD is the strand. Every replacement
   must match exactly once, or the script fails without writing. */
const fs = require("fs");

const FILE = "C:/Users/cyrus/OneDrive/Desktop/Portfolio/index.html";
let html = fs.readFileSync(FILE, "utf8");

const EDITS = [
  ["meta description",
   '<meta name="description" content="Portfolio of Cyrus Daniel Madriaga, Junior Developer at Club Mobile App and Web Development. Live demos of apps and systems built with HTML, CSS, and JavaScript.">',
   '<meta name="description" content="Portfolio of Cyrus Daniel Madriaga — Junior Developer at DONAT and IT Mobile App and Web Development student at STI Ortigas-Cainta. Live demos of apps and systems built with HTML, CSS, and JavaScript.">'],

  ["hero screen-reader line",
   '<span class="sr-only">Junior developer at Club Mobile App and Web Development.</span>',
   '<span class="sr-only">Junior developer at DONAT, the Developers of Next Advanced Technology, and IT Mobile App and Web Development student at STI Ortigas-Cainta.</span>'],

  ["hero lede",
   `        I started writing code in <strong>Grade 7</strong> and never stopped.
        Today I build responsive web and mobile experiences as a
        <strong>Junior Developer</strong> with my club, turning ideas into
        things people can actually click, tap, and use.`,
   `        I started writing code in <strong>Grade 7</strong> and never stopped.
        I'm studying <strong>IT Mobile App and Web Development</strong> at
        <strong>STI Ortigas-Cainta</strong>, and I build responsive web and mobile
        experiences as a <strong>Junior Developer</strong> at <strong>DONAT</strong>,
        turning ideas into things people can actually click, tap, and use.`],

  ["about — current work paragraph",
   `          <p>
            Today I'm a Junior Developer at the <strong>Club Mobile App and Web Development</strong>, where I
            build alongside other student developers and learn what it means to ship real projects
            as a team. I'm still early in my journey — and that's exactly what makes it exciting.
          </p>`,
   `          <p>
            Today I'm a Junior Developer at <strong>DONAT</strong>, where I build alongside other
            student developers and learn what it means to ship real projects as a team. I'm studying
            the <strong>IT MAWD</strong> strand at <strong>STI Ortigas-Cainta</strong>, and I'm still
            early in my journey — which is exactly what makes it exciting.
          </p>`],

  ["quick facts — role, club, school, strand",
   `          <div class="fact">
            <dt>Role</dt>
            <dd>Junior Developer</dd>
          </div>
          <div class="fact">
            <dt>Club</dt>
            <dd>Mobile App and Web Development</dd>
          </div>
          <div class="fact">
            <dt>Focus</dt>
            <dd>Web &amp; mobile interfaces</dd>
          </div>`,
   `          <div class="fact">
            <dt>Role</dt>
            <dd>Junior Developer at DONAT</dd>
          </div>
          <div class="fact">
            <dt>Club</dt>
            <dd>DONAT (Developers of Next Advanced Technology)</dd>
          </div>
          <div class="fact">
            <dt>School</dt>
            <dd>STI Ortigas-Cainta</dd>
          </div>
          <div class="fact">
            <dt>Strand</dt>
            <dd>IT Mobile App and Web Development (IT MAWD)</dd>
          </div>`],

  ["journey — Grade 12 entry",
   `          <span class="tl-when">Grade 12</span>
          <h3 class="tl-title">Shipping real apps</h3>
          <p class="tl-text">
            Started finishing what I started: a full calculator, a weather app, and other mini
            projects. Shifted my focus to clean, responsive interfaces that work on any screen.
          </p>`,
   `          <span class="tl-when">Grade 12</span>
          <h3 class="tl-title">Shipping real apps</h3>
          <p class="tl-text">
            Deep into the IT Mobile App and Web Development strand at STI Ortigas-Cainta, I started
            finishing what I started: a full calculator, a weather app, and other mini projects,
            with a focus on clean, responsive interfaces that work on any screen.
          </p>`],

  ["journey — today entry",
   `          <span class="tl-when">Today</span>
          <h3 class="tl-title">Junior Developer at the Club</h3>
          <p class="tl-text">
            Now contributing to real projects with the Club Mobile App and Web Development team —
            writing code with others, reviewing, iterating, and learning what it takes to build
            software as a team.
          </p>`,
   `          <span class="tl-when">Today</span>
          <h3 class="tl-title">Junior Developer at DONAT</h3>
          <p class="tl-text">
            Now building with DONAT — the Developers of Next Advanced Technology — writing code with
            other student developers, reviewing, iterating, and learning what it takes to ship
            software as a team.
          </p>`],

  ["attendance project card",
   `        <!-- Attendance -->
        <article class="proj" data-reveal data-cat="systems">
          <div class="demo-bar" aria-hidden="true"><i></i><i></i><i></i><b>attendance-system.js</b></div>
          <div class="demo-body">
            <h3 class="demo-title">Club Attendance</h3>`,
   `        <!-- DONAT Attendance -->
        <article class="proj" data-reveal data-cat="systems">
          <div class="demo-bar" aria-hidden="true"><i></i><i></i><i></i><b>donat-attendance.js</b></div>
          <div class="demo-body">
            <h3 class="demo-title">DONAT Attendance</h3>`],

  ["attendance project description",
   `              A meeting check-in tool for club sessions: tap a member to toggle present or
              absent, and the attendance bar updates in real time.`,
   `              A meeting check-in tool for DONAT sessions: tap a member to toggle present or
              absent, and the attendance bar updates in real time.`],

  ["attendance project links",
   `              <a class="proj-link" href="projects/club-attendance/index.html" target="_blank" rel="noopener">`,
   `              <a class="proj-link" href="projects/donat-attendance/index.html" target="_blank" rel="noopener">`],

  ["attendance project code link",
   `              <a class="proj-link" href="https://github.com/diamondzya/portfolio/tree/main/projects/club-attendance" target="_blank" rel="noopener">`,
   `              <a class="proj-link" href="https://github.com/diamondzya/portfolio/tree/main/projects/donat-attendance" target="_blank" rel="noopener">`],

  ["contact card",
   `          <b>Club projects</b>
          <span>Mobile App and Web Development</span>`,
   `          <b>DONAT</b>
          <span>Developers of Next Advanced Technology</span>`],

  ["hero typed line",
   `  const text = "> junior developer, Club Mobile App and Web Development";`,
   `  const text = "> junior developer at DONAT — Developers of Next Advanced Technology";`],

  ["demo 4 script header",
   `   Demo 4 — Club attendance`,
   `   Demo 4 — DONAT attendance`],

  ["task manager seed task",
   `    { text: "Review the club sprint board", done: false },`,
   `    { text: "Review the DONAT sprint board", done: false },`]
];

let failures = 0;

for (const [label, oldText, newText] of EDITS) {
  const first = html.indexOf(oldText);
  const count = html.split(oldText).length - 1;
  if (count !== 1) {
    console.error("FAIL " + label + " — found " + count + " matches (expected 1)");
    failures += 1;
    continue;
  }
  html = html.replace(oldText, newText);
  console.log("ok   " + label);
}

if (failures) {
  console.error("\n" + failures + " replacement(s) failed — nothing written.");
  process.exit(1);
}

fs.writeFileSync(FILE, html);

// verify the old wording is gone and the new facts are present
const out = fs.readFileSync(FILE, "utf8");
const check = (pattern, expected) => {
  const n = (out.match(pattern) || []).length;
  console.log((n === expected ? "ok   " : "FAIL ") + pattern + " → " + n + " (expect " + expected + ")");
  return n === expected;
};

console.log("");
let ok = true;
ok = check(/Club Mobile App/g, 0) && ok;
ok = check(/DONAT/g, 9) && ok;
ok = check(/STI Ortigas-Cainta/g, 5) && ok;
ok = check(/IT MAWD/g, 3) && ok;
ok = check(/donat-attendance/g, 2) && ok;
ok = check(/club-attendance/g, 0) && ok;

if (!ok) process.exit(1);
console.log("\nall edits applied");
