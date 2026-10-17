(function () {
  const members = [
    { name: "Joshua Dela Cruz", present: true },
    { name: "Andrea Santos", present: true },
    { name: "Miguel Reyes", present: false },
    { name: "Bianca Torres", present: true },
    { name: "Paolo Aquino", present: false },
    { name: "Katlyn Mendoza", present: true }
  ];

  const list = document.getElementById("aList");
  const countEl = document.getElementById("aCount");
  const fillEl = document.getElementById("aFill");

  function initials(name) {
    return name.split(" ").map(function (part) { return part[0]; }).slice(0, 2).join("");
  }

  function render() {
    list.innerHTML = "";

    members.forEach(function (m, index) {
      const item = document.createElement("li");
      item.className = "a-item " + (m.present ? "in" : "out");

      const av = document.createElement("span");
      av.className = "a-av";
      av.textContent = initials(m.name);

      const name = document.createElement("span");
      name.className = "a-name";
      name.textContent = m.name;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "a-toggle";
      btn.textContent = m.present ? "Present" : "Absent";
      btn.setAttribute("aria-pressed", m.present ? "true" : "false");
      btn.setAttribute("aria-label", m.name + ": " + (m.present ? "present" : "absent") + ". Tap to toggle.");
      btn.addEventListener("click", function () {
        members[index].present = !members[index].present;
        render();
      });

      item.append(av, name, btn);
      list.appendChild(item);
    });

    const present = members.filter(function (m) { return m.present; }).length;
    const pct = members.length ? Math.round((present / members.length) * 100) : 0;

    countEl.innerHTML = present + "/" + members.length + " <em>present</em>";
    fillEl.style.width = pct + "%";
    fillEl.style.background = pct >= 75
      ? "linear-gradient(90deg, var(--accent), var(--ok))"
      : pct >= 40
        ? "linear-gradient(90deg, var(--accent), var(--accent-2))"
        : "linear-gradient(90deg, var(--accent), var(--bad))";
  }

  document.getElementById("aAll").addEventListener("click", function () {
    members.forEach(function (m) { m.present = true; });
    render();
  });

  render();
})();
