(function () {
  const root = document.getElementById("timerDemo");
  const wrap = document.getElementById("timerWrap");
  const timeEl = document.getElementById("timerTime");
  const modeEl = document.getElementById("timerMode");
  const countEl = document.getElementById("timerCount");
  const prog = document.getElementById("timerProg");
  const startBtn = document.getElementById("timerStart");
  const resetBtn = document.getElementById("timerReset");

  const LEN = 2 * Math.PI * 88;               // ring circumference
  prog.style.strokeDasharray = LEN;

  let mode = "focus";
  let total = 0;
  let remaining = 0;
  let endAt = 0;
  let running = false;
  let ticker = null;
  let sessions = 0;

  function minutes(kind, fallback) {
    const raw = parseFloat(root.dataset[kind]);
    return Math.max(1, Math.round((isFinite(raw) && raw > 0 ? raw : fallback) * 60));
  }

  function paint() {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    timeEl.textContent = m + ":" + String(s).padStart(2, "0");
    const frac = total > 0 ? remaining / total : 0;
    prog.style.strokeDashoffset = LEN * (1 - frac);
    startBtn.textContent = running ? "Pause" : (remaining < total && remaining > 0 ? "Resume" : "Start");
  }

  function stopTicker() {
    if (ticker) { clearInterval(ticker); ticker = null; }
  }

  function setMode(next) {
    mode = next;
    total = minutes(next, next === "focus" ? 25 : 5);
    remaining = total;
    wrap.classList.toggle("is-break", next === "break");
    modeEl.textContent = next === "focus" ? "focus session" : "break time";
  }

  function finish() {
    stopTicker();
    running = false;
    if (mode === "focus") {
      sessions += 1;
      countEl.textContent = sessions + (sessions === 1 ? " session completed" : " sessions completed");
      setMode("break");
    } else {
      setMode("focus");
    }
    paint();
  }

  startBtn.addEventListener("click", function () {
    if (running) {
      running = false;
      stopTicker();
      remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      paint();
      return;
    }
    running = true;
    endAt = Date.now() + remaining * 1000;
    stopTicker();
    ticker = setInterval(function () {
      remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      if (remaining <= 0) finish();
      else paint();
    }, 200);
    paint();
  });

  resetBtn.addEventListener("click", function () {
    stopTicker();
    running = false;
    setMode("focus");
    paint();
  });

  setMode("focus");
  paint();
})();
