/* Bug found by testing: the minimax memo key was b.join(""), which drops
   empty cells — so two different boards (X at 0/O at 1 vs X at 0/O at 2)
   produced the same key and the AI replayed a wrong move, losing games.
   Give every cell a character so the key is unique. */
const fs = require("fs");
const FILE = "C:/Users/cyrus/OneDrive/Desktop/Portfolio/index.html";
let html = fs.readFileSync(FILE, "utf8");

const oldText = '    const key = b.join("") + player + depth;';
const newText = '    const key = b.map(function (c) { return c || "-"; }).join("") + player + depth;';

const count = html.split(oldText).length - 1;
if (count !== 1) {
  console.error("expected 1 match, found " + count + " — nothing written");
  process.exit(1);
}

fs.writeFileSync(FILE, html.replace(oldText, newText));
console.log("memo key fixed");
