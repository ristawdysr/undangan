AOS.init({
  duration: 1000,
  once: true
});

const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

openBtn.addEventListener("click", () => {
  cover.classList.add("cover-up");

  setTimeout(() => {
    cover.style.display = "none";
    mainContent.classList.remove("hidden");
    mainContent.classList.add("main-show");
    musicBtn.classList.remove("hidden");

    window.scrollTo(0, 0);

    bgMusic.play().catch(() => {
      console.log("Musik belum bisa autoplay.");
    });

    AOS.refresh();
  }, 900);
});

musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.remove("pause");
  } else {
    bgMusic.pause();
    musicBtn.classList.add("pause");
  }
});

// Nama tamu dari URL
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
const ket = params.get("ket");

if (guest) document.getElementById("guestName").textContent = guest;
if (ket) document.getElementById("guestNote").textContent = ket;

// Countdown
function updateCountdown(targetDate, ids) {
  const target = new Date(targetDate).getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const distance = target - now;

    if (distance <= 0) {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "00";
      });
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const m = Math.floor((distance / (1000 * 60)) % 60);
    const s = Math.floor((distance / 1000) % 60);

    const values = [d, h, m, s];

    ids.forEach((id, index) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(values[index]).padStart(2, "0");
    });
  }, 1000);
}

updateCountdown("May 31, 2026 10:00:00", [
  "days",
  "hours",
  "minutes",
  "seconds"
]);

function miniCountdown(targetDate, elementId) {
  const target = new Date(targetDate).getTime();
  const element = document.getElementById(elementId);

  if (!element) return;

  setInterval(() => {
    const now = new Date().getTime();
    const distance = target - now;

    if (distance <= 0) {
      element.innerHTML = "<span>Acara berlangsung</span>";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const m = Math.floor((distance / (1000 * 60)) % 60);
    const s = Math.floor((distance / 1000) % 60);

    element.innerHTML = `
      <span>${d}<small>Hari</small></span>
      <span>${h}<small>Jam</small></span>
      <span>${m}<small>Menit</small></span>
      <span>${s}<small>Detik</small></span>
    `;
  }, 1000);
}

miniCountdown("May 31, 2026 13:00:00", "countResepsi1");
miniCountdown("August 2, 2026 09:00:00", "countResepsi2");

// Konfirmasi Kehadiran
const attendanceForm = document.getElementById("attendanceForm");
const attendanceList = document.getElementById("attendanceList");

let attendances = JSON.parse(localStorage.getItem("attendances")) || [];

function renderAttendances() {
  if (!attendanceList) return;

  attendanceList.innerHTML = "";

  attendances.forEach((item) => {
    const div = document.createElement("div");
    div.className = "wish-item";
    div.innerHTML = `
      <strong>${item.name}</strong>
      <p>${item.status}</p>
    `;
    attendanceList.appendChild(div);
  });
}

if (attendanceForm) {
  attendanceForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("attendanceName").value;
    const status = document.getElementById("attendanceStatus").value;

    attendances.unshift({ name, status });
    localStorage.setItem("attendances", JSON.stringify(attendances));

    attendanceForm.reset();
    renderAttendances();
  });
}

renderAttendances();

// Wedding Wish
const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

let wishes = JSON.parse(localStorage.getItem("wishes")) || [];

function renderWishes() {
  wishList.innerHTML = "";

  wishes.forEach((wish) => {
    const item = document.createElement("div");
    item.className = "wish-item";
    item.innerHTML = `
      <strong>${wish.name}</strong>
      <p>${wish.message}</p>
    `;
    wishList.appendChild(item);
  });
}

wishForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const message = document.getElementById("messageInput").value;

  wishes.unshift({ name, message });
  localStorage.setItem("wishes", JSON.stringify(wishes));

  wishForm.reset();
  renderWishes();
});

renderWishes();