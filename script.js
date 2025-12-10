const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");
const tableContainer = document.getElementById("tableContainer");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let habits = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

async function loadHabits() {
  const res = await fetch("data.json");
  habits = await res.json();
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDateKey(habitId, year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${habitId}_${year}-${mm}-${dd}`;
}

function renderTable(year, month) {
  const totalDays = daysInMonth(year, month);
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });
  monthLabel.textContent = monthName;
  yearLabel.textContent = year;

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const dateHeader = document.createElement("th");
  dateHeader.textContent = "Date";
  headerRow.appendChild(dateHeader);

  habits.forEach((habit) => {
    const th = document.createElement("th");
    const wrap = document.createElement("div");
    wrap.className = "habit-header";
    const dot = document.createElement("span");
    dot.className = "habit-dot";
    dot.style.background = habit.color || "#4a8dff";
    const name = document.createElement("span");
    name.textContent = habit.name;
    wrap.append(dot, name);
    th.appendChild(wrap);
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month, day);
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.className = "date-cell";
    const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
    dateCell.innerHTML = `<span class="day">${day}</span><span class="weekday">${weekday}</span>`;
    row.appendChild(dateCell);

    habits.forEach((habit) => {
      const td = document.createElement("td");
      const check = document.createElement("div");
      check.className = "checkbox";

      const storageKey = formatDateKey(habit.id, year, month, day);
      const saved = localStorage.getItem(storageKey);
      if (saved === "true") {
        check.classList.add("checked");
      }

      check.addEventListener("click", () => {
        const isChecked = check.classList.toggle("checked");
        localStorage.setItem(storageKey, String(isChecked));
      });

      td.appendChild(check);
      row.appendChild(td);
    });

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

async function init() {
  await loadHabits();
  renderTable(currentYear, currentMonth);
}

prevBtn.addEventListener("click", () => {
  currentMonth -= 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  }
  renderTable(currentYear, currentMonth);
});

nextBtn.addEventListener("click", () => {
  currentMonth += 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderTable(currentYear, currentMonth);
});

init();

