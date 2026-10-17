(function () {
  const demo = document.getElementById("calcDemo");
  const screen = document.getElementById("calcScreen");
  const pad = document.getElementById("calcPad");
  let expr = "";

  function render() {
    screen.textContent = expr === "" ? "0" : expr;
  }

  function evaluate(input) {
    const tokens = input.match(/(\d+(?:\.\d*)?|\.\d+)|[+\-*/%]/g);
    if (!tokens || tokens.length === 0) return null;

    const nums = [];
    const ops = [];
    let expectNum = true;

    for (const t of tokens) {
      const isNum = /^[\d.]/.test(t);
      if (expectNum !== isNum) return null;      // operator where a number belongs, or vice versa
      if (isNum) nums.push(parseFloat(t));
      else ops.push(t);
      expectNum = !expectNum;
    }
    if (ops.length >= nums.length) return null;  // trailing operator

    // pass 1: * / %
    const nums2 = [nums[0]];
    const ops2 = [];
    for (let k = 0; k < ops.length; k++) {
      const op = ops[k];
      const val = nums[k + 1];
      if (op === "*" || op === "/" || op === "%") {
        const a = nums2.pop();
        if ((op === "/" || op === "%") && val === 0) return null;
        nums2.push(op === "*" ? a * val : op === "/" ? a / val : a % val);
      } else {
        ops2.push(op);
        nums2.push(val);
      }
    }

    // pass 2: + -
    let result = nums2[0];
    for (let k = 0; k < ops2.length; k++) {
      result = ops2[k] === "+" ? result + nums2[k + 1] : result - nums2[k + 1];
    }

    if (!isFinite(result)) return null;
    return Math.round(result * 1e10) / 1e10;     // trim floating point noise
  }

  function flash(k) {
    const btn = pad.querySelector('[data-k="' + k + '"]');
    if (!btn) return;
    btn.classList.add("hit");
    setTimeout(function () { btn.classList.remove("hit"); }, 130);
  }

  function press(k) {
    if (k === "AC") {
      expr = "";
    } else if (k === "DEL") {
      expr = expr.slice(0, -1);
    } else if (k === "=") {
      const out = evaluate(expr);
      expr = out === null ? "Error" : String(out);
    } else {
      if (expr === "Error") expr = "";
      expr += k;
    }
    render();
    flash(k);
  }

  pad.addEventListener("click", function (e) {
    const key = e.target.closest("button");
    if (!key) return;
    press(key.dataset.k);
  });

  // keyboard support — focus the calculator, then type
  const NAMED = { Enter: "=", "=": "=", Backspace: "DEL", Escape: "AC", Delete: "AC" };

  demo.addEventListener("keydown", function (e) {
    // a focused button already handles Enter and Space by itself
    if (e.target.closest("button") && (e.key === "Enter" || e.key === " ")) return;

    let k = null;
    if (/^[0-9.]$/.test(e.key)) k = e.key;
    else if (e.key.length === 1 && "+-*/%".indexOf(e.key) !== -1) k = e.key;
    else if (NAMED[e.key]) k = NAMED[e.key];

    if (k === null) return;
    e.preventDefault();
    press(k);
  });

  render();
})();
