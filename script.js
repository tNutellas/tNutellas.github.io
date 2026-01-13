// script.js - sistema simples de confirmação de presença
const STORAGE_KEY = "rsvp_guests_v1";

function loadGuests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveGuests(guests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

function renderGuests() {
  const list = document.getElementById("guest-list");
  const count = document.getElementById("guest-count");
  const guests = loadGuests();
  list.innerHTML = "";
  guests.forEach((g, idx) => {
    const li = document.createElement("li");
    li.className = "guest-item";
    li.innerHTML = `<strong>${escapeHtml(g.name)}</strong> — ${
      g.attending === "yes" ? "Vai" : "Não vai"
    }`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.className = "btn-remove";
    removeBtn.addEventListener("click", () => {
      guests.splice(idx, 1);
      saveGuests(guests);
      renderGuests();
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
  count.textContent = guests.length;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[s];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const attending = document.getElementById("attending").value;
    if (!name) return;
    const guests = loadGuests();
    guests.push({ name, attending, addedAt: Date.now() });
    saveGuests(guests);
    form.reset();
    renderGuests();
  });

  renderGuests();
});
