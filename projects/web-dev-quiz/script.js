(function () {
  const QUESTIONS = [
    {
      q: "What does HTML stand for?",
      answers: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language"],
      correct: 0
    },
    {
      q: "Which CSS property changes the color of text?",
      answers: ["font-style", "color", "text-align"],
      correct: 1
    },
    {
      q: "Which keyword declares a constant in JavaScript?",
      answers: ["let", "var", "const"],
      correct: 2
    },
    {
      q: "Which array method adds an item to the end?",
      answers: ["push()", "pop()", "shift()"],
      correct: 0
    },
    {
      q: "What does Git help you do?",
      answers: ["Style your web pages", "Track changes in your code", "Speed up your Wi-Fi"],
      correct: 1
    }
  ];

  const stepEl = document.getElementById("quizStep");
  const fillEl = document.getElementById("quizFill");
  const qEl = document.getElementById("quizQ");
  const answersEl = document.getElementById("quizAnswers");
  const noteEl = document.getElementById("quizNote");

  let index = 0;
  let score = 0;

  function renderQuestion() {
    const item = QUESTIONS[index];
    stepEl.textContent = "Question " + (index + 1) + " of " + QUESTIONS.length;
    fillEl.style.width = Math.round(((index + 1) / QUESTIONS.length) * 100) + "%";
    qEl.textContent = item.q;
    noteEl.textContent = "";
    answersEl.innerHTML = "";

    item.answers.forEach(function (answer, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-ans";
      btn.textContent = answer;
      btn.addEventListener("click", function () { pick(i, btn); });
      answersEl.appendChild(btn);
    });
  }

  function pick(picked, btn) {
    const item = QUESTIONS[index];
    const buttons = answersEl.querySelectorAll(".quiz-ans");
    buttons.forEach(function (b) { b.disabled = true; });

    if (picked === item.correct) {
      score += 1;
      btn.classList.add("right");
      noteEl.textContent = "Correct!";
      noteEl.style.color = "var(--ok)";
    } else {
      btn.classList.add("wrong");
      buttons[item.correct].classList.add("right");
      noteEl.textContent = "Not quite — the answer is " + item.answers[item.correct] + ".";
      noteEl.style.color = "var(--bad)";
    }

    setTimeout(function () {
      index += 1;
      if (index < QUESTIONS.length) renderQuestion();
      else results();
    }, 1100);
  }

  function results() {
    fillEl.style.width = "100%";
    stepEl.textContent = "Done";
    qEl.textContent = "";
    noteEl.textContent = "";
    answersEl.innerHTML = "";

    const msg = score === QUESTIONS.length ? "Perfect score!"
      : score >= 3 ? "Nice work — solid fundamentals."
      : "Keep practicing — you'll get there.";

    const box = document.createElement("div");
    box.className = "quiz-score";
    box.innerHTML = "<b>" + score + "/" + QUESTIONS.length + "</b><span>" + msg + "</span>";
    answersEl.appendChild(box);

    const again = document.createElement("button");
    again.type = "button";
    again.className = "quiz-again";
    again.textContent = "Play again";
    again.addEventListener("click", function () {
      index = 0;
      score = 0;
      renderQuestion();
    });
    answersEl.appendChild(again);
  }

  renderQuestion();
})();
