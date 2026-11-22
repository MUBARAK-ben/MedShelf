const filterPills = document.querySelectorAll(".filter-pill");
const searchInput = document.getElementById("careSearch");
const guideCards = document.querySelectorAll(".guide-card");
const emptyMsg = document.getElementById("emptyMsg");
const shelfButtons = document.querySelectorAll(".shelf-btn");

const shelfCountEl = document.getElementById("shelfCount");
const shelfListEl = document.getElementById("shelfList");
const clearShelfBtn = document.getElementById("clearShelfBtn");

let activeTopic = "all";

function syncShelfPanel() {
  const savedCards = Array.from(guideCards).filter((card) => card.classList.contains("saved"));
  if (shelfCountEl) {
    shelfCountEl.textContent = String(savedCards.length);
  }

  shelfListEl.innerHTML = "";

  if (savedCards.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Your shelf is currently empty. Click \"Add to Shelf\" on any card above.";
    shelfListEl.appendChild(li);
    return;
  }

  savedCards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent || "Care Guide";
    const topic = card.querySelector(".topic-tag")?.textContent || "Guide";
    const li = document.createElement("li");
    li.textContent = `${title} (${topic})`;
    shelfListEl.appendChild(li);
  });
}

function filterGuides() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  guideCards.forEach((card) => {
    const matchesTopic = activeTopic === "all" || card.dataset.topic === activeTopic;
    const text = `${card.textContent} ${card.dataset.keywords || ""}`.toLowerCase();
    const matchesQuery = !query || text.includes(query);

    const show = matchesTopic && matchesQuery;
    card.classList.toggle("hidden", !show);
    if (show) visible += 1;
  });

  emptyMsg.hidden = visible > 0;
}

filterPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    filterPills.forEach((btn) => btn.classList.remove("active"));
    pill.classList.add("active");
    activeTopic = pill.dataset.topic;
    filterGuides();
  });
});

searchInput.addEventListener("input", filterGuides);

shelfButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".guide-card");
    const isSaved = card.classList.toggle("saved");
    btn.textContent = isSaved ? "On Shelf ✓" : "Add to Shelf";
    syncShelfPanel();
  });
});

clearShelfBtn.addEventListener("click", () => {
  guideCards.forEach((card) => {
    card.classList.remove("saved");
    const btn = card.querySelector(".shelf-btn");
    if (btn) btn.textContent = "Add to Shelf";
  });
  syncShelfPanel();
});

syncShelfPanel();