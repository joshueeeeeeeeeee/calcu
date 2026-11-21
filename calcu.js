function insert(num) {
  const screen = document.form1.textview;
  if (screen.value === "Error") {
    screen.value = "";
  }
  screen.value += num;
  checkEasterEgg();
}


function clearScreen() {
  document.form1.textview.value = "";
  checkEasterEgg();
}


function backspace() {
  const screen = document.form1.textview;
  screen.value = screen.value.slice(0, -1);
  checkEasterEgg();
}


function equal() {
  const screen = document.form1.textview;
  if (!screen.value) return;


  try {
    const result = eval(screen.value);
    if (Number.isFinite(result)) {
      screen.value = result;
      celebrate();
    } else {
      screen.value = "Error";
    }
  } catch (error) {
    screen.value = "Error";
  }
  checkEasterEgg();
}


function checkEasterEgg() {
  const calculator = document.querySelector(".calculator");
  const screen = document.form1.textview;


  if (screen.value === "5318008") {
    calculator.classList.add("upside-down");
  } else {
    calculator.classList.remove("upside-down");
  }
}


/* ---------- Clickable background ---------- */

const CONFETTI_COLORS = [
  "#2e9e44",
  "#38bfd9",
  "#a73a90",
  "#ec4899",
  "#ffe600",
  "#ff6a13",
  "#5b6fd6",
];

function randomColor() {
  return CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
}

// Circle of colored pieces flying out from a point
function burst(x, y, count = 16) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 50 + Math.random() * 60;

    piece.className = "burst-piece";
    piece.style.left = x + "px";
    piece.style.top = y + "px";
    piece.style.background = randomColor();
    piece.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    piece.style.setProperty("--dy", Math.sin(angle) * distance + "px");

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 900);
  }
}

// Confetti falling from the top of the screen
function confettiRain() {
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = randomColor();
    piece.style.animationDuration = 2 + Math.random() * 1.8 + "s";
    piece.style.animationDelay = Math.random() * 0.6 + "s";
    piece.style.setProperty("--drift", Math.random() * 120 - 60 + "px");

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4800);
  }
}

function spinSun(sun) {
  // Restart the spin even if it was triggered a moment ago
  sun.classList.remove("spin");
  void sun.offsetWidth;
  sun.classList.add("spin");
  setTimeout(() => sun.classList.remove("spin"), 1000);
}

function popBubble(bubble) {
  if (bubble.classList.contains("popped")) return;

  const rect = bubble.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2);

  bubble.classList.add("popped");
  setTimeout(() => bubble.classList.remove("popped"), 2500);
}

function clickSun(sun) {
  spinSun(sun);

  const rect = sun.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  confettiRain();
}

/* ---------- Background celebration when "=" is pressed ---------- */

function celebrate() {
  const calculator = document.querySelector(".calculator");
  const rect = calculator.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Flash of light across the sky
  const flash = document.createElement("div");
  flash.className = "flash";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 900);

  // Rainbow rings rippling out from the calculator
  const ringColors = ["#ec4899", "#ffe600", "#38bfd9"];
  ringColors.forEach((color, i) => {
    const ring = document.createElement("div");
    ring.className = "ring";
    ring.style.left = centerX + "px";
    ring.style.top = centerY + "px";
    ring.style.borderColor = color;
    ring.style.animationDelay = i * 0.15 + "s";
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1900);
  });

  // Confetti shooting from the top corners of the calculator
  burst(rect.left, rect.top, 12);
  burst(rect.right, rect.top, 12);

  // Bubbles bounce
  document.querySelectorAll(".bubble").forEach((bubble) => {
    bubble.classList.remove("cheer");
    void bubble.offsetWidth;
    bubble.classList.add("cheer");
    setTimeout(() => bubble.classList.remove("cheer"), 800);
  });

  // Sun spins
  const sun = document.querySelector(".sun");
  if (sun) spinSun(sun);
}