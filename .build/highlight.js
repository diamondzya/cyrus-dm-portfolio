/* Tiny build-time syntax highlighter for the code project cards.
   Escapes HTML first, then wraps tokens in <span class="tok-*">.
   Deliberately simple — enough for the four showcase files. */

const KEYWORDS = {
  java: ["abstract","assert","boolean","break","byte","case","catch","char","class","const","continue","default","do","double","else","enum","extends","final","finally","float","for","if","implements","import","instanceof","int","interface","long","new","package","private","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","try","void","volatile","while","var","true","false","null"],
  cpp: ["alignas","auto","bool","break","case","catch","char","class","const","constexpr","continue","default","delete","do","double","else","enum","explicit","extern","false","float","for","friend","if","inline","int","long","namespace","new","noexcept","nullptr","operator","private","protected","public","return","short","signed","sizeof","static","struct","switch","template","this","throw","true","try","typedef","typename","union","unsigned","using","virtual","void","volatile","while","std","string","vector","ifstream","ofstream","istringstream","max","transform","tolower"],
  sql: ["add","all","alter","and","as","asc","auto_increment","bigint","by","cascade","case","char","check","column","constraint","create","current_timestamp","datetime","decimal","default","delete","desc","distinct","drop","else","engine","exists","foreign","from","group","having","in","index","inner","insert","int","into","is","join","key","left","like","limit","not","null","on","or","order","outer","primary","references","right","round","select","set","smallint","table","then","tinyint","union","unique","unsigned","update","values","varchar","when","where","avg","count","max","min","sum","now","innodb","true","false"],
  pawn: ["bool","break","case","const","continue","default","defined","else","enum","false","for","forward","if","native","new","operator","public","return","sizeof","static","stock","switch","tagof","true","while","char","assert","goto","exit","sleep","state"]
};

const escapeHtml = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function highlight(code, lang) {
  const escaped = escapeHtml(code.replace(/\t/g, "    "));
  const words = KEYWORDS[lang] || [];

  const parts = [
    ["c", lang === "sql" ? "--[^\\n]*" : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/"],
    ["p", "#\\s*\\w+"],
    ["s", "\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'"],
    ["n", "\\b\\d+(?:\\.\\d+)?\\b"],
    ["k", words.length ? "\\b(?:" + words.map(escapeRe).join("|") + ")\\b" : "(?!)"],
    ["t", "\\b[A-Z][A-Za-z0-9_]*\\b"]
  ];

  const re = new RegExp(parts.map(p => "(" + p[1] + ")").join("|"), lang === "sql" ? "gi" : "g");

  let out = "";
  let last = 0;
  let m;

  while ((m = re.exec(escaped)) !== null) {
    out += escaped.slice(last, m.index);

    let cls = null;
    for (let i = 1; i < m.length; i++) {
      if (m[i] !== undefined) { cls = parts[i - 1][0]; break; }
    }
    out += cls ? '<span class="tok-' + cls + '">' + m[0] + "</span>" : m[0];

    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex += 1;
  }

  return out + escaped.slice(last);
}

module.exports = { highlight };
