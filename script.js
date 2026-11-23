const scene = document.querySelector(".scene");
const openButton = document.querySelector("#openInvitation");
const invitation = document.querySelector("#invitation");
const yesButton = document.querySelector("#yesButton");
const maybeButton = document.querySelector("#maybeButton");
const confirmation = document.querySelector("#confirmation");
const closeConfirmation = document.querySelector("#closeConfirmation");
const confettiLayer = document.querySelector("#confettiLayer");
const maybeWrap = document.querySelector("#maybeWrap");
const meetingDate = document.querySelector("#meetingDate");
const meetingTime = document.querySelector("#meetingTime");
const dateSummary = document.querySelector("#dateSummary");

let maybeAttempts = 0;
let lastFocusedElement;
const weekdays = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];
const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

function updateDateSummary() {
  if (!meetingDate.value || !meetingTime.value) {
    dateSummary.textContent = "Sana va vaqtni tanlang";
    return;
  }

  const [year, month, day] = meetingDate.value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = weekdays[date.getDay()];
  dateSummary.textContent = `${weekday[0].toLocaleUpperCase()}${weekday.slice(1)}, ${day}-${months[month - 1]}, soat ${meetingTime.value}`;
}

meetingDate.addEventListener("input", updateDateSummary);
meetingTime.addEventListener("input", updateDateSummary);
updateDateSummary();

openButton.addEventListener("click", () => {
  scene.classList.add("is-open");
  invitation.setAttribute("aria-hidden", "false");
});

function showConfirmation() {
  lastFocusedElement = document.activeElement;
  confirmation.classList.add("is-visible");
  confirmation.setAttribute("aria-hidden", "false");
  closeConfirmation.focus();
  launchConfetti();
}

function hideConfirmation() {
  confirmation.classList.remove("is-visible");
  confirmation.setAttribute("aria-hidden", "true");
  lastFocusedElement?.focus();
}

function launchConfetti() {
  const pieces = ["💖", "💕", "✨", "♥"];
  for (let i = 0; i < 32; i += 1) {
    const piece = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 32;
    const distance = 90 + Math.random() * 210;
    piece.className = "confetti";
    piece.textContent = pieces[i % pieces.length];
    piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--y", `${Math.sin(angle) * distance - 70}px`);
    piece.style.setProperty("--spin", `${Math.random() * 500 - 250}deg`);
    piece.style.setProperty("--size", `${14 + Math.random() * 14}px`);
    piece.style.setProperty("--duration", `${900 + Math.random() * 600}ms`);
    confettiLayer.append(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

function moveMaybeButton() {
  maybeAttempts += 1;
  if (maybeAttempts >= 3) {
    maybeButton.classList.remove("is-shy");
    maybeButton.classList.add("is-yes");
    maybeButton.innerHTML = "Baribir yo‘q deya olmaysan 😉";
    maybeButton.setAttribute("aria-label", "Baribir yo‘q deya olmaysan, roziman");
    return;
  }

  const maxX = Math.max(0, maybeWrap.clientWidth - maybeButton.offsetWidth);
  maybeButton.classList.add("is-shy");
  maybeButton.style.left = `${Math.random() * maxX}px`;
  maybeButton.style.top = `${maybeAttempts % 2 === 0 ? 0 : 5}px`;
}

yesButton.addEventListener("click", showConfirmation);
maybeButton.addEventListener("click", () => {
  if (maybeButton.classList.contains("is-yes")) {
    showConfirmation();
    return;
  }
  moveMaybeButton();
});
closeConfirmation.addEventListener("click", hideConfirmation);
confirmation.addEventListener("click", (event) => {
  if (event.target === confirmation) hideConfirmation();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && confirmation.classList.contains("is-visible")) {
    hideConfirmation();
  }
});
