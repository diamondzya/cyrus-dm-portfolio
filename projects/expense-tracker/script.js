(function () {
  const KEY = "cdm-expenses";
  const CATS = ["food", "transport", "school", "fun"];
  const SEED = [
    { name: "Lunch at the canteen", amount: 85, cat: "food" },
    { name: "Jeepney fare", amount: 26, cat: "transport" },
    { name: "Notebook and pens", amount: 120, cat: "school" },
    { name: "Milk tea with friends", amount: 65, cat: "fun" }
  ];

  const form = document.getElementById("exForm");
  const nameIn = document.getElementById("exName");
  const amountIn = document.getElementById("exAmount");
  const catIn = document.getElementById("exCat");
  const totalEl = document.getElementById("exTotal");
  const list = document.getElementById("exList");
  const bars = document.getElementById("exBars");

  let expenses = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return SEED.slice();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(function (e) {
            return e && typeof e.name === "string" &&
              typeof e.amount === "number" && isFinite(e.amount) &&
              CATS.indexOf(e.cat) !== -1;
          })
          .map(function (e) {
            return { name: e.name, amount: e.amount, cat: e.cat };
          });
      }
    } catch (e) {}
    return SEED.slice();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(expenses)); } catch (e) {}
  }

  function peso(n) {
    const v = Math.round(n * 100) / 100;
    return "₱" + v.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  function render() {
    list.innerHTML = "";

    if (expenses.length === 0) {
      const empty = document.createElement("li");
      empty.className = "ex-empty";
      empty.textContent = "Nothing recorded yet — add your first expense above.";
      list.appendChild(empty);
    }

    expenses.forEach(function (ex, index) {
      const item = document.createElement("li");
      item.className = "ex-item";

      const dot = document.createElement("span");
      dot.className = "ex-dot cat-" + ex.cat;

      const name = document.createElement("span");
      name.className = "ex-name-cell";
      name.textContent = ex.name;

      const amt = document.createElement("span");
      amt.className = "ex-amt";
      amt.textContent = peso(ex.amount);

      const del = document.createElement("button");
      del.type = "button";
      del.className = "ex-del";
      del.setAttribute("aria-label", "Delete expense: " + ex.name);
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      del.addEventListener("click", function () {
        expenses.splice(index, 1);
        save();
        render();
      });

      item.append(dot, name, amt, del);
      list.appendChild(item);
    });

    const total = expenses.reduce(function (acc, e) { return acc + e.amount; }, 0);
    totalEl.textContent = peso(total);

    bars.innerHTML = "";
    if (total > 0) {
      CATS.forEach(function (cat) {
        const sum = expenses
          .filter(function (e) { return e.cat === cat; })
          .reduce(function (acc, e) { return acc + e.amount; }, 0);
        if (sum === 0) return;

        const row = document.createElement("div");
        row.className = "ex-bar-row";

        const name = document.createElement("span");
        name.textContent = cat[0].toUpperCase() + cat.slice(1);

        const track = document.createElement("div");
        track.className = "ex-bar";

        const bar = document.createElement("i");
        bar.className = "cat-" + cat;
        bar.style.width = Math.round((sum / total) * 100) + "%";
        track.appendChild(bar);

        row.append(name, track);
        bars.appendChild(row);
      });
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = nameIn.value.trim();
    const amount = parseFloat(amountIn.value);
    if (!name || !isFinite(amount) || amount <= 0) return;

    expenses.push({ name: name, amount: Math.round(amount * 100) / 100, cat: catIn.value });
    nameIn.value = "";
    amountIn.value = "";
    nameIn.focus();
    save();
    render();
  });

  render();
})();
