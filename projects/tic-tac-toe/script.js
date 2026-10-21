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
    const key = b.map(function (c) { return c || "-"; }).join("") + player + depth;
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
