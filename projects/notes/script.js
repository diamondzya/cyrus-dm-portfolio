(function () {
  const form = document.getElementById("notesForm");
  if (!form) return;

  const KEY = "cdm-notes";
  const input = document.getElementById("notesInput");
  const search = document.getElementById("notesSearch");
  const list = document.getElementById("notesList");
  const countEl = document.getElementById("notesCount");

  const DAY = 86400000;
  const SEED = [
    { id: 1, text: "Review the DONAT sprint board before Friday", at: Date.now() - 2 * DAY },
    { id: 2, text: "Practice Java collections for the quiz", at: Date.now() - DAY },
    { id: 3, text: "Push the portfolio updates to GitHub", at: Date.now() - 3600000 }
  ];

  let notes = load();
  let nextId = notes.reduce(function (max, note) { return Math.max(max, note.id); }, 0) + 1;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return SEED.slice();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(function (n) { return n && typeof n.text === "string"; })
          .map(function (n) {
            return { id: Number(n.id) || 0, text: n.text, at: Number(n.at) || Date.now() };
          });
      }
    } catch (e) {}
    return SEED.slice();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {}
  }

  function when(at) {
    const mins = Math.floor((Date.now() - at) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    return days === 1 ? "yesterday" : days + "d ago";
  }

  function render() {
    const term = search.value.trim().toLowerCase();
    const shown = term
      ? notes.filter(function (n) { return n.text.toLowerCase().indexOf(term) !== -1; })
      : notes;

    list.innerHTML = "";

    if (!shown.length) {
      const empty = document.createElement("li");
      empty.className = "notes-empty";
      empty.textContent = notes.length === 0
        ? "No notes yet — write your first one above."
        : "No notes match that search.";
      list.appendChild(empty);
    }

    shown.slice().reverse().forEach(function (note) {
      const item = document.createElement("li");
      item.className = "note";

      const text = document.createElement("span");
      text.className = "note-text";
      text.textContent = note.text;

      const time = document.createElement("span");
      time.className = "note-time";
      time.textContent = when(note.at);
      text.appendChild(time);

      const del = document.createElement("button");
      del.type = "button";
      del.className = "note-del";
      del.setAttribute("aria-label", "Delete note: " + note.text);
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      del.addEventListener("click", function () {
        notes = notes.filter(function (n) { return n.id !== note.id; });
        save();
        render();
      });

      item.append(text, del);
      list.appendChild(item);
    });

    countEl.textContent = term
      ? shown.length + " of " + notes.length + " notes"
      : (notes.length === 1 ? "1 note" : notes.length + " notes");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    notes.push({ id: nextId++, text: text, at: Date.now() });
    input.value = "";
    save();
    render();
    input.focus();
  });

  search.addEventListener("input", render);

  render();
})();
