(function () {
  const KEY = "cdm-tasks";
  const SEED = [
    { text: "Review the DONAT sprint board", done: false },
    { text: "Practice JavaScript array methods", done: false },
    { text: "Push portfolio updates to GitHub", done: true }
  ];

  const form = document.getElementById("taskForm");
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");
  const countEl = document.getElementById("taskCount");
  const clearBtn = document.getElementById("taskClear");
  const filterBtns = document.querySelectorAll(".task-filters button");

  let tasks = load();
  let filter = "all";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return SEED.slice();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(function (t) { return t && typeof t.text === "string"; })
          .map(function (t) { return { text: t.text, done: !!t.done }; });
      }
    } catch (e) {}
    return SEED.slice();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) {}
  }

  function visible() {
    if (filter === "active") return tasks.filter(function (t) { return !t.done; });
    if (filter === "done") return tasks.filter(function (t) { return t.done; });
    return tasks;
  }

  function render() {
    list.innerHTML = "";
    const items = visible();

    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.className = "task-empty";
      empty.textContent = tasks.length === 0
        ? "No tasks yet — add one above."
        : "Nothing here for this filter.";
      list.appendChild(empty);
    }

    items.forEach(function (task) {
      const index = tasks.indexOf(task);
      const item = document.createElement("li");
      item.className = "task-item" + (task.done ? " done" : "");

      const check = document.createElement("button");
      check.type = "button";
      check.className = "task-check";
      check.setAttribute("aria-pressed", task.done ? "true" : "false");
      check.setAttribute("aria-label", (task.done ? "Mark as not done: " : "Mark as done: ") + task.text);
      check.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
      check.addEventListener("click", function () {
        tasks[index].done = !tasks[index].done;
        save();
        render();
      });

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "task-del";
      del.setAttribute("aria-label", "Delete task: " + task.text);
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      del.addEventListener("click", function () {
        tasks.splice(index, 1);
        save();
        render();
      });

      item.append(check, text, del);
      list.appendChild(item);
    });

    const left = tasks.filter(function (t) { return !t.done; }).length;
    countEl.textContent = left === 1 ? "1 task left" : left + " tasks left";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text: text, done: false });
    input.value = "";
    save();
    render();
  });

  clearBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (t) { return !t.done; });
    save();
    render();
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filter = btn.dataset.f;
      filterBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      render();
    });
  });

  render();
})();
