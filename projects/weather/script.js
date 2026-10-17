(function () {
  const cities = {
    manila:   { emoji: "☀️", temp: "31°C", weather: "Sunny",         humidity: "74%", wind: "12 km/h", feels: "33°C", visibility: "10 km", label: "Manila, PH" },
    tokyo:    { emoji: "☁️", temp: "21°C", weather: "Cloudy",        humidity: "61%", wind: "8 km/h",  feels: "22°C", visibility: "8 km",  label: "Tokyo, JP" },
    london:   { emoji: "🌧️", temp: "14°C", weather: "Rainy",         humidity: "90%", wind: "18 km/h", feels: "13°C", visibility: "5 km",  label: "London, UK" },
    cebu:     { emoji: "🌤️", temp: "30°C", weather: "Mostly sunny",  humidity: "70%", wind: "9 km/h",  feels: "32°C", visibility: "10 km", label: "Cebu, PH" },
    paris:    { emoji: "🌦️", temp: "16°C", weather: "Light showers", humidity: "78%", wind: "10 km/h", feels: "15°C", visibility: "7 km",  label: "Paris, FR" },
    "new york": { emoji: "⛅", temp: "18°C", weather: "Partly cloudy", humidity: "55%", wind: "14 km/h", feels: "17°C", visibility: "12 km", label: "New York, US" }
  };

  const input = document.getElementById("wCity");
  const msg = document.getElementById("wMsg");

  function show(city) {
    const data = cities[city];
    if (!data) {
      msg.textContent = "City not found — try Manila, Tokyo, London, Cebu, Paris, or New York.";
      return;
    }
    msg.textContent = "";
    document.getElementById("wEmoji").textContent = data.emoji;
    document.getElementById("wTemp").textContent = data.temp;
    document.getElementById("wCond").textContent = data.weather;
    document.getElementById("wLoc").textContent = data.label;
    document.getElementById("wHum").textContent = data.humidity;
    document.getElementById("wWind").textContent = data.wind;
    document.getElementById("wFeels").textContent = data.feels;
    document.getElementById("wVis").textContent = data.visibility;
  }

  function search() {
    show(input.value.trim().toLowerCase());
  }

  document.getElementById("wGo").addEventListener("click", search);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); search(); }
  });

  document.querySelectorAll(".w-quick button").forEach(function (chip) {
    chip.addEventListener("click", function () {
      input.value = chip.dataset.city;
      search();
    });
  });
})();
