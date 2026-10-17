(function () {
  const root = document.getElementById("typeDemo");
  const target = document.getElementById("typeTarget");
  const input = document.getElementById("typeInput");
  const wpmEl = document.getElementById("typeWpm");
  const accEl = document.getElementById("typeAcc");
  const timeEl = document.getElementById("typeTime");
  const resultEl = document.getElementById("typeResult");

  const TEXT = "The best way to learn to code is to build things, break them, and build them again.";

  input.setAttribute("aria-label", "Type this sentence: " + TEXT);

  const spans = [];
  TEXT.split("").forEach(function (ch) {
    const s = document.createElement("span");
    s.textContent = ch;
    target.appendChild(s);
    spans.push(s);
  });

  let started = false;
  let finished = false;
  let startAt = 0;
  let ticker = null;

  function limit() {
    return Math.max(3, Math.round(parseFloat(root.dataset.time) || 30));
  }

  function elapsedMs() {
    return started ? Date.now() - startAt : 0;
  }

  // words per minute — floor the elapsed time so a very short run can't
  // divide by ~zero, and cap the display at a humanly possible ceiling
  function wpmOf(correct, ms, live) {
    if (live && ms < 500) return 0;
    return Math.min(300, Math.round((correct / 5) / (Math.max(1000, ms) / 60000)));
  }

  function stats() {
    const value = input.value;
    let correct = 0;

    spans.forEach(function (s, i) {
      s.classList.remove("ok", "bad", "cur");
      if (i < value.length) {
        if (value[i] === TEXT[i]) { s.classList.add("ok"); correct += 1; }
        else s.classList.add("bad");
      }
    });

    if (!finished && value.length < TEXT.length) spans[value.length].classList.add("cur");
    return { correct: correct, typed: value.length };
  }

  function paint() {
    const st = stats();
    const ms = elapsedMs();
    const acc = st.typed ? Math.round((st.correct / st.typed) * 100) : 100;
    const wpm = wpmOf(st.correct, ms, true);
    wpmEl.textContent = wpm + " wpm";
    accEl.textContent = acc + "%";
    timeEl.textContent = Math.max(0, Math.ceil((limit() * 1000 - ms) / 1000)) + "s";
    return st;
  }

  function finish(reason) {
    if (finished) return;
    finished = true;
    if (ticker) { clearInterval(ticker); ticker = null; }

    const st = paint();
    const acc = st.typed ? Math.round((st.correct / st.typed) * 100) : 0;
    const wpm = wpmOf(st.correct, elapsedMs(), false);

    input.disabled = true;
    resultEl.innerHTML = (reason === "done" ? "Nice — you finished the sentence. " : "") +
      "You type <b>" + wpm + " wpm</b> with <b>" + acc + "%</b> accuracy.";

    const again = document.createElement("button");
    again.type = "button";
    again.className = "type-again";
    again.textContent = "Try again";
    again.addEventListener("click", function () { reset(true); });
    resultEl.appendChild(again);
    resultEl.classList.add("show");
  }

  function reset(focus) {
    if (ticker) { clearInterval(ticker); ticker = null; }
    started = false;
    finished = false;
    startAt = 0;
    input.disabled = false;
    input.value = "";
    resultEl.classList.remove("show");
    resultEl.innerHTML = "";
    wpmEl.textContent = "0 wpm";
    accEl.textContent = "100%";
    timeEl.textContent = limit() + "s";
    spans.forEach(function (s) { s.classList.remove("ok", "bad", "cur"); });
    spans[0].classList.add("cur");
    if (focus) input.focus();
  }

  input.addEventListener("input", function () {
    if (finished) return;

    if (!started) {
      started = true;
      startAt = Date.now();
      ticker = setInterval(function () {
        paint();
        if (elapsedMs() >= limit() * 1000) finish("time");
      }, 100);
    }

    const st = paint();
    if (st.typed >= TEXT.length) finish("done");
  });

  input.addEventListener("paste", function (e) { e.preventDefault(); });

  reset(false);
})();
