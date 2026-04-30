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
      console.log("Autoplay blocked");
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


// =======================
// 🔹 AMBIL NAMA TAMU
// =======================

const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
const ket = params.get("ket");

if (guest) {
  document.getElementById("guestName").textContent = guest;
}

if (ket) {
  document.getElementById("guestNote").textContent = ket;
}


// =======================
// 🔹 COUNTDOWN
// =======================

function updateCountdown() {
  const target = new Date("May 31, 2026 10:00:00").getTime();
  const now = new Date().getTime();
  const distance = target - now;

  if (distance <= 0) return;

  document.getElementById("days").textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
  document.getElementById("hours").textContent = Math.floor((distance / (1000 * 60 * 60)) % 24);
  document.getElementById("minutes").textContent = Math.floor((distance / (1000 * 60)) % 60);
  document.getElementById("seconds").textContent = Math.floor((distance / 1000) % 60);
}

setInterval(updateCountdown, 1000);
updateCountdown();

// =======================
// GALLERY AUTO CAROUSEL LOOP
// =======================

const galleryCarousel = document.getElementById("galleryCarousel");

if (galleryCarousel) {
  let isHolding = false;

  const originalImages = Array.from(galleryCarousel.querySelectorAll("img"));

  originalImages.forEach((img) => {
    const clone = img.cloneNode(true);
    galleryCarousel.appendChild(clone);
  });

  galleryCarousel.querySelectorAll("img").forEach((img) => {
    img.classList.add("loaded");
  });

  function moveGallery() {
    if (!isHolding) {
      galleryCarousel.scrollLeft += 0.25;

      const loopPoint = galleryCarousel.scrollWidth / 2;

      if (galleryCarousel.scrollLeft >= loopPoint) {
        galleryCarousel.scrollLeft = 0;
      }
    }

    requestAnimationFrame(moveGallery);
  }

  galleryCarousel.addEventListener("touchstart", () => {
    isHolding = true;
  });

  galleryCarousel.addEventListener("touchend", () => {
    isHolding = false;
  });

  moveGallery();
}


// =======================
// SUPABASE SETUP
// =======================

const SUPABASE_URL = "https://uazzbikvmhbdznywifey.supabase.co";
const SUPABASE_KEY = "sb_publishable_xoIyGqBfkzXsFPSVGF2E4A_zDWKQnMz";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

async function loadWishes() {
  const { data, error } = await supabaseClient
    .from("wedding_wishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Gagal mengambil ucapan:", error);
    return;
  }

  wishList.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "wish-item";

    div.innerHTML = `
      <strong>${item.name}</strong>
      <small>${item.attendance}</small>
      <p>${item.message}</p>
    `;

    wishList.appendChild(div);
  });
}

wishForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const attendance = document.getElementById("attendanceStatus").value;
  const message = document.getElementById("messageInput").value;

  const { error } = await supabaseClient
    .from("wedding_wishes")
    .insert([
      {
        name,
        attendance,
        message,
        guest_name: guest || null,
        guest_note: ket || null
      }
    ]);

  if (error) {
    alert("Ucapan gagal dikirim.");
    console.log("Gagal mengirim ucapan:", error);
    return;
  }

  wishForm.reset();
  loadWishes();
});

loadWishes();

