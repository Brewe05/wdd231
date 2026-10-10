// scripts/discover.js
import { itemsOfInterest } from "../data/discover.mjs";

/* ---------- 1. Render the 8 cards ---------- */
const container = document.querySelector("#discover-grid");

function buildCard(item, index) {
  const card = document.createElement("article");
  card.className = `discover-card card-${index + 1}`;

  card.innerHTML = `
    <h2>${item.name}</h2>
    <figure>
      <img src="${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
    </figure>
    <address>${item.address}</address>
    <p>${item.description}</p>
    <button type="button" class="learn-more">Learn More</button>
  `;

  card.querySelector(".learn-more").addEventListener("click", () => {
    alert(`${item.name}\n\n${item.address}\n\n${item.description}`);
  });

  return card;
}

itemsOfInterest.forEach((item, i) => container.appendChild(buildCard(item, i)));

/* ---------- 2. localStorage visit tracking ---------- */
const visitMsg = document.querySelector("#visit-message");
const now = Date.now();
const lastVisit = localStorage.getItem("discoverLastVisit");

let message = "";

if (!lastVisit) {
  message = "Welcome! Let us know if you have any questions.";
} else {
  const diffMs = now - Number(lastVisit);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 1) {
    message = "Back so soon! Awesome!";
  } else if (diffDays === 1) {
    message = "You last visited 1 day ago.";
  } else {
    message = `You last visited ${diffDays} days ago.`;
  }
}

visitMsg.textContent = message;
localStorage.setItem("discoverLastVisit", now);