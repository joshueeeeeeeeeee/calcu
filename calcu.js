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

/* ---------- SURPRISE! button: Gumball and Darwin pop out ---------- */

const BUDDY_RATIO = 0.72; // fallback width / height of the pictures

function buddyRatio(img) {
  if (img.naturalWidth && img.naturalHeight) {
    return img.naturalWidth / img.naturalHeight;
  }
  return BUDDY_RATIO;
}

function setBuddy(img, x, y, height, ratio) {
  img.style.left = x + "px";
  img.style.top = y + "px";
  img.style.height = height + "px";
  img.style.width = height * ratio + "px";
}

// Works out where the two characters go, based on the calculator's size
function placeBuddies() {
  const calc = document.querySelector(".calculator");
  const left = document.querySelector(".buddy-left");
  const right = document.querySelector(".buddy-right");
  if (!calc || !left || !right) return;

  // offset* values ignore the floating animation, so positions stay steady
  const cx = calc.offsetLeft;
  const cy = calc.offsetTop;
  const cw = calc.offsetWidth;
  const ch = calc.offsetHeight;
  const viewWidth = document.documentElement.clientWidth;

  const ratioL = buddyRatio(left);
  const ratioR = buddyRatio(right);
  const sideRoom = Math.min(cx, viewWidth - cx - cw) - 16;

  if (sideRoom >= 110) {
    // Enough space: one character on each side of the calculator
    document.body.classList.add("buddies-side");
    document.body.classList.remove("buddies-peek");

    const h = Math.min(ch * 0.9, sideRoom / Math.max(ratioL, ratioR), 520);
    setBuddy(left, cx - h * ratioL - 8, cy + ch - h, h, ratioL);
    setBuddy(right, cx + cw + 16, cy + ch - h, h, ratioR);
  } else {
    // Narrow screen (phones): peek over the top corners of the calculator
    document.body.classList.add("buddies-peek");
    document.body.classList.remove("buddies-side");

    const w = Math.min(viewWidth * 0.27, 120);
    const hL = w / ratioL;
    const hR = w / ratioR;
    const room = Math.max(cy - 6, 44);

    setBuddy(left, cx + cw * 0.07, cy - Math.min(room, hL * 0.75), hL, ratioL);
    setBuddy(right, cx + cw - w - cw * 0.07, cy - Math.min(room, hR * 0.75), hR, ratioR);
  }
}

function toggleBuddies(button) {
  const on = document.body.classList.toggle("buddies-on");
  placeBuddies();
  button.textContent = on ? "BYE BYE!" : "SURPRISE!";

  if (on) {
    // Confetti puff where each character appears
    setTimeout(() => {
      document.querySelectorAll(".buddy").forEach((img) => {
        const x = parseFloat(img.style.left) + parseFloat(img.style.width) / 2;
        const y = parseFloat(img.style.top) + parseFloat(img.style.height) / 2;
        burst(x, y, 14);
      });
    }, 250);
  }
}

window.addEventListener("resize", placeBuddies);
window.addEventListener("load", placeBuddies);
document.querySelectorAll(".buddy").forEach((img) => {
  img.addEventListener("load", placeBuddies);
});
placeBuddies();
