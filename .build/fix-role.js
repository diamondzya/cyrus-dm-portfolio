/* One-off: the Role fact row repeated the club name, which the Club row
   already carries. Keep the row short. */
const fs = require("fs");
const FILE = "C:/Users/cyrus/OneDrive/Desktop/Portfolio/index.html";
let html = fs.readFileSync(FILE, "utf8");

const oldText = "<dt>Role</dt>\n            <dd>Junior Developer at DONAT</dd>";
const newText = "<dt>Role</dt>\n            <dd>Junior Developer</dd>";
const count = html.split(oldText).length - 1;

if (count !== 1) {
  console.error("expected 1 match, found " + count + " — nothing written");
  process.exit(1);
}

fs.writeFileSync(FILE, html.replace(oldText, newText));
console.log("role row simplified");
