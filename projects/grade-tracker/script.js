(function () {
  const PASSING = 75;
  const list = document.getElementById("gList");
  const form = document.getElementById("gForm");
  const subjectIn = document.getElementById("gSubject");
  const gradeIn = document.getElementById("gGrade");
  const msg = document.getElementById("gMsg");
  const numEl = document.getElementById("gNum");
  const standingEl = document.getElementById("gStanding");
  const fillEl = document.getElementById("gFill");

  let grades = [
    { subject: "Mathematics", value: 92 },
    { subject: "Science", value: 88 },
    { subject: "Physical Education", value: 74 },
    { subject: "English", value: 85 }
  ];

  function render() {
    list.innerHTML = "";

    if (grades.length === 0) {
      const empty = document.createElement("p");
      empty.className = "g-empty";
      empty.textContent = "No subjects yet. Add your first grade above.";
      list.appendChild(empty);
    }

    grades.forEach(function (g, index) {
      const pass = g.value >= PASSING;
      const row = document.createElement("div");
      row.className = "g-row";

      const name = document.createElement("span");
      name.textContent = g.subject;

      const val = document.createElement("b");
      val.textContent = g.value;

      const status = document.createElement("span");
      status.className = "g-status " + (pass ? "g-pass" : "g-fail");
      status.textContent = pass ? "Passed" : "Failed";

      const del = document.createElement("button");
      del.type = "button";
      del.className = "g-del";
      del.setAttribute("aria-label", "Remove " + g.subject);
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      del.addEventListener("click", function () {
        grades.splice(index, 1);
        render();
      });

      row.append(name, val, status, del);
      list.appendChild(row);
    });

    if (grades.length === 0) {
      numEl.textContent = "—";
      standingEl.textContent = "";
      fillEl.style.width = "0%";
      return;
    }

    const sum = grades.reduce(function (acc, g) { return acc + g.value; }, 0);
    const avg = Math.round((sum / grades.length) * 100) / 100;

    numEl.textContent = avg;
    standingEl.textContent = avg >= PASSING ? "passing" : "below passing";
    standingEl.style.color = avg >= PASSING ? "var(--ok)" : "var(--bad)";
    fillEl.style.width = Math.max(0, Math.min(100, avg)) + "%";
    fillEl.style.background = avg >= PASSING
      ? "linear-gradient(90deg, var(--accent), var(--ok))"
      : "linear-gradient(90deg, var(--accent), var(--bad))";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const subject = subjectIn.value.trim();
    const value = parseFloat(gradeIn.value);

    if (!subject) {
      msg.textContent = "Give the subject a name first.";
      return;
    }
    if (isNaN(value) || value < 0 || value > 100) {
      msg.textContent = "Enter a grade between 0 and 100.";
      return;
    }

    msg.textContent = "";
    grades.push({ subject: subject, value: value });
    subjectIn.value = "";
    gradeIn.value = "";
    subjectIn.focus();
    render();
  });

  render();
})();
