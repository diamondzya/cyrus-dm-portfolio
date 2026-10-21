(function () {
  const demo = document.getElementById("snakeDemo");
  if (!demo) return;

  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("snakeScore");
  const bestEl = document.getElementById("snakeBest");
  const overEl = document.getElementById("snakeOver");
  const overTitle = document.getElementById("snakeOverTitle");
  const overText = document.getElementById("snakeOverText");
  const startBtn = document.getElementById("snakeStart");

  const CELL = 20;
  const COLS = canvas.width / CELL;
  const ROWS = canvas.height / CELL;
  const SPEED = 120;

  const SNAKE_COLOR = "#2AA9E0";
  const HEAD_COLOR = "#1B87B8";
  const FOOD_COLOR = "#F59E0B";

  let snake, dir, queued, food, score, ticker, running;

  let best = parseInt(localStorage.getItem("cdm-snake-best") || "0", 10) || 0;
  bestEl.textContent = best;

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
    } while (snake.some(function (part) { return part.x === food.x && part.y === food.y; }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = FOOD_COLOR;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach(function (part, i) {
      ctx.fillStyle = i === 0 ? HEAD_COLOR : SNAKE_COLOR;
      const x = part.x * CELL + 2;
      const y = part.y * CELL + 2;
      const size = CELL - 4;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 5);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, size, size);
      }
    });
  }

  function reset() {
    snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
    dir = { x: 1, y: 0 };
    queued = [];
    score = 0;
    scoreEl.textContent = "0";
    placeFood();
    draw();
  }

  function stop() {
    if (ticker) { clearInterval(ticker); ticker = null; }
    running = false;
  }

  function die() {
    stop();
    overTitle.textContent = "Game over";
    overText.textContent = "You scored " + score + ".";
    startBtn.textContent = "Play again";
    overEl.classList.add("show");
  }

  function step() {
    if (queued.length) dir = queued.shift();

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) return die();
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) return die();
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = score;
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        try { localStorage.setItem("cdm-snake-best", String(best)); } catch (e) {}
      }
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function start() {
    stop();
    reset();
    overEl.classList.remove("show");
    startBtn.textContent = "Start game";
    ticker = setInterval(step, SPEED);
    running = true;
    demo.focus();
  }

  function turn(x, y) {
    const last = queued.length ? queued[queued.length - 1] : dir;
    if (last.x === -x && last.y === -y) return;
    if (last.x === x && last.y === y) return;
    if (queued.length < 2) queued.push({ x: x, y: y });
  }

  const KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
  };

  demo.addEventListener("keydown", function (e) {
    const move = KEYS[e.key];
    if (!move) return;
    e.preventDefault();
    if (running) turn(move[0], move[1]);
  });

  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  demo.querySelectorAll(".snake-pad button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (running) turn(DIRS[btn.dataset.dir][0], DIRS[btn.dataset.dir][1]);
      demo.focus();
    });
  });

  startBtn.addEventListener("click", start);

  reset();
})();
