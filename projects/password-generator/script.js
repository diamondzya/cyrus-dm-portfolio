(function () {
  const SETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    nums: "0123456789",
    syms: "!@#$%^&*()-_=+"
  };

  const out = document.getElementById("pwText");
  const copyBtn = document.getElementById("pwCopy");
  const lenInput = document.getElementById("pwLen");
  const lenVal = document.getElementById("pwLenVal");
  const genBtn = document.getElementById("pwGen");
  const fill = document.getElementById("pwFill");
  const label = document.getElementById("pwLabel");
  const boxes = {
    upper: document.getElementById("pwUpper"),
    lower: document.getElementById("pwLower"),
    nums: document.getElementById("pwNums"),
    syms: document.getElementById("pwSyms")
  };

  const RANGE = 4294967296;                   // 2^32
  const buf = new Uint32Array(1);
  const hasCrypto = !!(window.crypto && window.crypto.getRandomValues);

  // crypto-backed random integer, unbiased (rejection sampling)
  function randInt(max) {
    if (!hasCrypto) return Math.floor(Math.random() * max);
    const cutoff = RANGE - (RANGE % max);
    let v;
    do { window.crypto.getRandomValues(buf); v = buf[0]; } while (v >= cutoff);
    return v % max;
  }

  let current = "";

  function strength(length, poolSize) {
    const bits = length * Math.log2(poolSize);
    let name, color;
    if (bits < 45) { name = "Weak"; color = "var(--bad)"; }
    else if (bits < 65) { name = "Fair"; color = "var(--accent-2)"; }
    else if (bits < 90) { name = "Strong"; color = "var(--ok)"; }
    else { name = "Very strong"; color = "var(--ok)"; }

    label.textContent = name;
    label.style.color = color;
    fill.style.width = Math.min(100, Math.round((bits / 128) * 100)) + "%";
    fill.style.background = color;
  }

  function generate() {
    const active = Object.keys(boxes).filter(function (k) { return boxes[k].checked; });
    const length = parseInt(lenInput.value, 10);

    if (active.length === 0) {
      current = "";
      out.textContent = "Select at least one character set.";
      fill.style.width = "0%";
      label.textContent = "—";
      label.style.color = "var(--ink-2)";
      return;
    }

    const pool = active.map(function (k) { return SETS[k]; }).join("");
    const chars = [];

    // one character from every chosen set, so each one is guaranteed
    active.forEach(function (k) {
      const set = SETS[k];
      chars.push(set[randInt(set.length)]);
    });
    while (chars.length < length) chars.push(pool[randInt(pool.length)]);

    // shuffle, so the guaranteed characters aren't always up front
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      const tmp = chars[i];
      chars[i] = chars[j];
      chars[j] = tmp;
    }

    current = chars.join("");
    out.textContent = current;
    strength(length, pool.length);
  }

  function copy() {
    if (!current) return;

    function selectText() {
      try {
        const range = document.createRange();
        range.selectNodeContents(out);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (e) {}
    }

    function done(ok) {
      // if the clipboard is blocked, select the password so Ctrl+C still works
      copyBtn.textContent = ok ? "Copied!" : "Press Ctrl+C";
      if (!ok) selectText();
      setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800);
    }

    function fallback() {
      try {
        const ta = document.createElement("textarea");
        ta.value = current;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        done(ok);
      } catch (e) {
        done(false);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(current).then(function () { done(true); }, fallback);
    } else {
      fallback();
    }
  }

  lenInput.addEventListener("input", function () {
    lenVal.textContent = lenInput.value;
  });
  genBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", copy);

  generate();
})();
